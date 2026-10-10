import math
import uuid
from typing import Any, Dict, Optional

from catalog.models import Professor
from django.db.models import Avg, Case, Count, Q, When
from review.models import Avaliacao, ResumoIADocente

from apps.catalog.schemas import (
    CampusOut,
    DepartamentoOut,
    DepartamentoSimpleOut,
    MateriaSimpleOut,
    ProfessorListItemOut,
    ProfessorProfileOut,
    ResumoDidaticaOut,
    ResumoIADocenteOut,
    TurmaOut,
)
from apps.core.exceptions import NotFoundException
from apps.core.pagination import PageMeta


def list_professores(
    page: int = 1,
    page_size: int = 20,
    nome: Optional[str] = None,
    departamento: Optional[str] = None,
    busca: Optional[str] = None,
    search: Optional[str] = None,
) -> Dict[str, Any]:
    """Lista professores com filtros por nome/departamento e suporte a paginação."""
    page = max(1, page)
    page_size = max(1, min(100, page_size))

    qs = (
        Professor.objects.select_related("departamento")
        .annotate(
            total_turmas=Count("turmas", distinct=True),
            total_avaliacoes=Count(
                "avaliacoes",
                filter=Q(
                    avaliacoes__status_moderacao=Avaliacao.StatusModeracao.PUBLICADA
                ),
                distinct=True,
            ),
            media_didatica=Avg(
                "avaliacoes__nota_didatica",
                filter=Q(
                    avaliacoes__status_moderacao=Avaliacao.StatusModeracao.PUBLICADA
                ),
            ),
        )
        .order_by("nome_completo")
    )

    if nome and nome.strip():
        qs = qs.filter(nome_completo__icontains=nome.strip())

    if departamento and departamento.strip():
        dep = departamento.strip()
        qs = qs.filter(
            Q(departamento__codigo__icontains=dep)
            | Q(departamento__nome__icontains=dep)
        )

    term = busca or search
    if term and term.strip():
        t = term.strip()
        qs = qs.filter(
            Q(nome_completo__icontains=t)
            | Q(departamento__codigo__icontains=t)
            | Q(departamento__nome__icontains=t)
            | Q(siape__icontains=t)
        )

    total_items = qs.count()
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 0
    offset = (page - 1) * page_size
    items_page = qs[offset : offset + page_size]

    items = []
    for p in items_page:
        dep_out = None
        if p.departamento:
            dep_out = DepartamentoSimpleOut(
                id=p.departamento.id,
                codigo=p.departamento.codigo,
                nome=p.departamento.nome,
            )
        media = (
            round(float(p.media_didatica), 2) if p.media_didatica is not None else None
        )
        items.append(
            ProfessorListItemOut(
                id=p.id,
                nome_completo=p.nome_completo,
                slug=p.slug,
                siape=p.siape,
                email_institucional=p.email_institucional,
                url_foto=p.url_foto,
                titulo_academico=p.titulo_academico,
                url_lattes=p.url_lattes,
                localizacao_gabinete=p.localizacao_gabinete,
                departamento=dep_out,
                total_turmas=p.total_turmas or 0,
                media_didatica=media,
                total_avaliacoes=p.total_avaliacoes or 0,
            )
        )

    return {
        "items": items,
        "meta": PageMeta(
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=total_pages,
        ),
    }


def get_professor_by_identifier(identifier: str) -> Professor:
    """Busca professor por UUID ou slug (com fallback para siape)."""
    professor = None
    try:
        val = uuid.UUID(identifier)
        professor = (
            Professor.objects.select_related("departamento__campus")
            .filter(id=val)
            .first()
        )
    except (ValueError, AttributeError):
        pass

    if not professor:
        professor = (
            Professor.objects.select_related("departamento__campus")
            .filter(slug=identifier)
            .first()
        )

    if not professor:
        professor = (
            Professor.objects.select_related("departamento__campus")
            .filter(siape=identifier)
            .first()
        )

    if not professor:
        raise NotFoundException("Professor não encontrado.")

    return professor


def get_professor_profile(identifier: str) -> ProfessorProfileOut:
    """Retorna dados cadastrais, turmas vinculadas e resumo de didática do professor."""
    professor = get_professor_by_identifier(identifier)

    # Turmas e Matérias vinculadas
    turmas_qs = (
        professor.turmas.select_related("materia")
        .all()
        .order_by("-semestre", "codigo_turma")
    )
    turmas_data = []
    seen_materias = set()
    materias_data = []

    for t in turmas_qs:
        m_out = MateriaSimpleOut(
            id=t.materia.id,
            codigo_materia=t.materia.codigo_materia,
            nome=t.materia.nome,
            slug=t.materia.slug,
            creditos=t.materia.creditos,
            carga_horaria=t.materia.carga_horaria,
        )
        turmas_data.append(
            TurmaOut(
                id=t.id,
                codigo_turma=t.codigo_turma,
                semestre=t.semestre,
                horario_bruto=t.horario_bruto,
                local_sala=t.local_sala,
                vagas_ofertadas=t.vagas_ofertadas,
                vagas_ocupadas=t.vagas_ocupadas,
                materia=m_out,
            )
        )
        if t.materia.id not in seen_materias:
            seen_materias.add(t.materia.id)
            materias_data.append(m_out)

    # Resumo de Didática & Avaliações
    avaliacoes_qs = Avaliacao.objects.filter(
        professor=professor,
        status_moderacao=Avaliacao.StatusModeracao.PUBLICADA,
    )
    stats = avaliacoes_qs.aggregate(
        total=Count("id"),
        media_didatica=Avg("nota_didatica"),
        media_dificuldade=Avg("nota_dificuldade"),
        total_cobra_presenca=Count(Case(When(cobra_presenca=True, then=1))),
        total_avaliacao_justa=Count(Case(When(avaliacao_justa=True, then=1))),
    )

    total_avaliacoes = stats["total"] or 0
    media_didatica = (
        round(float(stats["media_didatica"]), 2)
        if stats["media_didatica"] is not None
        else None
    )
    media_dificuldade = (
        round(float(stats["media_dificuldade"]), 2)
        if stats["media_dificuldade"] is not None
        else None
    )
    cobra_presenca_pct = (
        round((stats["total_cobra_presenca"] / total_avaliacoes) * 100, 1)
        if total_avaliacoes > 0
        else None
    )
    avaliacao_justa_pct = (
        round((stats["total_avaliacao_justa"] / total_avaliacoes) * 100, 1)
        if total_avaliacoes > 0
        else None
    )

    # Resumo IA Docente (se houver)
    resumo_ia_obj = ResumoIADocente.objects.filter(professor=professor).first()
    resumo_ia_data = None
    resumo_executivo = None
    badges = []
    selo_padge = None

    if resumo_ia_obj:
        resumo_executivo = resumo_ia_obj.resumo_executivo
        badges = resumo_ia_obj.badges or []
        selo_padge = resumo_ia_obj.selo_padge
        resumo_ia_data = ResumoIADocenteOut(
            id=resumo_ia_obj.id,
            resumo_executivo=resumo_ia_obj.resumo_executivo,
            badges=badges,
            selo_padge=selo_padge,
            atualizado_em=resumo_ia_obj.atualizado_em,
        )

    resumo_didatica_data = ResumoDidaticaOut(
        media_didatica=media_didatica,
        media_dificuldade=media_dificuldade,
        total_avaliacoes=total_avaliacoes,
        resumo_executivo=resumo_executivo,
        badges=badges,
        selo_padge=selo_padge,
        cobra_presenca_percentual=cobra_presenca_pct,
        avaliacao_justa_percentual=avaliacao_justa_pct,
    )

    # Departamento e Campus
    departamento_data = None
    if professor.departamento:
        campus_data = None
        if professor.departamento.campus:
            campus_data = CampusOut(
                id=professor.departamento.campus.id,
                sigla=professor.departamento.campus.sigla,
                nome=professor.departamento.campus.nome,
            )
        departamento_data = DepartamentoOut(
            id=professor.departamento.id,
            codigo=professor.departamento.codigo,
            nome=professor.departamento.nome,
            campus=campus_data,
        )

    return ProfessorProfileOut(
        id=professor.id,
        nome_completo=professor.nome_completo,
        slug=professor.slug,
        siape=professor.siape,
        email_institucional=professor.email_institucional,
        url_foto=professor.url_foto,
        titulo_academico=professor.titulo_academico,
        url_lattes=professor.url_lattes,
        localizacao_gabinete=professor.localizacao_gabinete,
        departamento=departamento_data,
        materias=materias_data,
        turmas=turmas_data,
        resumo_didatica=resumo_didatica_data,
        resumo_ia=resumo_ia_data,
    )

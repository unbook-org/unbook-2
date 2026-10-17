import logging
import math
from collections.abc import Iterable
from typing import Any
from uuid import UUID

from catalog.models import Departamento, Materia, Professor
from django.db.models import Avg, Case, Count, IntegerField, Q, QuerySet, Value, When
from django.db.models.functions import Lower
from review.models import Avaliacao, ResumoIADocente

from apps.catalog.schemas import (
    AvaliacaoItemOut,
    CampusOut,
    DepartamentoOpcaoOut,
    DepartamentoOut,
    DepartamentoResumoOut,
    DepartamentoSimpleOut,
    MateriaBuscaOut,
    MateriaDetalheOut,
    MateriaSimpleOut,
    ProfessorListItemOut,
    ProfessorProfileOut,
    RequisitoOut,
    ResumoDidaticaOut,
    ResumoIADocenteOut,
    TurmaOut,
)
from apps.core.db import SemAcento
from apps.core.exceptions import NotFoundException, UnBookException
from apps.core.pagination import PageMeta, paginar_consulta

TAMANHO_MINIMO_BUSCA = 3

logger = logging.getLogger(__name__)


def _coletar_codigos(arvore: Any) -> list[str]:
    """Percorre a árvore de requisitos (E/OU) e devolve os códigos das folhas."""
    if isinstance(arvore, list):
        return [codigo for item in arvore for codigo in _coletar_codigos(item)]
    if not isinstance(arvore, dict):
        return []
    if arvore.get("codigo"):
        return [arvore["codigo"]]
    return _coletar_codigos(arvore.get("condicao"))


def extrair_codigos_requisito(arvore: Any) -> list[str]:
    """Lista os códigos da árvore de requisitos sem repetição, na ordem em que aparecem."""
    return list(dict.fromkeys(_coletar_codigos(arvore)))


def _buscar_nomes_por_codigo(codigos: Iterable[str]) -> dict[str, str]:
    """Busca no banco, em uma única consulta, o nome de cada código de matéria."""
    codigos_unicos = set(codigos)
    if not codigos_unicos:
        return {}
    return dict(
        Materia.objects.filter(codigo_materia__in=codigos_unicos).values_list(
            "codigo_materia", "nome"
        )
    )


def _avisar_requisitos_nao_cadastrados(
    materia: Materia, codigos: list[str], nomes_por_codigo: dict[str, str]
) -> None:
    """Registra aviso quando a matéria aponta para requisitos que não existem no banco."""
    nao_cadastrados = sorted(set(codigos) - nomes_por_codigo.keys())
    if nao_cadastrados:
        logger.warning(
            "Matéria %s referencia requisitos não cadastrados: %s",
            materia.codigo_materia,
            ", ".join(nao_cadastrados),
        )


def _montar_requisitos(
    codigos: list[str], nomes_por_codigo: dict[str, str]
) -> list[RequisitoOut]:
    """Converte códigos em itens de resposta com código e nome (None se não cadastrado)."""
    return [
        RequisitoOut(codigo=codigo, nome=nomes_por_codigo.get(codigo))
        for codigo in codigos
    ]


def _serializar_departamento(materia: Materia) -> DepartamentoResumoOut | None:
    """Monta o resumo do departamento da matéria, ou None quando ela não tem departamento."""
    if materia.departamento_id is None:
        return None
    return DepartamentoResumoOut(
        codigo=materia.departamento.codigo,
        nome=materia.departamento.nome,
    )


def _buscar_materia_por_codigo(codigo: str) -> Materia:
    """Encontra a matéria pelo código ignorando espaços e caixa; lança 404 se não existir."""
    codigo_normalizado = codigo.strip().upper()
    materia = (
        Materia.objects.select_related("departamento")
        .filter(codigo_materia=codigo_normalizado)
        .first()
    )
    if materia is None:
        raise NotFoundException(f"Matéria {codigo_normalizado} não encontrada.")
    return materia


def get_materia_por_codigo(codigo: str) -> MateriaDetalheOut:
    """Retorna todos os dados da matéria, com requisitos em lista (código e nome) e em árvore."""
    materia = _buscar_materia_por_codigo(codigo)
    pre_requisitos = extrair_codigos_requisito(materia.pre_requisito)
    co_requisitos = extrair_codigos_requisito(materia.co_requisito)
    equivalencias = extrair_codigos_requisito(materia.equivalencia)
    todos_requisitos = pre_requisitos + co_requisitos + equivalencias
    nomes_por_codigo = _buscar_nomes_por_codigo(todos_requisitos)
    _avisar_requisitos_nao_cadastrados(materia, todos_requisitos, nomes_por_codigo)

    return MateriaDetalheOut(
        id=materia.id,
        codigo_materia=materia.codigo_materia,
        nome=materia.nome,
        slug=materia.slug,
        ementa=materia.ementa,
        creditos=materia.creditos,
        carga_horaria=materia.carga_horaria,
        nivel_de_ensino=materia.nivel_de_ensino,
        departamento=_serializar_departamento(materia),
        pre_requisitos=_montar_requisitos(pre_requisitos, nomes_por_codigo),
        co_requisitos=_montar_requisitos(co_requisitos, nomes_por_codigo),
        equivalencias=_montar_requisitos(equivalencias, nomes_por_codigo),
        pre_requisito_arvore=materia.pre_requisito,
        co_requisito_arvore=materia.co_requisito,
        equivalencia_arvore=materia.equivalencia,
    )


def listar_departamentos() -> list[DepartamentoOpcaoOut]:
    """Lista os departamentos que têm matérias, em ordem alfabética, com o total de cada um."""
    departamentos = (
        Departamento.objects.annotate(total_materias=Count("materias"))
        .filter(total_materias__gt=0)
        .order_by("nome")
    )
    return [
        DepartamentoOpcaoOut(
            id=departamento.id,
            codigo=departamento.codigo,
            nome=departamento.nome,
            total_materias=departamento.total_materias,
        )
        for departamento in departamentos
    ]


def _validar_criterios_busca(termo: str | None, departamento: UUID | None) -> str:
    """Exige termo com o tamanho mínimo ou um departamento; lança 400 caso contrário."""
    termo_limpo = (termo or "").strip()
    if termo_limpo and len(termo_limpo) < TAMANHO_MINIMO_BUSCA:
        raise UnBookException(
            f"Informe pelo menos {TAMANHO_MINIMO_BUSCA} caracteres para buscar matérias.",
            status_code=400,
        )
    if not termo_limpo and departamento is None:
        raise UnBookException(
            "Informe um termo de busca ou escolha um departamento.",
            status_code=400,
        )
    return termo_limpo


def _filtrar_por_termo(consulta: QuerySet, termo: str) -> QuerySet:
    """Filtra matérias cujo código ou nome contém o termo, ignorando acentos e caixa."""
    termo_normalizado = Lower(SemAcento(Value(termo)))
    return consulta.annotate(
        codigo_normalizado=Lower("codigo_materia"),
        nome_normalizado=Lower(SemAcento("nome")),
    ).filter(
        Q(codigo_normalizado__contains=termo_normalizado)
        | Q(nome_normalizado__contains=termo_normalizado)
    )


def _filtrar_por_departamento(consulta: QuerySet, departamento: UUID) -> QuerySet:
    """Mantém só as matérias do departamento informado (pelo id, pois há códigos repetidos)."""
    return consulta.filter(departamento_id=departamento)


def _ordenar_por_relevancia(consulta: QuerySet, termo: str) -> QuerySet:
    """Ordena: código que começa com o termo, depois nome que começa com ele, depois o resto."""
    termo_normalizado = Lower(SemAcento(Value(termo)))
    return consulta.annotate(
        relevancia=Case(
            When(codigo_normalizado__startswith=termo_normalizado, then=Value(0)),
            When(nome_normalizado__startswith=termo_normalizado, then=Value(1)),
            default=Value(2),
            output_field=IntegerField(),
        )
    ).order_by("relevancia", "nome", "codigo_materia")


def _registrar_busca(termo: str, departamento: UUID | None, meta: PageMeta) -> None:
    """Registra no log os critérios da busca e quantos resultados ela trouxe."""
    criterios = f"termo={termo!r}"
    if departamento is not None:
        criterios += f" departamento={departamento}"
    if meta.total_items == 0:
        logger.info("Busca de matérias %s: nenhum resultado", criterios)
        return
    logger.info(
        "Busca de matérias %s: %d %s (página %d de %d)",
        criterios,
        meta.total_items,
        "resultado" if meta.total_items == 1 else "resultados",
        meta.page,
        meta.total_pages,
    )


def buscar_materias(
    termo: str | None = None,
    departamento: UUID | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict[str, Any]:
    """Busca matérias por termo e/ou departamento e devolve a página pedida com os metadados."""
    termo_limpo = _validar_criterios_busca(termo, departamento)
    consulta = Materia.objects.select_related("departamento")
    if departamento is not None:
        consulta = _filtrar_por_departamento(consulta, departamento)
    if termo_limpo:
        consulta = _ordenar_por_relevancia(
            _filtrar_por_termo(consulta, termo_limpo), termo_limpo
        )
    else:
        consulta = consulta.order_by("nome", "codigo_materia")
    materias_pagina, meta = paginar_consulta(consulta, page, page_size)
    _registrar_busca(termo_limpo, departamento, meta)

    return {
        "items": [
            MateriaBuscaOut(
                codigo_materia=materia.codigo_materia,
                nome=materia.nome,
                departamento=_serializar_departamento(materia),
            )
            for materia in materias_pagina
        ],
        "meta": meta,
    }


def list_professores(
    page: int = 1,
    page_size: int = 20,
    nome: str | None = None,
    departamento: str | None = None,
    busca: str | None = None,
    search: str | None = None,
) -> dict[str, Any]:
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
        val = UUID(identifier)
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

    # Lista de avaliações individuais / comentários da comunidade
    avaliacoes_list = []
    for av in (
        avaliacoes_qs.select_related("turma")
        .prefetch_related("reacoes")
        .order_by("-criado_em")[:20]
    ):
        upvotes = sum(1 for r in av.reacoes.all() if r.tipo_reacao == "upvote")
        downvotes = sum(1 for r in av.reacoes.all() if r.tipo_reacao == "downvote")
        hash_curto = av.hash_anonimo[:4] if av.hash_anonimo else "2392"
        autor = f"Anônimo #{hash_curto}"
        semestre_av = av.turma.semestre if av.turma else None

        avaliacoes_list.append(
            AvaliacaoItemOut(
                id=av.id,
                autor_anonimo=autor,
                curso_autor="Estudante UnB",
                semestre=semestre_av,
                nota_didatica=av.nota_didatica,
                nota_dificuldade=av.nota_dificuldade,
                comentario=av.comentario,
                emoji_vibe=av.emoji_vibe or "😎",
                cobra_presenca=av.cobra_presenca,
                avaliacao_justa=av.avaliacao_justa,
                upvotes=upvotes,
                downvotes=downvotes,
                criado_em=av.criado_em,
            )
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
        avaliacoes=avaliacoes_list,
    )


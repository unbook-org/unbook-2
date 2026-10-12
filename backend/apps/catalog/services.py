import logging
from collections.abc import Iterable
from typing import Any

from catalog.models import Materia
from django.db.models import Case, IntegerField, Q, QuerySet, Value, When
from django.db.models.functions import Lower

from apps.catalog.schemas import (
    DepartamentoResumoOut,
    MateriaBuscaOut,
    MateriaDetalheOut,
    RequisitoOut,
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


def _validar_termo_busca(termo: str | None) -> str:
    """Remove espaços do termo e exige o tamanho mínimo da busca; lança 400 se for curto."""
    termo_limpo = (termo or "").strip()
    if len(termo_limpo) < TAMANHO_MINIMO_BUSCA:
        raise UnBookException(
            f"Informe pelo menos {TAMANHO_MINIMO_BUSCA} caracteres para buscar matérias.",
            status_code=400,
        )
    return termo_limpo


def _filtrar_por_termo(termo: str) -> QuerySet:
    """Filtra matérias cujo código ou nome contém o termo, ignorando acentos e caixa."""
    termo_normalizado = Lower(SemAcento(Value(termo)))
    return (
        Materia.objects.select_related("departamento")
        .annotate(
            codigo_normalizado=Lower("codigo_materia"),
            nome_normalizado=Lower(SemAcento("nome")),
        )
        .filter(
            Q(codigo_normalizado__contains=termo_normalizado)
            | Q(nome_normalizado__contains=termo_normalizado)
        )
    )


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


def _registrar_busca(termo: str, meta: PageMeta) -> None:
    """Registra no log o termo buscado e quantos resultados ele trouxe."""
    if meta.total_items == 0:
        logger.info("Busca de matérias termo=%r: nenhum resultado", termo)
        return
    logger.info(
        "Busca de matérias termo=%r: %d %s (página %d de %d)",
        termo,
        meta.total_items,
        "resultado" if meta.total_items == 1 else "resultados",
        meta.page,
        meta.total_pages,
    )


def buscar_materias(termo: str, page: int = 1, page_size: int = 20) -> dict[str, Any]:
    """Busca matérias por código ou nome e devolve a página pedida com os metadados."""
    termo_limpo = _validar_termo_busca(termo)
    consulta = _ordenar_por_relevancia(_filtrar_por_termo(termo_limpo), termo_limpo)
    materias_pagina, meta = paginar_consulta(consulta, page, page_size)
    _registrar_busca(termo_limpo, meta)

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

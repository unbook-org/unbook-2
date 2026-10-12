import logging
from collections.abc import Iterable
from typing import Any
from uuid import UUID

from catalog.models import Departamento, Materia
from django.db.models import Case, Count, IntegerField, Q, QuerySet, Value, When
from django.db.models.functions import Lower

from apps.catalog.schemas import (
    DepartamentoOpcaoOut,
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

from uuid import UUID

from ninja import Router

from apps.catalog.schemas import (
    DepartamentoOpcaoOut,
    MateriaBuscaOut,
    MateriaDetalheOut,
)
from apps.catalog.services import buscar_materias as fetch_materias_busca
from apps.catalog.services import get_materia_por_codigo as fetch_materia_detalhe
from apps.catalog.services import listar_departamentos as fetch_departamentos
from apps.core.pagination import PaginatedResponse

router = Router()
catalog_router = router


@router.get("/health")
def health_check(request):
    """Confirma que o módulo de catálogo está no ar."""
    return {"status": "ok", "module": "catalog"}


@router.get(
    "/departamentos",
    response=list[DepartamentoOpcaoOut],
    summary="Listar departamentos que têm matérias",
)
def listar_departamentos(request):
    """Lista os departamentos com matérias, em ordem alfabética, para filtros."""
    return fetch_departamentos()


@router.get(
    "/materia/busca",
    response=PaginatedResponse[MateriaBuscaOut],
    summary="Buscar matérias por termo (mínimo de 3 caracteres) e/ou departamento",
)
def buscar_materias(
    request,
    termo: str | None = None,
    departamento: UUID | None = None,
    page: int = 1,
    page_size: int = 20,
):
    """Busca matérias por código ou nome, ignorando acentos e caixa, com filtro opcional por departamento."""
    return fetch_materias_busca(
        termo=termo, departamento=departamento, page=page, page_size=page_size
    )


@router.get(
    "/materia/{codigo}",
    response=MateriaDetalheOut,
    summary="Detalhes completos da matéria pelo código",
)
def get_materia(request, codigo: str):
    """Retorna todos os dados da matéria, incluindo pré-requisitos com nome."""
    return fetch_materia_detalhe(codigo)

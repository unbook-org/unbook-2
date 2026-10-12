from ninja import Router

from apps.catalog.schemas import MateriaBuscaOut, MateriaDetalheOut
from apps.catalog.services import buscar_materias as fetch_materias_busca
from apps.catalog.services import get_materia_por_codigo as fetch_materia_detalhe
from apps.core.pagination import PaginatedResponse

router = Router()
catalog_router = router


@router.get("/health")
def health_check(request):
    """Confirma que o módulo de catálogo está no ar."""
    return {"status": "ok", "module": "catalog"}


@router.get(
    "/materia/busca",
    response=PaginatedResponse[MateriaBuscaOut],
    summary="Buscar matérias por código ou nome (mínimo de 3 caracteres)",
)
def buscar_materias(request, termo: str, page: int = 1, page_size: int = 20):
    """Busca matérias por código ou nome, sem diferenciar acentos e maiúsculas."""
    return fetch_materias_busca(termo=termo, page=page, page_size=page_size)


@router.get(
    "/materia/{codigo}",
    response=MateriaDetalheOut,
    summary="Detalhes completos da matéria pelo código",
)
def get_materia(request, codigo: str):
    """Retorna todos os dados da matéria, incluindo pré-requisitos com nome."""
    return fetch_materia_detalhe(codigo)

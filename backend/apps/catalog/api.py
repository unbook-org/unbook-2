from typing import Optional

from ninja import Router

from apps.catalog.schemas import (
    ProfessorListItemOut,
    ProfessorProfileOut,
)
from apps.catalog.services import (
    get_professor_profile as fetch_professor_profile,
    list_professores as fetch_professores_list,
)
from apps.core.pagination import PaginatedResponse

router = Router()
catalog_router = router


@router.get("/health")
def health_check(request):
    return {"status": "ok", "module": "catalog"}


@router.get(
    "/professores",
    response=PaginatedResponse[ProfessorListItemOut],
    summary="Listar professores com filtros e paginação",
)
@router.get(
    "/professores/",
    response=PaginatedResponse[ProfessorListItemOut],
    include_in_schema=False,
)
@router.get(
    "/professors",
    response=PaginatedResponse[ProfessorListItemOut],
    include_in_schema=False,
)
@router.get(
    "/professors/",
    response=PaginatedResponse[ProfessorListItemOut],
    include_in_schema=False,
)
def list_professores(
    request,
    page: int = 1,
    page_size: int = 20,
    nome: Optional[str] = None,
    departamento: Optional[str] = None,
    busca: Optional[str] = None,
    search: Optional[str] = None,
):
    return fetch_professores_list(
        page=page,
        page_size=page_size,
        nome=nome,
        departamento=departamento,
        busca=busca,
        search=search,
    )


@router.get(
    "/professores/{identifier}",
    response=ProfessorProfileOut,
    summary="Perfil detalhado do professor por ID ou slug",
)
@router.get(
    "/professores/{identifier}/",
    response=ProfessorProfileOut,
    include_in_schema=False,
)
@router.get(
    "/professors/{identifier}",
    response=ProfessorProfileOut,
    include_in_schema=False,
)
@router.get(
    "/professors/{identifier}/",
    response=ProfessorProfileOut,
    include_in_schema=False,
)
def get_professor_profile(request, identifier: str):
    return fetch_professor_profile(identifier)

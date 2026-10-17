from typing import Optional
from uuid import UUID

from ninja import Router

from apps.catalog.schemas import (
    DepartamentoOpcaoOut,
    MateriaBuscaOut,
    MateriaDetalheOut,
    ProfessorListItemOut,
    ProfessorProfileOut,
)
from apps.catalog.services import (
    buscar_materias as fetch_materias_busca,
    get_materia_por_codigo as fetch_materia_detalhe,
    get_professor_profile as fetch_professor_profile,
    list_professores as fetch_professores_list,
    listar_departamentos as fetch_departamentos,
)
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

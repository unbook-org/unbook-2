import math
from typing import Generic, TypeVar

from django.db.models import QuerySet
from ninja import Schema
from pydantic import Field

T = TypeVar("T")

TAMANHO_MAXIMO_PAGINA = 100


class PageMeta(Schema):
    """Metadados da paginação devolvidos junto com os itens."""

    page: int = Field(1, description="Número da página atual")
    page_size: int = Field(20, description="Quantidade de itens por página")
    total_items: int = Field(0, description="Total de itens disponíveis")
    total_pages: int = Field(0, description="Total de páginas calculadas")


class PaginatedResponse(Schema, Generic[T]):
    """Resposta paginada genérica: itens da página e metadados."""

    items: list[T]
    meta: PageMeta


def paginar_consulta(
    consulta: QuerySet, page: int, page_size: int
) -> tuple[QuerySet, PageMeta]:
    """Corta a consulta na página pedida, limitando o tamanho entre 1 e 100 itens."""
    pagina = max(1, page)
    tamanho = max(1, min(TAMANHO_MAXIMO_PAGINA, page_size))
    total_itens = consulta.count()
    inicio = (pagina - 1) * tamanho

    meta = PageMeta(
        page=pagina,
        page_size=tamanho,
        total_items=total_itens,
        total_pages=math.ceil(total_itens / tamanho),
    )
    return consulta[inicio : inicio + tamanho], meta

from typing import Generic, List, TypeVar
from ninja import Schema
from pydantic import Field

T = TypeVar("T")


class PageMeta(Schema):
    page: int = Field(1, description="Número da página atual")
    page_size: int = Field(20, description="Quantidade de itens por página")
    total_items: int = Field(0, description="Total de itens disponíveis")
    total_pages: int = Field(0, description="Total de páginas calculadas")


class PaginatedResponse(Schema, Generic[T]):
    items: List[T]
    meta: PageMeta

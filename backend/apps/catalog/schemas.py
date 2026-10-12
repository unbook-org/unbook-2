from typing import Any
from uuid import UUID

from ninja import Schema


class DepartamentoResumoOut(Schema):
    codigo: str
    nome: str


class RequisitoOut(Schema):
    codigo: str
    nome: str | None = None


class MateriaDetalheOut(Schema):
    id: UUID
    codigo_materia: str
    nome: str
    slug: str
    ementa: str | None = None
    creditos: int
    carga_horaria: int
    nivel_de_ensino: str | None = None
    departamento: DepartamentoResumoOut | None = None
    pre_requisitos: list[RequisitoOut]
    co_requisitos: list[RequisitoOut]
    equivalencias: list[RequisitoOut]
    pre_requisito_arvore: dict[str, Any] | list[Any] | None = None
    co_requisito_arvore: dict[str, Any] | list[Any] | None = None
    equivalencia_arvore: dict[str, Any] | list[Any] | None = None


class MateriaBuscaOut(Schema):
    codigo_materia: str
    nome: str
    departamento: DepartamentoResumoOut | None = None

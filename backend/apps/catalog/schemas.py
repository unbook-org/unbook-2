from typing import Any
from uuid import UUID

from ninja import Schema


class DepartamentoResumoOut(Schema):
    codigo: str
    nome: str


class DepartamentoOpcaoOut(Schema):
    id: UUID
    codigo: str
    nome: str
    total_materias: int


class RequisitoOut(Schema):
    codigo: str
    nome: str | None = None


class ProfessorResumoOut(Schema):
    nome_completo: str
    slug: str


class TurmaOut(Schema):
    id: UUID
    codigo_turma: str
    semestre: str
    horario_bruto: str
    local_sala: str | None = None
    vagas_ofertadas: int
    vagas_ocupadas: int
    professor: ProfessorResumoOut | None = None


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
    turmas: list[TurmaOut] = []


class MateriaBuscaOut(Schema):
    codigo_materia: str
    nome: str
    departamento: DepartamentoResumoOut | None = None

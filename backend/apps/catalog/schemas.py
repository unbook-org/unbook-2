from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from ninja import Schema


class CampusOut(Schema):
    id: UUID
    sigla: str
    nome: str


class DepartamentoOut(Schema):
    id: UUID
    codigo: str
    nome: str
    campus: Optional[CampusOut] = None


class DepartamentoSimpleOut(Schema):
    id: UUID
    codigo: str
    nome: str


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


class TurmaOut(Schema):
    id: UUID
    codigo_turma: str
    semestre: str
    horario_bruto: str
    local_sala: Optional[str] = None
    vagas_ofertadas: int
    vagas_ocupadas: int
    materia: MateriaSimpleOut


class ResumoIADocenteOut(Schema):
    id: UUID
    resumo_executivo: str
    badges: List[str] = []
    selo_padge: Optional[str] = None
    atualizado_em: Optional[datetime] = None


class ResumoDidaticaOut(Schema):
    media_didatica: Optional[float] = None
    media_dificuldade: Optional[float] = None
    total_avaliacoes: int = 0
    resumo_executivo: Optional[str] = None
    badges: List[str] = []
    selo_padge: Optional[str] = None
    cobra_presenca_percentual: Optional[float] = None
    avaliacao_justa_percentual: Optional[float] = None


class ProfessorListItemOut(Schema):
    id: UUID
    nome_completo: str
    slug: str
    siape: Optional[str] = None
    email_institucional: Optional[str] = None
    url_foto: Optional[str] = None
    titulo_academico: Optional[str] = None
    url_lattes: Optional[str] = None
    localizacao_gabinete: Optional[str] = None
    departamento: Optional[DepartamentoSimpleOut] = None
    total_turmas: int = 0
    media_didatica: Optional[float] = None
    total_avaliacoes: int = 0


class ProfessorProfileOut(Schema):
    id: UUID
    nome_completo: str
    slug: str
    siape: Optional[str] = None
    email_institucional: Optional[str] = None
    url_foto: Optional[str] = None
    titulo_academico: Optional[str] = None
    url_lattes: Optional[str] = None
    localizacao_gabinete: Optional[str] = None
    departamento: Optional[DepartamentoOut] = None
    materias: List[MateriaSimpleOut] = []
    turmas: List[TurmaOut] = []
    resumo_didatica: ResumoDidaticaOut
    resumo_ia: Optional[ResumoIADocenteOut] = None

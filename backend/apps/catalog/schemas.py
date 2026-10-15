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


# Schemas do módulo de Docentes / Professores


class CampusOut(Schema):
    id: UUID
    sigla: str
    nome: str


class DepartamentoOut(Schema):
    id: UUID
    codigo: str
    nome: str
    campus: CampusOut | None = None


class DepartamentoSimpleOut(Schema):
    id: UUID
    codigo: str
    nome: str


class MateriaSimpleOut(Schema):
    id: UUID
    codigo_materia: str
    nome: str
    slug: str
    creditos: int
    carga_horaria: int


class TurmaOut(Schema):
    id: UUID
    codigo_turma: str
    semestre: str
    horario_bruto: str
    local_sala: str | None = None
    vagas_ofertadas: int
    vagas_ocupadas: int
    materia: MateriaSimpleOut


class ResumoIADocenteOut(Schema):
    id: UUID
    resumo_executivo: str
    badges: list[str] = []
    selo_padge: str | None = None
    atualizado_em: Any | None = None


class ResumoDidaticaOut(Schema):
    media_didatica: float | None = None
    media_dificuldade: float | None = None
    total_avaliacoes: int = 0
    resumo_executivo: str | None = None
    badges: list[str] = []
    selo_padge: str | None = None
    cobra_presenca_percentual: float | None = None
    avaliacao_justa_percentual: float | None = None


class AvaliacaoItemOut(Schema):
    id: UUID
    autor_anonimo: str
    curso_autor: str | None = None
    semestre: str | None = None
    nota_didatica: int
    nota_dificuldade: int
    comentario: str | None = None
    emoji_vibe: str = "😎"
    cobra_presenca: bool = False
    avaliacao_justa: bool = True
    upvotes: int = 0
    downvotes: int = 0
    criado_em: Any | None = None


class ProfessorListItemOut(Schema):
    id: UUID
    nome_completo: str
    slug: str
    siape: str | None = None
    email_institucional: str | None = None
    url_foto: str | None = None
    titulo_academico: str | None = None
    url_lattes: str | None = None
    localizacao_gabinete: str | None = None
    departamento: DepartamentoSimpleOut | None = None
    total_turmas: int = 0
    media_didatica: float | None = None
    total_avaliacoes: int = 0


class ProfessorProfileOut(Schema):
    id: UUID
    nome_completo: str
    slug: str
    siape: str | None = None
    email_institucional: str | None = None
    url_foto: str | None = None
    titulo_academico: str | None = None
    url_lattes: str | None = None
    localizacao_gabinete: str | None = None
    departamento: DepartamentoOut | None = None
    materias: list[MateriaSimpleOut] = []
    turmas: list[TurmaOut] = []
    resumo_didatica: ResumoDidaticaOut
    resumo_ia: ResumoIADocenteOut | None = None
    avaliacoes: list[AvaliacaoItemOut] = []


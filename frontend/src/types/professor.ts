export interface CampusDocente {
  id: string;
  sigla: string;
  nome: string;
}

export interface DepartamentoDocente {
  id: string;
  codigo: string;
  nome: string;
  campus?: CampusDocente | null;
}

export interface MateriaDocente {
  id: string;
  codigo_materia: string;
  nome: string;
  slug: string;
  creditos: number;
  carga_horaria: number;
}

export interface TurmaDocente {
  id: string;
  codigo_turma: string;
  semestre: string;
  horario_bruto: string;
  local_sala?: string | null;
  vagas_ofertadas: number;
  vagas_ocupadas: number;
  materia: MateriaDocente;
}

export interface ResumoIADocente {
  id: string;
  resumo_executivo: string;
  badges: string[];
  selo_padge?: string | null;
  atualizado_em?: string | null;
}

export interface ResumoDidatica {
  media_didatica?: number | null;
  media_dificuldade?: number | null;
  total_avaliacoes: number;
  resumo_executivo?: string | null;
  badges: string[];
  selo_padge?: string | null;
  cobra_presenca_percentual?: number | null;
  avaliacao_justa_percentual?: number | null;
}

export interface AvaliacaoComentario {
  id: string;
  autor_anonimo: string;
  curso_autor?: string | null;
  semestre?: string | null;
  nota_didatica: number;
  nota_dificuldade: number;
  comentario?: string | null;
  emoji_vibe: string;
  cobra_presenca: boolean;
  avaliacao_justa: boolean;
  upvotes: number;
  downvotes: number;
  criado_em?: string | null;
}

export interface ProfessorProfile {
  id: string;
  nome_completo: string;
  slug: string;
  siape?: string | null;
  email_institucional?: string | null;
  url_foto?: string | null;
  titulo_academico?: string | null;
  url_lattes?: string | null;
  localizacao_gabinete?: string | null;
  departamento?: DepartamentoDocente | null;
  materias: MateriaDocente[];
  turmas: TurmaDocente[];
  resumo_didatica: ResumoDidatica;
  resumo_ia?: ResumoIADocente | null;
  avaliacoes: AvaliacaoComentario[];
}

export interface ProfessorListItem {
  id: string;
  nome_completo: string;
  slug: string;
  siape?: string | null;
  email_institucional?: string | null;
  url_foto?: string | null;
  titulo_academico?: string | null;
  url_lattes?: string | null;
  localizacao_gabinete?: string | null;
  departamento?: {
    id: string;
    codigo: string;
    nome: string;
  } | null;
  total_turmas: number;
  media_didatica?: number | null;
  total_avaliacoes: number;
}

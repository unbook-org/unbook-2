export interface Departamento {
  codigo: string;
  nome: string;
}

export interface DepartamentoOpcao extends Departamento {
  id: string;
  total_materias: number;
}

export interface Requisito {
  codigo: string;
  nome: string | null;
}

export type ArvoreRequisito =
  | { codigo: string; materia_id: string | null }
  | { 'relação': 'AND' | 'OR'; condicao: ArvoreRequisito[] };

export interface MateriaResumo {
  codigo_materia: string;
  nome: string;
  departamento: Departamento | null;
  // Ainda não exposto pela busca; o mesmo código pode existir em níveis diferentes.
  nivel_de_ensino?: string | null;
}

export interface ProfessorResumo {
  nome_completo: string;
  slug: string;
}

export interface Turma {
  id: string;
  codigo_turma: string;
  semestre: string;
  horario_bruto: string;
  local_sala: string | null;
  vagas_ofertadas: number;
  vagas_ocupadas: number;
  professor: ProfessorResumo | null;
}

export interface MateriaDetalhe extends MateriaResumo {
  id: string;
  slug: string;
  ementa: string | null;
  creditos: number;
  carga_horaria: number;
  nivel_de_ensino: string | null;
  pre_requisitos: Requisito[];
  co_requisitos: Requisito[];
  equivalencias: Requisito[];
  pre_requisito_arvore: ArvoreRequisito | ArvoreRequisito[] | null;
  co_requisito_arvore: ArvoreRequisito | ArvoreRequisito[] | null;
  equivalencia_arvore: ArvoreRequisito | ArvoreRequisito[] | null;
  // Ainda não exposto pelo endpoint de detalhes; a tela trata a ausência.
  turmas?: Turma[];
}

export interface Pagina<Item> {
  items: Item[];
  meta: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface ProfessorCatalogo {
  id: string;
  nome_completo: string;
  slug: string;
  titulo_academico: string | null;
  url_foto: string | null;
  departamento: Departamento | null;
  total_turmas: number;
}

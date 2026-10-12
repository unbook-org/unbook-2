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

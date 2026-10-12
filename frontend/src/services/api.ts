import type {
  DepartamentoOpcao,
  MateriaDetalhe,
  MateriaResumo,
  Pagina,
  ProfessorCatalogo,
} from '../types/materia';
import type { NivelEnsino } from '../utils/nivelEnsino';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api';

export const TAMANHO_MINIMO_BUSCA = 3;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function requisitar<Resposta>(caminho: string, sinal?: AbortSignal): Promise<Resposta> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, { signal: sinal });
  } catch (erro) {
    if (erro instanceof Error && erro.name === 'AbortError') {
      throw erro;
    }
    throw new ApiError('Não foi possível conectar ao servidor.', 0);
  }

  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new ApiError(corpo?.error ?? 'Erro inesperado no servidor.', resposta.status);
  }
  return corpo as Resposta;
}

export interface FiltrosBusca {
  termo: string;
  departamentoId: string | null;
  pagina: number;
  tamanhoPagina?: number;
}

export function buscarMaterias(
  { termo, departamentoId, pagina, tamanhoPagina = 10 }: FiltrosBusca,
  sinal?: AbortSignal,
) {
  const parametros = new URLSearchParams({
    page: String(pagina),
    page_size: String(tamanhoPagina),
  });
  if (termo) {
    parametros.set('termo', termo);
  }
  if (departamentoId) {
    parametros.set('departamento', departamentoId);
  }
  return requisitar<Pagina<MateriaResumo>>(`/catalog/materia/busca?${parametros}`, sinal);
}

export function listarDepartamentos(sinal?: AbortSignal) {
  return requisitar<DepartamentoOpcao[]>('/catalog/departamentos', sinal);
}

export function getMateria(codigo: string, nivel: NivelEnsino, sinal?: AbortSignal) {
  return requisitar<MateriaDetalhe>(
    `/catalog/materia/${encodeURIComponent(codigo)}?nivel=${nivel}`,
    sinal,
  );
}

export interface FiltrosProfessores {
  termo: string;
  departamentoCodigo: string | null;
  pagina: number;
  tamanhoPagina?: number;
}

// Retorna `null` enquanto o endpoint de professores não estiver disponível (404).
export function listarProfessores(
  { termo, departamentoCodigo, pagina, tamanhoPagina = 20 }: FiltrosProfessores,
  sinal?: AbortSignal,
): Promise<Pagina<ProfessorCatalogo> | null> {
  const parametros = new URLSearchParams({
    page: String(pagina),
    page_size: String(tamanhoPagina),
  });
  if (termo) {
    parametros.set('busca', termo);
  }
  if (departamentoCodigo) {
    parametros.set('departamento', departamentoCodigo);
  }
  return requisitar<Pagina<ProfessorCatalogo>>(`/catalog/professores?${parametros}`, sinal).catch(
    (erro) => {
      if (erro instanceof ApiError && erro.status === 404) {
        return null;
      }
      throw erro;
    },
  );
}

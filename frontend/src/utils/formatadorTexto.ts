/**
 * Utilitários de formatação de nomes e textos para a interface do UnBook.
 */

const PREPOSICOES_PT = new Set(['de', 'da', 'do', 'dos', 'das', 'e', 'em']);

/**
 * Converte nomes completos em CAIXA ALTA (comuns em bancos acadêmicos)
 * para Title Case amigável, preservando preposições minúsculas.
 * Exemplo: "RENDISLEY ARISTOTELES DOS SANTOS PAIVA" -> "Rendisley Aristoteles dos Santos Paiva"
 */
export function formatarNomeProfessor(nomeCompleto: string): string {
  if (!nomeCompleto) return '';
  const partes = nomeCompleto.trim().toLowerCase().split(/\s+/);
  return partes
    .map((palavra, index) => {
      if (index > 0 && PREPOSICOES_PT.has(palavra)) {
        return palavra;
      }
      return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    })
    .join(' ');
}

/**
 * Retorna o primeiro e último nome do professor para títulos curtos.
 * Exemplo: "Rendisley Aristoteles dos Santos Paiva" -> "Rendisley Paiva"
 */
export function formatarNomeCurto(nomeCompleto: string): string {
  if (!nomeCompleto) return '';
  const formatado = formatarNomeProfessor(nomeCompleto);
  const partes = formatado.split(/\s+/).filter(Boolean);
  if (partes.length <= 2) return formatado;
  return `${partes[0]} ${partes[partes.length - 1]}`;
}

/**
 * Limpa nomes longos de departamentos da UnB retornados do banco.
 * Exemplo: "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA" -> "FGA • Campus Gama"
 */
export function formatarDepartamentoCurto(depto?: {
  codigo?: string;
  nome?: string;
  campus?: { nome?: string; sigla?: string } | null;
} | null): string {
  if (!depto) return '';

  const sigla = depto.codigo ? depto.codigo.toUpperCase().trim() : '';

  let campusNome = depto.campus?.sigla || depto.campus?.nome || '';
  if (campusNome.toLowerCase().includes('gama')) {
    campusNome = 'Gama';
  } else if (campusNome.toLowerCase().includes('darcy')) {
    campusNome = 'Darcy Ribeiro';
  } else if (campusNome.toLowerCase().includes('ceil')) {
    campusNome = 'Ceilândia';
  } else if (campusNome.toLowerCase().includes('plan')) {
    campusNome = 'Planaltina';
  }

  if (sigla && campusNome) {
    return `${sigla} • Campus ${campusNome}`;
  }
  if (sigla) return sigla;

  const nome = depto.nome || '';
  if (nome.includes(':')) {
    const apos = nome.split(':')[1]?.trim() || '';
    if (apos.length > 0 && apos.length <= 32) return apos;
  }
  if (nome.length > 32) {
    return nome.slice(0, 30) + '...';
  }
  return nome;
}

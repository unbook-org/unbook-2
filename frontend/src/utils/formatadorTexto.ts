/**
 * Utilitários de formatação de nomes e textos para a interface do UnBook.
 */

const PREPOSICOES_PT = new Set([
  'de',
  'da',
  'do',
  'dos',
  'das',
  'e',
  'em',
  'para',
  'com',
  'por',
  'a',
  'o',
  'ao',
  'aos',
  'à',
  'às',
  'na',
  'no',
  'nas',
  'nos',
  'pelo',
  'pela',
]);

const ALGARISMOS_ROMANOS = new Set([
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'vi',
  'vii',
  'viii',
  'ix',
  'x',
]);

const SIGLAS_MAIUSCULAS = new Set([
  'fga',
  'fce',
  'fup',
  'cic',
  'mat',
  'ifd',
  'iqd',
  'enc',
  'ene',
  'epr',
  'enm',
  'ft',
  'fau',
  'fd',
  'fe',
  'fs',
  'fm',
  'il',
  'ip',
  'iq',
  'ib',
  'ig',
  'ih',
  'ics',
  'sol',
  'eco',
  'adm',
  'cca',
  'tcc',
  'ia',
  'poo',
  'apc',
  'eda',
  'sbd',
  'so',
  'sus',
  'df',
  'ead',
  'paa',
  'fso',
  'oac',
  'lfa',
  'mds',
  'gpp',
  'eps',
  'peac',
  'pi1',
  'pi2',
]);

function capitalizarToken(token: string, isFirst: boolean): string {
  if (!token) return '';

  // Se o token começa ou termina com parênteses/colchetes, ex: "(teorica)"
  const matchPontuacao = token.match(/^([([{"'«]*)(.*?)([)\]}"'»,.:;!?]*)$/);
  if (!matchPontuacao) {
    return token.charAt(0).toUpperCase() + token.slice(1);
  }

  const [, prefixo, nucleo, sufixo] = matchPontuacao;
  if (!nucleo) return token;

  // Caso tenha hífen interno, ex: "fisica-matematica" ou "pre-requisito"
  if (nucleo.includes('-')) {
    const partesHifen = nucleo
      .split('-')
      .map((p, idx) => capitalizarToken(p, isFirst || idx === 0));
    return `${prefixo}${partesHifen.join('-')}${sufixo}`;
  }

  const limpo = nucleo.toLowerCase();

  if (limpo === 'unb') {
    return `${prefixo}UnB${sufixo}`;
  }

  if (ALGARISMOS_ROMANOS.has(limpo) || SIGLAS_MAIUSCULAS.has(limpo)) {
    return `${prefixo}${limpo.toUpperCase()}${sufixo}`;
  }

  // Se não tem parênteses abrindo e não é a primeira palavra, mantém preposição minúscula
  if (!isFirst && !prefixo && PREPOSICOES_PT.has(limpo)) {
    return `${prefixo}${limpo}${sufixo}`;
  }

  const capitalizado = limpo.charAt(0).toUpperCase() + limpo.slice(1);
  return `${prefixo}${capitalizado}${sufixo}`;
}

/**
 * Converte nomes completos ou títulos de disciplinas em CAIXA ALTA (comuns no SIGAA)
 * para Title Case amigável, preservando preposições minúsculas, siglas da UnB e algarismos romanos.
 * Exemplo: "RENDISLEY ARISTOTELES DOS SANTOS PAIVA" -> "Rendisley Aristoteles dos Santos Paiva"
 * Exemplo: "CALCULO II (TEORICA)" -> "Cálculo II (Teórica)"
 */
export function formatarNomeProfessor(nomeCompleto: string): string {
  if (!nomeCompleto) return '';
  const partes = nomeCompleto.trim().toLowerCase().split(/\s+/);
  return partes
    .map((palavra, index) => capitalizarToken(palavra, index === 0))
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
 * Obtém até 2 iniciais do primeiro e último nome do docente.
 * Exemplo: "Rendisley Aristoteles dos Santos Paiva" -> "RP"
 */
export function obterIniciaisDocente(nomeCompleto?: string | null): string {
  if (!nomeCompleto) return '?';
  const partes = nomeCompleto
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0 && !PREPOSICOES_PT.has(p.toLowerCase()));
  if (partes.length === 0) return '?';
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

/**
 * Formata o nome extenso de um departamento removendo prefixos redundantes do SIGAA.
 * Exemplo: "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA"
 *       -> "Faculdade de Ciências e Tecnologias em Engenharia"
 */
export function formatarNomeDepartamentoLimpo(nomeBruto?: string | null): string {
  if (!nomeBruto) return '';
  let limpo = nomeBruto.trim();
  if (limpo.includes(':')) {
    const partes = limpo.split(':');
    const apos = partes.slice(1).join(':').trim();
    if (apos.length > 0) {
      limpo = apos;
    }
  }
  limpo = limpo.replace(/^DEPARTAMENTO DE\s+/i, 'Depto. de ');
  return formatarNomeProfessor(limpo);
}

/**
 * Limpa nomes longos de departamentos da UnB retornados do banco para badges compactas.
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
  const nomeDeptoLower = (depto.nome || '').toLowerCase();

  if (campusNome.toLowerCase().includes('gama') || nomeDeptoLower.includes('gama')) {
    campusNome = 'Gama';
  } else if (campusNome.toLowerCase().includes('darcy') || nomeDeptoLower.includes('darcy')) {
    campusNome = 'Darcy Ribeiro';
  } else if (campusNome.toLowerCase().includes('ceil') || nomeDeptoLower.includes('ceil')) {
    campusNome = 'Ceilândia';
  } else if (campusNome.toLowerCase().includes('plan') || nomeDeptoLower.includes('plan')) {
    campusNome = 'Planaltina';
  }

  if (sigla && campusNome) {
    return `${sigla} • Campus ${campusNome}`;
  }
  if (sigla) {
    const nomeLimpo = formatarNomeDepartamentoLimpo(depto.nome);
    if (nomeLimpo && nomeLimpo.toUpperCase() !== sigla && nomeLimpo.length <= 36) {
      return `${sigla} • ${nomeLimpo}`;
    }
    return sigla;
  }

  const nomeFormatado = formatarNomeDepartamentoLimpo(depto.nome);
  if (nomeFormatado.length > 36) {
    return nomeFormatado.slice(0, 34) + '...';
  }
  return nomeFormatado;
}

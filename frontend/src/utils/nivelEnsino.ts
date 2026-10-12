/**
 * Níveis de ensino do SIGAA. O código de uma matéria só é único dentro do nível
 * (ex.: FCE0001 existe em Graduação e em Formação Complementar), então a matéria
 * é identificada por código + nível.
 */

export const NIVEIS_ENSINO = [
  'graduacao',
  'formacao-complementar',
  'lato-sensu-especializacao',
  'lato-sensu-residencia',
  'stricto-sensu',
] as const;

export type NivelEnsino = (typeof NIVEIS_ENSINO)[number];

// Graduação é o nível padrão quando a origem não informa o nível (ex.: busca).
export const NIVEL_PADRAO: NivelEnsino = 'graduacao';

/** Converte o nível vindo da API (ex.: "LATO SENSU - ESPECIALIZAÇÃO") para o valor enviado no `?nivel=`. */
export function nivelDaApi(nivel: string | null | undefined): NivelEnsino | null {
  if (!nivel) {
    return null;
  }
  const normalizado = nivel
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return NIVEIS_ENSINO.find((opcao) => opcao === normalizado) ?? null;
}

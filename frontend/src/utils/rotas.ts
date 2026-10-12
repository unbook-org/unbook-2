import type { Href } from 'expo-router';
import { NIVEL_PADRAO, type NivelEnsino } from './nivelEnsino';

/** Link da página da matéria; o nível só vai na URL quando não é o padrão (Graduação). */
export function hrefMateria(codigo: string, nivel: NivelEnsino = NIVEL_PADRAO): Href {
  const caminho = `/materia/${encodeURIComponent(codigo)}`;
  return (nivel === NIVEL_PADRAO ? caminho : `${caminho}?nivel=${nivel}`) as Href;
}

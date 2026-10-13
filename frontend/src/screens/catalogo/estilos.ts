import { Platform } from 'react-native';
import { theme } from '../../constants/theme';

export const LARGURA_MAXIMA = 1280;

export const fonteMono = Platform.select({
  web: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  ios: 'Menlo',
  default: 'monospace',
});

// Cores dos cards do Figma; o texto acompanha o contraste de cada fundo.
const CORES_CARTAO = [
  { fundo: '#4F6BF5', texto: theme.colors.white },
  { fundo: '#F7D95C', texto: theme.colors.dark },
  { fundo: '#4CA66F', texto: theme.colors.white },
  { fundo: '#1F1F1F', texto: theme.colors.white },
  { fundo: '#EF9152', texto: theme.colors.white },
  { fundo: '#EC5A50', texto: theme.colors.white },
  { fundo: '#9B51F5', texto: theme.colors.white },
  { fundo: '#F3F0E4', texto: theme.colors.dark },
];

/** Cor estável a partir de uma chave: o mesmo item mantém a cor, e itens vizinhos variam como no Figma. */
export function corDoCartao(chave: string) {
  let hash = 0;
  for (const caractere of chave) {
    hash = (hash * 31 + caractere.charCodeAt(0)) >>> 0;
  }
  return CORES_CARTAO[hash % CORES_CARTAO.length];
}

export const sombra = (deslocamento: number) =>
  Platform.OS === 'web'
    ? ({ boxShadow: `${deslocamento}px ${deslocamento}px 0px ${theme.colors.dark}` } as object)
    : {
        shadowColor: theme.colors.dark,
        shadowOffset: { width: deslocamento, height: deslocamento },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: deslocamento,
      };

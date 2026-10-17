import { Platform } from 'react-native';
import { theme } from '../../constants/theme';

export const LARGURA_MAXIMA = 1180;

// Tons do Figma da página de matéria que não existem na paleta global.
export const coresMateria = {
  fundo: theme.colors.beige,
  horas: '#E0995E',
  dificil: { fundo: '#FBD5D5', texto: theme.colors.danger },
  medio: { fundo: theme.colors.warning, texto: theme.colors.dark },
  facil: { fundo: '#C9F5D2', texto: theme.colors.secondary },
  indefinido: { fundo: theme.colors.lightGray, texto: theme.colors.darkCharcoal },
  avatares: ['#F7E14B', '#DCDDFB', '#A8F0B4', '#E4E4DC', '#C2CCC0', '#F3C7A6'],
};

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

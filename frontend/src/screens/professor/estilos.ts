import { Platform } from 'react-native';
import { theme } from '../../constants/theme';

export const LARGURA_MAXIMA = 1180;

export const coresProfessor = {
  fundo: theme.colors.beige,
  cardFundo: '#EFECE6',
  primaria: '#1349EB',
  roxo: '#5B50E6',
  verde: '#009A5E',
  amarelo: '#F1C321',
  salmao: '#E0995E',
  laranjaSuave: '#F3C7A6',
  vermelho: '#FE4141',
  borda: '#1F1F1F',
  cartaoVagas: '#F1C321',
  cartaoLocal: '#E0995E',
  cartaoHorario: '#009A5E',
  cartaoRecomendacao: '#FFFFFF',
  avatares: ['#F7E14B', '#DCDDFB', '#A8F0B4', '#E4E4DC', '#C2CCC0', '#F3C7A6'],
  tags: {
    exigente: { fundo: '#FFFFFF', texto: '#1F1F1F' },
    oscar: { fundo: '#F1C321', texto: '#1F1F1F' },
    genteboa: { fundo: '#009A5E', texto: '#FFFFFF' },
    recomendo: { fundo: '#5B4F1B', texto: '#FFFFFF' },
    fisicodoido: { fundo: '#FFFFFF', texto: '#1F1F1F' },
    padrao: { fundo: '#EFEDE1', texto: '#1F1F1F' },
  },
};

export const sombra = (deslocamento = 4) =>
  Platform.OS === 'web'
    ? ({ boxShadow: `${deslocamento}px ${deslocamento}px 0px #1F1F1F` } as object)
    : {
        shadowColor: '#1F1F1F',
        shadowOffset: { width: deslocamento, height: deslocamento },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: deslocamento,
      };


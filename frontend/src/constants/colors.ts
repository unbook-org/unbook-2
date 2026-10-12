/**
 * Paleta de Cores do UnBook 2.0
 * Extraída da paleta do projeto (Design System).
 */

export const colors = {
  // Cores Principais / Identidade
  primary: '#1349EB',          // Azul vibrante de ação / destaque
  secondary: '#009A5E',        // Verde oficial UnB / sucesso / destaque

  // Status & Alertas
  warning: '#F1C321',          // Amarelo / Destaque / Avaliação
  danger: '#FE4141',           // Vermelho / Alerta / Erro
  error: '#FE4141',
  success: '#009A5E',

  // Tons Escuros & Neutros
  dark: '#1F1F1F',             // Cinza muito escuro / Dark mode surface
  darkCharcoal: '#272725',     // Preto suave / Carvão
  gray: '#707070',             // Cinza médio neutro
  lightGray: '#D9D9D9',        // Cinza claro / Bordas / Linhas
  border: '#D9D9D9',

  // Tons Claros & Superfícies
  white: '#FFFFFF',            // Branco puro
  background: '#F6F6F5',       // Fundo claro padrão
  cream: '#FCFAEC',            // Creme / Marfim suave
  sand: '#F3EBE4',             // Bege areia quente
  beige: '#EFEDE1',            // Bege acinzentado suave

  // Textos Diretos
  textPrimary: '#272725',      // Texto principal escuro
  textSecondary: '#707070',    // Texto secundário / legendas
  textLight: '#FFFFFF',        // Texto claro em fundos escuros/coloridos
  textMuted: '#707070',

  // Mapeamentos Semânticos Agrupados
  text: {
    primary: '#272725',
    secondary: '#707070',
    light: '#FFFFFF',
    dark: '#1F1F1F',
    muted: '#707070',
    link: '#1349EB',
  },

  surface: {
    default: '#FFFFFF',
    background: '#F6F6F5',
    card: '#EFEDE1',
    cardAlt: '#F3EBE4',
    cardWarm: '#FCFAEC',
    border: '#D9D9D9',
    dark: '#1F1F1F',
  },
} as const;

export type Colors = typeof colors;

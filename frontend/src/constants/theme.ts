import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
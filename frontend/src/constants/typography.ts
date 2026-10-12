/**
 * Tipografia e tamanhos de fonte do UnBook 2.0
 */

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    hero: 34,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export type Typography = typeof typography;

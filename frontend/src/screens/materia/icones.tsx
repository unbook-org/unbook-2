import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { theme } from '../../constants/theme';

interface IconeProps {
  tamanho?: number;
  cor?: string;
}

export function IconeVoltar({ tamanho = 14, cor = theme.colors.dark }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Line x1="20" y1="12" x2="4" y2="12" stroke={cor} strokeWidth="2.5" strokeLinecap="round" />
      <Polyline points="10,6 4,12 10,18" stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeCapelo({ tamanho = 16, cor = theme.colors.darkCharcoal }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M2 9L12 4L22 9L12 14L2 9Z" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M6 11V16C6 16 8.5 18.5 12 18.5C15.5 18.5 18 16 18 16V11" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeDocumento({ tamanho = 18, cor = theme.colors.dark }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2H14L19 7V22H6V2Z" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
      <Line x1="9" y1="12" x2="16" y2="12" stroke={cor} strokeWidth="2" />
      <Line x1="9" y1="16" x2="16" y2="16" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeGrafico({ tamanho = 18, cor = theme.colors.white }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" stroke={cor} strokeWidth="2" />
      <Line x1="8" y1="17" x2="8" y2="12" stroke={cor} strokeWidth="2" />
      <Line x1="12" y1="17" x2="12" y2="8" stroke={cor} strokeWidth="2" />
      <Line x1="16" y1="17" x2="16" y2="14" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeRequisitos({ tamanho = 18, cor = theme.colors.dark }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" stroke={cor} strokeWidth="2" />
      <Rect x="14" y="14" width="7" height="7" stroke={cor} strokeWidth="2" />
      <Path d="M6.5 10V17.5H14" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeBusca({ tamanho = 16, cor = theme.colors.gray }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={cor} strokeWidth="2" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeLocal({ tamanho = 15, cor = theme.colors.secondary }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22C12 22 19 15.5 19 10A7 7 0 0 0 5 10C5 15.5 12 22 12 22Z" stroke={cor} strokeWidth="2" />
      <Circle cx="12" cy="10" r="2.5" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeRelogio({ tamanho = 15, cor = theme.colors.secondary }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={cor} strokeWidth="2" />
      <Polyline points="12,7 12,12 15.5,14" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeMais({ tamanho = 22, cor = theme.colors.dark }: IconeProps) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke={cor} strokeWidth="2" />
      <Line x1="12" y1="7.5" x2="12" y2="16.5" stroke={cor} strokeWidth="2" strokeLinecap="round" />
      <Line x1="7.5" y1="12" x2="16.5" y2="12" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

const COR_PADRAO = '#1F1F1F';

export function IconeVoltar({ cor = COR_PADRAO, tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="none">
      <Path
        d="M10 3L5 8L10 13"
        stroke={cor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeCapelo({ cor = COR_PADRAO, tamanho = 18 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 9L12 3L22 9L12 15L2 9Z"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 11.5V17C6 18.5 8.686 21 12 21C15.314 21 18 18.5 18 17V11.5"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M22 9V16" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeLocal({ cor = COR_PADRAO, tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.515 10.485 1.5 8 1.5Z"
        stroke={cor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="8" cy="6" r="1.8" stroke={cor} strokeWidth="1.8" />
    </Svg>
  );
}

export function IconeRelogio({ cor = COR_PADRAO, tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 16 16" fill="none">
      <Circle cx="8" cy="8" r="6" stroke={cor} strokeWidth="1.8" />
      <Path d="M8 4.5V8.2L10.5 9.5" stroke={cor} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeEstrela({ cor = '#F1C321', tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cor}>
      <Path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={COR_PADRAO}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeThumbsUp({ cor = COR_PADRAO, tamanho = 15 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5C14 3.34 12.66 2 11 2L7 11V22H18.28C19.16 22 19.92 21.41 20.14 20.56L21.84 13.96C22.14 12.8 21.26 11.75 20.06 11.75H14.5L15.35 7.67L14 9Z"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7 22H4C2.9 22 2 21.1 2 20V13C2 11.9 2.9 11 4 11H7" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeThumbsDown({ cor = COR_PADRAO, tamanho = 15 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 15V19C10 20.66 11.34 22 13 22L17 13V2H5.72C4.84 2 4.08 2.59 3.86 3.44L2.16 10.04C1.86 11.2 2.74 12.25 3.94 12.25H9.5L8.65 16.33L10 15Z"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M17 2H20C21.1 2 22 2.9 22 4V11C22 12.1 21.1 13 20 13H17" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeDenuncia({ cor = COR_PADRAO, tamanho = 14 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V22"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeEnviar({ cor = '#FFFFFF', tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
        stroke={cor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeFiltro({ cor = COR_PADRAO, tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconeEmail({ cor = COR_PADRAO, tamanho = 15 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={cor} strokeWidth="2" />
      <Path d="M22 7L12 13L2 7" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeLattes({ cor = COR_PADRAO, tamanho = 15 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5C4 18.12 5.12 17 6.5 17H20M4 19.5C4 20.88 5.12 22 6.5 22H20V2H6.5C5.12 2 4 3.12 4 4.5V19.5Z"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 7H15M9 11H13" stroke={cor} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IconeGabinete({ cor = COR_PADRAO, tamanho = 15 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 21H21M5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21"
        stroke={cor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="15" cy="12" r="1" fill={cor} />
    </Svg>
  );
}

export function IconeGrade({ cor = COR_PADRAO, tamanho = 18 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="1" stroke={cor} strokeWidth="2" />
      <Line x1="3" y1="9" x2="21" y2="9" stroke={cor} strokeWidth="2" />
      <Line x1="3" y1="15" x2="21" y2="15" stroke={cor} strokeWidth="2" />
      <Line x1="9" y1="3" x2="9" y2="21" stroke={cor} strokeWidth="2" />
      <Line x1="15" y1="3" x2="15" y2="21" stroke={cor} strokeWidth="2" />
    </Svg>
  );
}

export function IconeRaio({ cor = '#1F1F1F', tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill={cor}>
      <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#1F1F1F" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeCamadas({ cor = COR_PADRAO, tamanho = 18 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={cor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 17L12 22L22 17" stroke={cor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M2 12L12 17L22 12" stroke={cor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IconeBusca({ cor = COR_PADRAO, tamanho = 16 }: { cor?: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={cor} strokeWidth="2.2" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={cor} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}


import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, Line, Path, Rect, G } from 'react-native-svg';
import { FONTE_MANUSCRITA } from './VidaUniversitariaStyles';

/**
 * Fita adesiva / Washi tape realista para colar polaroids e notas
 */
export function WashiTape({
  width = 80,
  height = 24,
  color = 'rgba(241, 195, 33, 0.75)',
  rotation = '-3deg',
  style,
}: {
  width?: number;
  height?: number;
  color?: string;
  rotation?: string;
  style?: any;
}) {
  return (
    <View
      style={[
        styles.washiTape,
        {
          width,
          height,
          backgroundColor: color,
          transform: [{ rotate: rotation }],
        },
        style,
      ]}
      pointerEvents="none"
    >
      <View style={styles.washiEdgeLeft} />
      <View style={styles.washiEdgeRight} />
    </View>
  );
}

/**
 * Alfinete colorido / Push pin para o mural do Minhocão
 */
export function PushPin({ color = '#FE4141', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Sombra */}
      <Circle cx="14" cy="14" r="7" fill="#1F1F1F" opacity={0.25} />
      {/* Cabeça do alfinete */}
      <Circle cx="11" cy="11" r="7" fill={color} stroke="#1F1F1F" strokeWidth="2" />
      <Circle cx="9.5" cy="9.5" r="2.5" fill="#FFFFFF" opacity={0.6} />
      {/* Centro plástico */}
      <Circle cx="11" cy="11" r="3" fill="#1F1F1F" opacity={0.3} />
    </Svg>
  );
}

/**
 * Carimbo oficial de menção (SS, MS, MM, MI, SR)
 */
export type NivelMencao = 'SS' | 'MS' | 'MM' | 'MI' | 'SR';

interface CarimboMencaoProps {
  mencao: NivelMencao;
  size?: number;
  riscado?: boolean;
}

const CORES_MENCAO: Record<NivelMencao, { cor: string; rotulo: string }> = {
  SS: { cor: '#009A5E', rotulo: 'SUPERIOR' },
  MS: { cor: '#1349EB', rotulo: 'MÉDIO SUP.' },
  MM: { cor: '#F1C321', rotulo: 'MÉDIO' },
  MI: { cor: '#FE8A41', rotulo: 'MÉDIO INF.' },
  SR: { cor: '#FE4141', rotulo: 'SEM RENDIMENTO' },
};

export function CarimboMencao({ mencao, size = 68, riscado = false }: CarimboMencaoProps) {
  const { cor, rotulo } = CORES_MENCAO[mencao];

  return (
    <View style={[styles.carimboWrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Borda dupla de carimbo com leve imperfeição */}
        <Circle
          cx="50"
          cy="50"
          r="46"
          stroke={cor}
          strokeWidth="3.5"
          strokeDasharray="90 3 40 2"
          fill="none"
        />
        <Circle cx="50" cy="50" r="40" stroke={cor} strokeWidth="1.5" fill="none" opacity={0.8} />

        {/* Letras da menção */}
        <G transform="translate(0, 0)">
          <Path
            d={
              mencao === 'SS'
                ? 'M34 40 C34 32, 46 32, 46 40 C46 48, 34 50, 34 58 C34 66, 46 66, 46 58 M54 40 C54 32, 66 32, 66 40 C66 48, 54 50, 54 58 C54 66, 66 66, 66 58'
                : mencao === 'SR'
                ? 'M34 40 C34 32, 46 32, 46 40 C46 48, 34 50, 34 58 C34 66, 46 66, 46 58 M54 62 L54 34 L64 34 C70 34, 70 46, 64 46 L54 46 M62 46 L68 62'
                : 'M34 62 L34 34 L43 46 L52 34 L52 62'
            }
            stroke={cor}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </G>

        {/* Risco de caneta vermelha ("Nunca mais SR!") */}
        {riscado && (
          <G>
            <Line x1="18" y1="20" x2="82" y2="80" stroke="#FE4141" strokeWidth="6" strokeLinecap="round" />
            <Line x1="20" y1="80" x2="80" y2="20" stroke="#FE4141" strokeWidth="6" strokeLinecap="round" />
          </G>
        )}
      </Svg>
    </View>
  );
}

/**
 * Ticket de almoço do Restaurante Universitário (RU)
 */
export function TicketRU({
  valor = 'R$ 4,50',
  data = '2026.2',
}: {
  valor?: string;
  data?: string;
}) {
  return (
    <View style={styles.ticketRuContainer}>
      <View style={styles.ticketRuLeft}>
        <Text style={styles.ticketRuLogo}>RU • UnB</Text>
        <Text style={styles.ticketRuSub}>RESTAURANTE UNIVERSITÁRIO</Text>
        <Text style={styles.ticketRuValor}>{valor}</Text>
      </View>
      <View style={styles.ticketRuDivider} />
      <View style={styles.ticketRuRight}>
        <Text style={styles.ticketRuSemestre}>{data}</Text>
        <Text style={styles.ticketRuCodigo}>№ 04821</Text>
        <View style={styles.ticketRuBarcode}>
          <Svg width={36} height={20} viewBox="0 0 36 20">
            <Line x1="3" y1="0" x2="3" y2="20" stroke="#1F1F1F" strokeWidth="2" />
            <Line x1="7" y1="0" x2="7" y2="20" stroke="#1F1F1F" strokeWidth="1" />
            <Line x1="12" y1="0" x2="12" y2="20" stroke="#1F1F1F" strokeWidth="3" />
            <Line x1="18" y1="0" x2="18" y2="20" stroke="#1F1F1F" strokeWidth="1.5" />
            <Line x1="24" y1="0" x2="24" y2="20" stroke="#1F1F1F" strokeWidth="3" />
            <Line x1="30" y1="0" x2="30" y2="20" stroke="#1F1F1F" strokeWidth="2" />
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  washiTape: {
    position: 'absolute',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(31, 31, 31, 0.2)',
    zIndex: 10,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    ...(Platform.OS === 'web' ? ({ backdropFilter: 'blur(1px)' } as any) : {}),
  },
  washiEdgeLeft: {
    position: 'absolute',
    left: -2,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  washiEdgeRight: {
    position: 'absolute',
    right: -2,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  carimboWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  ticketRuContainer: {
    flexDirection: 'row',
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    maxWidth: 210,
  },
  ticketRuLeft: {
    flex: 1,
    paddingRight: 8,
  },
  ticketRuLogo: {
    fontSize: 13,
    fontWeight: '900',
    color: '#009A5E',
    letterSpacing: 0.5,
  },
  ticketRuSub: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#707070',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  ticketRuValor: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  ticketRuDivider: {
    width: 1.5,
    borderLeftWidth: 1.5,
    borderColor: '#1F1F1F',
    borderStyle: 'dashed',
    marginVertical: -2,
    marginHorizontal: 6,
  },
  ticketRuRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  ticketRuSemestre: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#1349EB',
  },
  ticketRuCodigo: {
    fontSize: 8,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    color: '#707070',
    marginVertical: 2,
  },
  ticketRuBarcode: {
    marginTop: 2,
  },
});

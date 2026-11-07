import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Rect, G, Defs, Pattern } from 'react-native-svg';

/**
 * Mosaico oficial inspirado nos azulejos modernistas de Athos Bulcão e na identidade visual da UnB.
 * Combina quartos de círculo e formas geométricas em Verde UnB (#009A5E), Azul (#1349EB) e Amarelo (#F1C321).
 */

interface MosaicoUnBProps {
  height?: number;
  patternVariant?: 'classico' | 'com-amarelo' | 'compacto';
}

export interface MosaicoBackgroundProps {
  children?: React.ReactNode;
  overlayOpacity?: number;
  overlayColor?: string;
  style?: any;
  contentStyle?: any;
}

// Módulo 40x40 com quartos de círculo
function Tile({
  type,
  color1 = '#009A5E',
  color2 = '#1349EB',
  bg = '#FFFFFF',
}: {
  type: number;
  color1?: string;
  color2?: string;
  bg?: string;
}) {
  switch (type) {
    case 0:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 0 0 L 40 0 A 40 40 0 0 1 0 40 Z" fill={color1} />
        </G>
      );
    case 1:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 40 40 L 0 40 A 40 40 0 0 1 40 0 Z" fill={color2} />
        </G>
      );
    case 2:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 0 0 L 40 0 A 40 40 0 0 1 0 40 Z" fill={color1} />
          <Path d="M 40 40 L 0 40 A 40 40 0 0 1 40 0 Z" fill={color2} />
        </G>
      );
    case 3:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 40 0 L 40 40 A 40 40 0 0 1 0 0 Z" fill={color1} />
        </G>
      );
    case 4:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 0 40 L 0 0 A 40 40 0 0 1 40 40 Z" fill={color2} />
        </G>
      );
    default:
      return (
        <G>
          <Rect width={40} height={40} fill={bg} />
          <Path d="M 0 40 L 0 0 A 40 40 0 0 1 40 40 Z" fill={color1} />
          <Path d="M 40 0 L 40 40 A 40 40 0 0 1 0 0 Z" fill={color2} />
        </G>
      );
  }
}

/**
 * Faixa modular horizontal de Mosaico Athos Bulcão
 */
export function MosaicoUnB({ height = 72, patternVariant = 'com-amarelo' }: MosaicoUnBProps) {
  const { width } = useWindowDimensions();
  const tileSize = 40;
  const numColumns = Math.ceil(Math.max(width, 1400) / tileSize) + 2;
  const rows = Math.round(height / tileSize) || 2;

  const patternGrid = [
    [0, 1, 3, 2, 4, 1, 0, 5, 2, 3, 1, 4, 0, 2],
    [4, 2, 1, 0, 3, 5, 2, 4, 1, 0, 3, 2, 5, 1],
    [1, 3, 0, 4, 2, 1, 5, 0, 3, 2, 4, 1, 0, 2],
  ];

  return (
    <View style={[styles.wrapper, { height }]}>
      <Svg width="100%" height={height} style={StyleSheet.absoluteFill}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <G key={rowIndex} transform={`translate(0, ${rowIndex * tileSize})`}>
            {Array.from({ length: numColumns }).map((_, colIndex) => {
              const rowPattern = patternGrid[rowIndex % patternGrid.length];
              const tileType = rowPattern[colIndex % rowPattern.length];

              const isAccent = patternVariant === 'com-amarelo' && (colIndex + rowIndex * 3) % 7 === 0;
              const color1 = isAccent ? '#F1C321' : (colIndex % 2 === 0 ? '#009A5E' : '#1349EB');
              const color2 = isAccent ? '#009A5E' : (colIndex % 2 === 0 ? '#1349EB' : '#009A5E');

              return (
                <G key={colIndex} transform={`translate(${colIndex * tileSize}, 0)`}>
                  <Tile
                    type={tileType}
                    color1={color1}
                    color2={color2}
                    bg="#FAF9F5"
                  />
                </G>
              );
            })}
          </G>
        ))}
      </Svg>
      <View style={styles.topBorder} />
      <View style={styles.bottomBorder} />
    </View>
  );
}

/**
 * Fundo contínuo de Mosaico Athos Bulcão para painéis e seções inteiras
 */
export function MosaicoBackground({
  children,
  overlayOpacity = 0.88,
  overlayColor = '#FAF9F5',
  style,
  contentStyle,
}: MosaicoBackgroundProps) {
  return (
    <View style={[styles.bgContainer, style]}>
      {/* Camada SVG de Mosaico com Pattern Infinito */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern id="unb-mosaico-tile" width={160} height={80} patternUnits="userSpaceOnUse">
            {/* Linha 0 (Y=0) */}
            <G transform="translate(0, 0)">
              <Tile type={0} color1="#009A5E" color2="#1349EB" bg="#FAF9F5" />
            </G>
            <G transform="translate(40, 0)">
              <Tile type={1} color1="#1349EB" color2="#009A5E" bg="#FAF9F5" />
            </G>
            <G transform="translate(80, 0)">
              <Tile type={3} color1="#F1C321" color2="#009A5E" bg="#FAF9F5" />
            </G>
            <G transform="translate(120, 0)">
              <Tile type={2} color1="#1349EB" color2="#F1C321" bg="#FAF9F5" />
            </G>

            {/* Linha 1 (Y=40) */}
            <G transform="translate(0, 40)">
              <Tile type={4} color1="#1349EB" color2="#009A5E" bg="#FAF9F5" />
            </G>
            <G transform="translate(40, 40)">
              <Tile type={2} color1="#009A5E" color2="#F1C321" bg="#FAF9F5" />
            </G>
            <G transform="translate(80, 40)">
              <Tile type={1} color1="#009A5E" color2="#1349EB" bg="#FAF9F5" />
            </G>
            <G transform="translate(120, 40)">
              <Tile type={0} color1="#F1C321" color2="#1349EB" bg="#FAF9F5" />
            </G>
          </Pattern>
        </Defs>

        {/* Fundo preenchido com o mosaico */}
        <Rect width="100%" height="100%" fill="url(#unb-mosaico-tile)" />

        {/* Película de transparência para contraste e legibilidade perfeita do conteúdo */}
        {overlayOpacity > 0 && (
          <Rect
            width="100%"
            height="100%"
            fill={overlayColor}
            opacity={overlayOpacity}
          />
        )}
      </Svg>

      <View style={styles.topBorder} />
      <View style={styles.bottomBorder} />

      {/* Conteúdo sobreposto */}
      <View style={[styles.contentLayer, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF9F5',
  },
  bgContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FAF9F5',
  },
  contentLayer: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1F1F1F',
    zIndex: 3,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#1F1F1F',
    zIndex: 3,
  },
});

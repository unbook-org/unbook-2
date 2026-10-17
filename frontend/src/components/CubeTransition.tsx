import React from 'react';
import { View, StyleSheet, useWindowDimensions, StyleProp, ViewStyle, Platform } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

export interface CubeTransitionProps {
  /**
   * Cor principal dos blocos/cubos (geralmente a cor de fundo da seção de onde está saindo)
   * @default '#009A5E'
   */
  color?: string;
  /**
   * Cor de fundo dos espaços vazios (geralmente a cor da seção para onde está entrando)
   * @default 'transparent'
   */
  targetBgColor?: string;
  /**
   * Direção da transição:
   * - 'down': Barra sólida no topo, cubos descem dissolvendo para baixo.
   * - 'up': Barra sólida na base, cubos sobem dissolvendo para cima.
   * @default 'down'
   */
  direction?: 'down' | 'up';
  /**
   * Ativa a inversão de direção (atalho para inverter a orientação atual)
   * @default false
   */
  inverted?: boolean;
  /**
   * Espelha horizontalmente a grade de cubos (desloca as colunas alternadas)
   * @default false
   */
  flipX?: boolean;
  /**
   * Altura total da transição (padrão calculado proporcionalmente com base na largura)
   */
  height?: number;
  /**
   * Tamanho de cada cubo individual (padrão responsivo: 20px no mobile, 24px no desktop)
   */
  squareSize?: number;
  /**
   * Estilo customizado do container
   */
  style?: StyleProp<ViewStyle>;
}

export function CubeTransition({
  color = '#009A5E',
  targetBgColor = 'transparent',
  direction = 'down',
  inverted = false,
  flipX = false,
  height,
  squareSize: customSquareSize,
  style,
}: CubeTransitionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  // Tamanho do cubo: garante proporção 1:1 rigorosamente quadrada em qualquer tela
  const squareSize = customSquareSize || (isMobile ? 20 : 24);
  const transitionHeight = height || squareSize * 3;
  const rowHeight = transitionHeight / 3;

  // Número exato de colunas para cobrir a largura total sem gaps
  const numCols = Math.ceil(width / squareSize);

  // Determina a direção efetiva considerando a prop inverted
  const effectiveDirection: 'down' | 'up' = inverted
    ? direction === 'down'
      ? 'up'
      : 'down'
    : direction;

  // Gera os cubos de acordo com a direção matemática
  // Linha 0 (topo): y = 0
  // Linha 1 (meio): y = rowHeight
  // Linha 2 (base): y = 2 * rowHeight
  const rects: React.ReactNode[] = [];

  // Fundo opcional preenchido (para garantir que os espaços entre os cubos tenham a cor de destino)
  if (targetBgColor && targetBgColor !== 'transparent') {
    rects.push(
      <Rect
        key="bg"
        x="0"
        y="0"
        width={width}
        height={transitionHeight}
        fill={targetBgColor}
      />
    );
  }

  if (effectiveDirection === 'down') {
    // Barra sólida no topo (linha 0) - conecta perfeitamente com a seção superior
    rects.push(
      <Rect
        key="solid-top"
        x="0"
        y="0"
        width={width}
        height={rowHeight}
        fill={color}
      />
    );

    // Linha 1 (meio): cubos alternados em colunas pares
    for (let c = 0; c < numCols; c++) {
      const colIdx = flipX ? numCols - 1 - c : c;
      if (colIdx % 2 === 0) {
        rects.push(
          <Rect
            key={`mid-${c}`}
            x={c * squareSize}
            y={rowHeight}
            width={squareSize}
            height={rowHeight}
            fill={color}
          />
        );
      }
    }

    // Linha 2 (base): cubos alternados em colunas ímpares (dissolvendo no fundo)
    for (let c = 0; c < numCols; c++) {
      const colIdx = flipX ? numCols - 1 - c : c;
      if (colIdx % 2 === 1) {
        rects.push(
          <Rect
            key={`bot-${c}`}
            x={c * squareSize}
            y={2 * rowHeight}
            width={squareSize}
            height={rowHeight}
            fill={color}
          />
        );
      }
    }
  } else {
    // Linha 0 (topo): cubos alternados em colunas ímpares (subindo dissolvendo)
    for (let c = 0; c < numCols; c++) {
      const colIdx = flipX ? numCols - 1 - c : c;
      if (colIdx % 2 === 1) {
        rects.push(
          <Rect
            key={`top-${c}`}
            x={c * squareSize}
            y="0"
            width={squareSize}
            height={rowHeight}
            fill={color}
          />
        );
      }
    }

    // Linha 1 (meio): cubos alternados em colunas pares
    for (let c = 0; c < numCols; c++) {
      const colIdx = flipX ? numCols - 1 - c : c;
      if (colIdx % 2 === 0) {
        rects.push(
          <Rect
            key={`mid-${c}`}
            x={c * squareSize}
            y={rowHeight}
            width={squareSize}
            height={rowHeight}
            fill={color}
          />
        );
      }
    }

    // Barra sólida na base (linha 2) - conecta perfeitamente com a seção inferior
    rects.push(
      <Rect
        key="solid-bot"
        x="0"
        y={2 * rowHeight}
        width={width}
        height={rowHeight}
        fill={color}
      />
    );
  }

  return (
    <View style={[styles.container, { height: transitionHeight }, style]}>
      <Svg
        width="100%"
        height={transitionHeight}
        viewBox={`0 0 ${width} ${transitionHeight}`}
        fill="none"
        // @ts-ignore
        shapeRendering="crispEdges"
        style={styles.svg}
      >
        {rects}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 10,
    marginTop: -1,
    marginBottom: -1,
    ...(Platform.OS === 'web'
      ? ({
          lineHeight: 0,
          display: 'block',
        } as any)
      : {}),
  },
  svg: {
    width: '100%',
    display: 'flex',
  },
});

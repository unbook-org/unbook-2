import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Rect, Defs, Pattern, Line } from 'react-native-svg';
import { theme } from '../constants/theme';

export interface NotebookBackgroundProps extends ViewProps {
  lineSpacing?: number;
  lineColor?: string;
  marginColor?: string;
  marginPosition?: number;
  backgroundColor?: string;
  patternId?: string;
  children?: React.ReactNode;
}

export function NotebookBackground({
  lineSpacing = 44,
  lineColor = 'rgba(57, 167, 175, 0.35)', // Azul/Teal clássico de pauta (#39A7AF)
  marginColor = 'rgba(254, 65, 65, 0.45)', // Vermelho clássico de margem (#FE4141)
  marginPosition = 64,
  backgroundColor = theme.colors.background,
  patternId = 'caderno-pautas',
  children,
  style,
  ...props
}: NotebookBackgroundProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <Pattern
            id={patternId}
            width="100%"
            height={lineSpacing}
            patternUnits="userSpaceOnUse"
          >
            <Line
              x1="0"
              y1={lineSpacing - 0.5}
              x2="100%"
              y2={lineSpacing - 0.5}
              stroke={lineColor}
              strokeWidth="1"
            />
          </Pattern>
        </Defs>

        {/* Papel de fundo */}
        <Rect width="100%" height="100%" fill={backgroundColor} />

        {/* Pautas horizontais infinitas */}
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* Margem vertical do caderno */}
        <Line
          x1={marginPosition}
          y1="0"
          x2={marginPosition}
          y2="100%"
          stroke={marginColor}
          strokeWidth="1.5"
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
});

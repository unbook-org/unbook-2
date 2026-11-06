import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

interface TicketBarcodeProps {
  code?: string;
  height?: number;
  color?: string;
  showText?: boolean;
}

export function TicketBarcode({
  code = 'UNB-2026-DONATION-TICKET',
  height = 38,
  color = '#1F1F1F',
  showText = false,
}: TicketBarcodeProps) {
  const barPattern = [
    3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 2,
    4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 4, 1, 2, 3,
  ];

  let currentX = 0;

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox="0 0 160 38" preserveAspectRatio="none">
        {barPattern.map((width, idx) => {
          const x = currentX;
          currentX += width + (idx % 2 === 0 ? 1 : 2);
          if (idx % 2 === 0 && x < 156) {
            return (
              <Rect
                key={idx}
                x={x}
                y={0}
                width={Math.min(width, 158 - x)}
                height={height}
                fill={color}
              />
            );
          }
          return null;
        })}
      </Svg>
      {showText && <Text style={[styles.codeText, { color }]}>{code}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.8,
  },
});


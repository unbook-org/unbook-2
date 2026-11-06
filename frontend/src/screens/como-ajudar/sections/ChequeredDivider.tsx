import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

export function ChequeredDivider() {
  const { width } = useWindowDimensions();
  const squareSize = 14;
  const numSquares = Math.ceil((width || 1200) / squareSize) + 4;

  return (
    <View style={styles.wrapper}>
      <View style={styles.chequeredContainer}>
        <Svg width="100%" height={28} viewBox={`0 0 ${numSquares * squareSize} 28`} preserveAspectRatio="none">
          {Array.from({ length: numSquares }).map((_, i) => (
            <React.Fragment key={i}>
              <Rect
                x={i * squareSize}
                y={0}
                width={squareSize}
                height={14}
                fill={i % 2 === 0 ? '#1F1F1F' : '#FFFFFF'}
              />
              <Rect
                x={i * squareSize}
                y={14}
                width={squareSize}
                height={14}
                fill={i % 2 === 0 ? '#FFFFFF' : '#1F1F1F'}
              />
            </React.Fragment>
          ))}
        </Svg>
      </View>
    </View>
  );
}

export function MegaphoneDoodle({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M8 22v4c0 2 2 4 4 4h4l12 8V10L16 18h-4c-2 0-4 2-4 4z"
        fill="#FF9F43"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Path
        d="M32 16c2 2 3 5 3 8s-1 6-3 8"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M36 12c4 3 6 8 6 12s-2 9-6 12"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M14 30v8a3 3 0 0 0 3 3h2v-11"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CoffeeDoodle({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M10 14h24v16a8 8 0 0 1-8 8h-8a8 8 0 0 1-8-8V14z"
        fill="#FCFAEC"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <Path
        d="M34 18h4a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4h-4"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M16 8c0-2 2-3 2-4M22 8c0-2 2-3 2-4M28 8c0-2 2-3 2-4"
        stroke="#C59B27"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M6 42h32" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MagnifierDoodle({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle
        cx="20"
        cy="20"
        r="12"
        fill="#D6A2E8"
        stroke="#1F1F1F"
        strokeWidth="2.5"
      />
      <Path
        d="M29 29l11 11"
        stroke="#1F1F1F"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Path
        d="M15 16a6 6 0 0 1 6-2"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function MoneyDoodle({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Rect
        x="6"
        y="14"
        width="34"
        height="20"
        rx="4"
        fill="#55EFC4"
        stroke="#1F1F1F"
        strokeWidth="2.5"
      />
      <Circle
        cx="23"
        cy="24"
        r="5"
        stroke="#1F1F1F"
        strokeWidth="2"
        fill="#FFFFFF"
      />
      <Path d="M10 18h2M34 30h2" stroke="#1F1F1F" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    overflow: 'hidden',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    backgroundColor: '#FFFFFF',
  },
  chequeredContainer: {
    height: 28,
    width: '100%',
  },
});


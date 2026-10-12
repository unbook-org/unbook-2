import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Platform, TextStyle, StyleProp } from 'react-native';

export interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  trigger?: boolean;
  style?: StyleProp<TextStyle>;
}

export function AnimatedCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 1800,
  trigger = true,
  style,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (t: number): number => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentVal = Math.floor(easedProgress * end);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
        setHasCompleted(true);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration, trigger]);

  const activeCount = trigger ? count : 0;
  const isFinished = trigger && hasCompleted;
  const formattedCount = activeCount.toLocaleString('pt-BR');

  return (
    <Text
      style={[
        styles.counterText,
        style,
        isFinished && styles.completedPunch,
      ]}
    >
      {prefix}
      {formattedCount}
      {suffix}
    </Text>
  );
}

const styles = StyleSheet.create({
  counterText: {
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    ...(Platform.OS === 'web'
      ? ({
          display: 'inline-block',
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  completedPunch: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'numberGrowPunch 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
});

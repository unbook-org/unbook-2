import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function ArrowUpIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19V5M5 12l7-7 7 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CalendarIcon({ size = 16, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export interface FloatingQuickNavProps {
  onScrollToTop: () => void;
  onScrollToSchedule: () => void;
}

export function FloatingQuickNav({
  onScrollToTop,
  onScrollToSchedule,
}: FloatingQuickNavProps) {
  const [topHovered, setTopHovered] = useState(false);
  const [scheduleHovered, setScheduleHovered] = useState(false);

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      {/* Botão de Atalho Rápido para o Simulador de Grade */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ir para o simulador de grade"
        onPress={onScrollToSchedule}
        onHoverIn={() => setScheduleHovered(true)}
        onHoverOut={() => setScheduleHovered(false)}
        style={({ pressed }) => [
          styles.navButton,
          styles.scheduleButton,
          scheduleHovered && styles.navButtonHovered,
          pressed && styles.navButtonPressed,
        ]}
      >
        <CalendarIcon size={16} color="#FFFFFF" />
        <Text style={styles.scheduleButtonText}>GRADE</Text>
      </Pressable>

      {/* Botão Voltar ao Topo */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar ao topo da página"
        onPress={onScrollToTop}
        onHoverIn={() => setTopHovered(true)}
        onHoverOut={() => setTopHovered(false)}
        style={({ pressed }) => [
          styles.navButton,
          styles.topButton,
          topHovered && styles.navButtonHovered,
          pressed && styles.navButtonPressed,
        ]}
      >
        <ArrowUpIcon size={18} color="#1F1F1F" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...(Platform.OS === 'web'
      ? ({
          position: 'fixed',
          animation: 'cartoonPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        } as any)
      : {}),
  },
  navButton: {
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  topButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
  },
  scheduleButton: {
    backgroundColor: '#1349EB',
    paddingHorizontal: 14,
    height: 44,
    flexDirection: 'row',
    gap: 6,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  navButtonHovered: {
    transform: [{ translateY: -3 }],
    shadowOffset: { width: 4.5, height: 4.5 },
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  navButtonPressed: {
    transform: [{ translate: [2, 2] }],
    shadowOffset: { width: 1, height: 1 },
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
});

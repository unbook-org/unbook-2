import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Easing } from 'react-native';

const ROW_1_ITEMS = [
  'MELHOR SITE DE AVALIAÇÃO DE TODOS',
  '✦',
  'MONTE SUA GRADE NA PLATAFORMA',
  '✦',
  'SEJA UM UNBOOKER',
  '✦',
  'UM SITE DE ESTUDANTES PARA ESTUDANTES',
  '✦',
  '100% CÓDIGO ABERTO',
  '✦',
];

const ROW_2_ITEMS = [
  'AVALIE SEM MEDO DE RETALIAÇÃO',
  '✦',
  '100% ANÔNIMO POR DESIGN',
  '✦',
  'ZERO CONFLITO DE HORÁRIOS',
  '✦',
  'SIGAA 2.0 DA COMUNIDADE',
  '✦',
  'AUDITADO PELOS DISCENTES',
  '✦',
];

const ROW_3_ITEMS = [
  'A UNB EM NÚMEROS REAIS',
  '✦',
  'EMENTAS SINCRONIZADAS',
  '✦',
  'SALVE SUAS TURMAS FAVORITAS',
  '✦',
  'PLANEJE SEU SEMESTRE EM MINUTOS',
  '✦',
  'UNBOOK 2.0',
  '✦',
];

interface MarqueeRowProps {
  backgroundColor: string;
  textColor: string;
  items: string[];
  direction?: 'left' | 'right';
  speedSeconds?: number;
}

function MarqueeRow({
  backgroundColor,
  textColor,
  items,
  direction = 'left',
  speedSeconds = 22,
}: MarqueeRowProps) {
  // Para loop contínuo e infinito sem cortes
  const trackItems = [...items, ...items];

  // Animação para Mobile Nativo (caso não seja Web)
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const startAnimation = () => {
      animatedValue.setValue(direction === 'left' ? 0 : -300);
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: direction === 'left' ? -300 : 0,
          duration: speedSeconds * 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startAnimation();
  }, [direction, speedSeconds, animatedValue]);

  const webAnimationName =
    direction === 'left' ? 'cartoonMarqueeLeft' : 'cartoonMarqueeRight';

  return (
    <View style={[styles.marqueeRow, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.contentTrack,
          Platform.OS === 'web'
            ? ({
                animation: `${webAnimationName} ${speedSeconds}s linear infinite`,
                display: 'flex',
                width: 'max-content',
              } as any)
            : {
                transform: [{ translateX: animatedValue }],
              },
        ]}
      >
        {trackItems.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            <Text
              style={[
                styles.marqueeText,
                { color: textColor },
                item === '✦' && styles.starText,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export function MarqueeSection() {
  return (
    <View style={styles.container}>
      {/* Fita 1: Azul vibrante UnB (desliza para a esquerda) */}
      <MarqueeRow
        backgroundColor="#1349EB"
        textColor="#FFFFFF"
        items={ROW_1_ITEMS}
        direction="left"
        speedSeconds={24}
      />

      {/* Fita 2: Vermelha de destaque (desliza para a direita em sentido oposto) */}
      <MarqueeRow
        backgroundColor="#FE4141"
        textColor="#1F1F1F"
        items={ROW_2_ITEMS}
        direction="right"
        speedSeconds={20}
      />

      {/* Fita 3: Amarela de destaque (desliza para a esquerda) */}
      <MarqueeRow
        backgroundColor="#F1C321"
        textColor="#1F1F1F"
        items={ROW_3_ITEMS}
        direction="left"
        speedSeconds={26}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
    backgroundColor: '#1F1F1F',
  },
  marqueeRow: {
    paddingVertical: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1F1F1F',
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'default',
        } as any)
      : {}),
  },
  contentTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 8,
    ...(Platform.OS === 'web'
      ? ({
          willChange: 'transform',
        } as any)
      : {}),
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  marqueeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    ...(Platform.OS === 'web'
      ? ({
          whiteSpace: 'nowrap',
          userSelect: 'none',
        } as any)
      : {}),
  },
  starText: {
    fontSize: 12,
    opacity: 0.85,
    transform: [{ scale: 1.1 }],
  },
});

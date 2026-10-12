import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../../../constants/theme';

function SearchIcon({ size = 20, color = '#707070' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
      <Path d="M20 20L16 16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function SearchSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View
      nativeID="search-section"
      // @ts-ignore - ID para ancoragem suave na web
      id="search-section"
      style={styles.sectionWrapper}
    >
      <View style={styles.container}>
        {/* Placeholder reservado para a busca */}
        <View style={[styles.placeholderCard, isMobile && styles.placeholderCardMobile]}>
          <View style={styles.tagWrapper}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>EM BREVE • BUSCA EM TEMPO REAL</Text>
            </View>
          </View>

          <Text style={[styles.title, isMobile && styles.titleMobile]}>
            Encontre qualquer matéria ou professor da UnB
          </Text>

          <Text style={styles.subtitle}>
            Catálogo completo de disciplinas sincronizado com o SIGAA e notas da comunidade acadêmica.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: theme.colors.white,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    ...(Platform.OS === 'web'
      ? ({
          scrollMarginTop: '30px',
        } as any)
      : {}),
  },
  container: {
    width: '100%',
    height: 400,
    maxWidth: 1440,
    alignItems: 'center',
  },
  placeholderCard: {
    width: '100%',
    height: 400,
    backgroundColor: '#FAF9F6',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B0B0AF',
    borderRadius: 8,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderCardMobile: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  tagWrapper: {
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#EFEDE1',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleMobile: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#707070',
    textAlign: 'center',
    maxWidth: 580,
    lineHeight: 20,
    marginBottom: 24,
  },
});

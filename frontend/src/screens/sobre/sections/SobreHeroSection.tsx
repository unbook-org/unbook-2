import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { CampusMapGraphic } from './CampusMapGraphic';

interface SobreHeroSectionProps {
  onPressColaborar?: () => void;
  onPressGrade?: () => void;
  onPressAvaliar?: () => void;
}

export function SobreHeroSection({
  onPressColaborar,
  onPressGrade,
  onPressAvaliar,
}: SobreHeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 960;

  const [githubHovered, setGithubHovered] = useState(false);
  const [colaborarHovered, setColaborarHovered] = useState(false);

  const handleOpenGithub = () => {
    const url = 'https://github.com/unbook-org/unbook-2';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  const featurePills = [
    {
      id: 1,
      text: 'Avalie seu professor de forma anônima ✓',
      bgColor: '#F1C321',
      action: onPressAvaliar,
    },
    {
      id: 2,
      text: 'Monte sua grade sem conflito de horário 📅',
      bgColor: '#FFFFFF',
      action: onPressGrade,
    },
    {
      id: 3,
      text: 'Acesse provas e resumos anteriores 📚',
      bgColor: '#C2EED4',
      action: () => handleOpenGithub(),
    },
    {
      id: 4,
      text: 'Open Source — contribua no GitHub 💻',
      bgColor: '#FFFFFF',
      action: () => handleOpenGithub(),
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={[styles.heroRow, isMobile && styles.heroRowMobile]}>
          <View style={styles.leftColumn}>
            <View style={styles.badgesRow}>
              <View style={[styles.topBadge, styles.badgeGreen]}>
                <Text style={styles.badgeTextGreen}>100% GRATUITO</Text>
              </View>
              <View style={[styles.topBadge, styles.badgeBlue]}>
                <Text style={styles.badgeTextBlue}>CÓDIGO ABERTO</Text>
              </View>
              <View style={[styles.topBadge, styles.badgeYellow]}>
                <Text style={styles.badgeTextYellow}>PROJETO DE EXTENSÃO</Text>
              </View>
            </View>

            <Text style={styles.heroTitle}>
              De alunos da UnB,{'\n'}
              <Text style={styles.heroTitleAccent}>para alunos da UnB.</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              O UnBook nasceu da necessidade de tornar a vida acadêmica no{' '}
              <Text style={styles.boldText}>Campus Darcy Ribeiro, FGA, FCE e FAL</Text> mais transparente, colaborativa e sem surpresas no final do semestre.
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2022</Text>
                <Text style={styles.statLabel}>FUNDAÇÃO</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>4</Text>
                <Text style={styles.statLabel}>CAMPI</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12k+</Text>
                <Text style={styles.statLabel}>USUÁRIOS</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>v2.0</Text>
                <Text style={styles.statLabel}>VERSÃO</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ver no GitHub"
                onPress={handleOpenGithub}
                // @ts-ignore
                onMouseEnter={() => setGithubHovered(true)}
                // @ts-ignore
                onMouseLeave={() => setGithubHovered(false)}
                style={({ pressed }) => [
                  styles.githubBtn,
                  githubHovered && styles.btnHovered,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.githubBtnText}>VER NO GITHUB ↗</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Como colaborar"
                onPress={onPressColaborar}
                // @ts-ignore
                onMouseEnter={() => setColaborarHovered(true)}
                // @ts-ignore
                onMouseLeave={() => setColaborarHovered(false)}
                style={({ pressed }) => [
                  styles.colaborarBtn,
                  colaborarHovered && styles.btnHovered,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.colaborarBtnText}>COMO COLABORAR →</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <CampusMapGraphic />

            <View style={styles.pillsGrid}>
              {featurePills.map((pill) => (
                <Pressable
                  key={pill.id}
                  onPress={pill.action}
                  style={({ pressed }) => [
                    styles.featurePillCard,
                    { backgroundColor: pill.bgColor },
                    pressed && styles.pillPressed,
                  ]}
                >
                  <Text style={styles.featurePillText}>{pill.text}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 56,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1160,
    width: '100%',
    marginHorizontal: 'auto',
  },
  heroRow: {
    flexDirection: 'row',
    gap: 48,
    alignItems: 'center',
  },
  heroRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 40,
  },
  leftColumn: {
    flex: 1.15,
  },
  rightColumn: {
    flex: 1,
    gap: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  topBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    shadowColor: '#000000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  badgeGreen: {
    backgroundColor: '#009A5E',
  },
  badgeTextGreen: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgeBlue: {
    backgroundColor: '#1349EB',
  },
  badgeTextBlue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgeYellow: {
    backgroundColor: '#F1C321',
  },
  badgeTextYellow: {
    color: '#1F1F1F',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 50,
    marginBottom: 20,
    letterSpacing: -0.8,
  },
  heroTitleAccent: {
    color: '#009A5E',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 24,
    marginBottom: 28,
  },
  boldText: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#707070',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 2,
    height: 32,
    backgroundColor: '#D9D9D9',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  githubBtn: {
    backgroundColor: '#009A5E',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  githubBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  colaborarBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  colaborarBtnText: {
    color: '#1F1F1F',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  btnHovered: {
    transform: [{ translateY: -2 }],
    shadowOffset: { width: 5, height: 5 },
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featurePillCard: {
    flex: 1,
    minWidth: '46%',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    justifyContent: 'center',
  },
  featurePillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F1F1F',
    lineHeight: 16,
  },
  pillPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
});


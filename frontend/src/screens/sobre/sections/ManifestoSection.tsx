import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

interface TimelineItem {
  year: string;
  badge: string;
  badgeColor: string;
  badgeTextColor: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineItem[] = [
  {
    year: '2022',
    badge: 'UnBook 1.0 — ORIGEM',
    badgeColor: '#F1C321',
    badgeTextColor: '#1F1F1F',
    title: 'COMO TUDO COMEÇOU',
    description:
      'Em 2022, um grupo de calouros do Campus Darcy Ribeiro criou uma planilha colaborativa para avaliar professores. O objetivo era simples: ajudar os novos alunos a escolherem turmas com mais segurança, algo que o SIGAA jamais ofereceu.',
  },
  {
    year: '2023',
    badge: 'EXPANSÃO — CRESCIMENTO',
    badgeColor: '#009A5E',
    badgeTextColor: '#FFFFFF',
    title: 'A NECESSIDADE DE REVITALIZAÇÃO',
    description:
      'A comunidade cresceu organicamente. Surgiram pedidos por busca de materiais de estudo, provas antigas e simulador de grade horária. A planilha virou um formulário, o formulário virou um site — mas a arquitetura não acompanhou o ritmo.',
  },
  {
    year: '2025',
    badge: 'UnBook 2.0 — ECOSSISTEMA',
    badgeColor: '#1349EB',
    badgeTextColor: '#FFFFFF',
    title: 'A TRANSFORMAÇÃO',
    description:
      'O UnBook 2.0 nasce como um ecossistema unificado, open-source e modularizado, mantido ativamente pelos próprios estudantes. Avaliações, materiais, grade e busca inteligente — tudo integrado sob uma única marca, com código aberto e comunidade ativa.',
  },
];

export function ManifestoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>A HISTÓRIA & MANIFESTO</Text>
        </View>

        <View style={[styles.timelineGrid, isMobile && styles.timelineGridMobile]}>
          {TIMELINE.map((item, idx) => (
            <View key={idx} style={styles.timelineCard}>
              <Text style={styles.yearWatermark}>{item.year}</Text>

              <View
                style={[
                  styles.badgeTag,
                  { backgroundColor: item.badgeColor },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: item.badgeTextColor },
                  ]}
                >
                  {item.badge}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.progressDot} />
                <Text style={styles.phaseLabel}>Fase 0{idx + 1}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1160,
    width: '100%',
    marginHorizontal: 'auto',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
  },
  accentBar: {
    width: 6,
    height: 30,
    backgroundColor: '#009A5E',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timelineGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  timelineGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: '#272725',
    borderWidth: 2,
    borderColor: '#3D3D3A',
    borderRadius: 14,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
    minHeight: 280,
  },
  yearWatermark: {
    position: 'absolute',
    top: 14,
    right: 18,
    fontSize: 48,
    fontWeight: '900',
    color: '#3A3A36',
    zIndex: 1,
  },
  badgeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    marginBottom: 20,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    zIndex: 2,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 13,
    color: '#D4D4D0',
    lineHeight: 22,
    marginBottom: 24,
    zIndex: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#3D3D3A',
    paddingTop: 14,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#009A5E',
  },
  phaseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A09B',
    letterSpacing: 0.5,
  },
});


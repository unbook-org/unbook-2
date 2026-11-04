import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

function GradCapIcon({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 10v6M2 10l10-5 10 5-10 5z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 12v5c3 3 9 3 12 0v-5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BooksIcon({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8 7h8M8 11h6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function CalendarIcon({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="2.2" />
      <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="8" cy="15" r="1.5" fill={color} />
      <Circle cx="12" cy="15" r="1.5" fill={color} />
      <Circle cx="16" cy="15" r="1.5" fill={color} />
    </Svg>
  );
}

function SearchIcon({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2.2" />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

interface ModulosSectionProps {
  onSelectModulo?: (moduloId: string) => void;
}

export function ModulosSection({ onSelectModulo }: ModulosSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1080;

  const [hoveredModulo, setHoveredModulo] = useState<string | null>(null);

  const modulos = [
    {
      id: 'avaliacoes',
      title: 'UNBOOK AVALIAÇÕES',
      tag: 'CORE',
      tagBg: '#009A5E',
      icon: <GradCapIcon size={26} color="#009A5E" />,
      description:
        'Feedback e estatísticas sobre disciplinas e docentes. Veja médias, histórico e avaliações qualitativas de quem já passou pela matéria.',
      footerText: '⭐ 8.200+ avaliações',
      details: 'Notas de SS a SR, média ponderada por turma e badges sinceras.',
    },
    {
      id: 'provas',
      title: 'UNBOOK PROVAS',
      tag: 'MATERIAIS',
      tagBg: '#1349EB',
      icon: <BooksIcon size={26} color="#1349EB" />,
      description:
        'Repositório de arquivos, listas, resumos e gabaritos de semestres anteriores. Compartilhado e curado pelos próprios alunos.',
      footerText: '⭐ 3.400+ arquivos',
      details: 'Filtro por P1, P2, P3 e exames finais catalogados por disciplina.',
    },
    {
      id: 'grade',
      title: 'UNBPLANNER',
      tag: 'GRADES',
      tagBg: '#FF7A00',
      icon: <CalendarIcon size={26} color="#FF7A00" />,
      description:
        'Ferramenta de simulação de grade horária com detecção de conflitos em tempo real. Exporte em PDF, ICS ou PNG.',
      footerText: '⭐ 12.400 grades criadas',
      details: 'Detecção instantânea de choque de horários e sincronização com Google Agenda.',
    },
    {
      id: 'busca',
      title: 'UNBOOK BUSCA',
      tag: 'BUSCA',
      tagBg: '#9747FF',
      icon: <SearchIcon size={26} color="#9747FF" />,
      description:
        'Pesquisa inteligente integrada a todas as ferramentas. Encontre disciplinas, professores, eventos e materiais em um só lugar.',
      footerText: '★ Semântica + Filtros',
      details: 'Busca inteligente com tolerância a erros e códigos de departamento.',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>
              NOSSA ESTRUTURA — MÓDULO A MÓDULO
            </Text>
          </View>
          <Text style={styles.subtitle}>
            O ecossistema UnBook sob uma única marca
          </Text>
        </View>

        <View
          style={[
            styles.modulosGrid,
            isTablet && styles.modulosGridTablet,
            isMobile && styles.modulosGridMobile,
          ]}
        >
          {modulos.map((mod) => {
            const isHovered = hoveredModulo === mod.id;
            return (
              <Pressable
                key={mod.id}
                onPress={() => onSelectModulo?.(mod.id)}
                // @ts-ignore
                onMouseEnter={() => setHoveredModulo(mod.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredModulo(null)}
                style={[
                  styles.moduloCard,
                  isHovered && styles.moduloCardHovered,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>{mod.icon}</View>
                  <View style={[styles.tagBadge, { backgroundColor: mod.tagBg }]}>
                    <Text style={styles.tagBadgeText}>{mod.tag}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{mod.title}</Text>
                <Text style={styles.cardDesc}>{mod.description}</Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.footerText}>{mod.footerText}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
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
  header: {
    marginBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  accentBar: {
    width: 6,
    height: 28,
    backgroundColor: '#009A5E',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#707070',
    marginLeft: 18,
  },
  modulosGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  modulosGridTablet: {
    flexWrap: 'wrap',
  },
  modulosGridMobile: {
    flexDirection: 'column',
  },
  moduloCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 280,
  },
  moduloCardHovered: {
    transform: [{ translateY: -4 }],
    shadowOffset: { width: 6, height: 6 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  tagBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 20,
  },
  cardFooter: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    paddingTop: 12,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#707070',
  },
});


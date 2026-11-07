import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import {
  IconeCapelo,
  IconeLivros,
  IconeCalendario,
  IconeCheck,
} from '../../../components/UnbookIcons';
import Svg, { Circle, Line } from 'react-native-svg';

function SearchIconVector({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.2" />
      <Line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
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
      icon: <IconeCapelo size={26} color="#009A5E" />,
      description:
        'Feedback e estatísticas sobre disciplinas e docentes. Veja médias, distribuição de menções e relatos sinceros de quem já cursou a matéria.',
      footerText: '8.200+ avaliações registradas',
      details: 'Notas de SS a SR, média ponderada por turma e badges sinceras.',
    },
    {
      id: 'provas',
      title: 'UNBOOK MATERIAIS',
      tag: 'ARQUIVOS',
      tagBg: '#1349EB',
      icon: <IconeLivros size={26} color="#1349EB" />,
      description:
        'Repositório colaborativo de listas, resumos e provas de semestres anteriores. Compartilhado e mantido pela própria comunidade discente.',
      footerText: '3.400+ provas e resumos',
      details: 'Filtro por P1, P2, P3 e exames finais catalogados por disciplina.',
    },
    {
      id: 'catalogo',
      title: 'UNBOOK CATÁLOGO',
      tag: 'EMENTAS & FLUXO',
      tagBg: '#F1C321',
      tagTextColor: '#1F1F1F',
      icon: <IconeCalendario size={26} color="#1F1F1F" />,
      description:
        'Catálogo unificado com detalhes de ementas, créditos, pré-requisitos e histórico de turmas ofertadas a cada semestre pelos departamentos.',
      footerText: '2.100+ disciplinas catalogadas',
      details: 'Fluxo curricular, códigos de equivalência e requisitos de aprovação.',
    },
    {
      id: 'busca',
      title: 'UNBOOK BUSCA',
      tag: 'PESQUISA',
      tagBg: '#FE4141',
      icon: <SearchIconVector size={26} color="#FE4141" />,
      description:
        'Pesquisa inteligente unificada em toda a plataforma. Encontre disciplinas, professores, departamentos e códigos num piscar de olhos.',
      footerText: 'Busca semântica instantânea',
      details: 'Busca ágil por código da disciplina (ex: CIC0004) ou nome do docente.',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>
              ESTRUTURA DO ECOSSISTEMA
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Quatro ferramentas complementares integradas para o dia a dia na UnB
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
                  <View
                    style={[
                      styles.tagBadge,
                      { backgroundColor: mod.tagBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagBadgeText,
                        mod.tagTextColor ? { color: mod.tagTextColor } : { color: '#FFFFFF' },
                      ]}
                    >
                      {mod.tag}
                    </Text>
                  </View>
                </View>

                <Text style={styles.moduloTitle}>{mod.title}</Text>
                <Text style={styles.moduloDesc}>{mod.description}</Text>

                <View style={styles.detailsBox}>
                  <Text style={styles.detailsText}>{mod.details}</Text>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerRow}>
                    <IconeCheck size={14} color="#009A5E" />
                    <Text style={styles.footerText}>{mod.footerText}</Text>
                  </View>
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
    justifyContent: 'space-between',
    minHeight: 330,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
          transition:
            'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  moduloCardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '7px 7px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  tagBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  moduloTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  moduloDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 14,
  },
  detailsBox: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 18,
  },
  detailsText: {
    fontSize: 11.5,
    color: '#666666',
    lineHeight: 16,
  },
  cardFooter: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    paddingTop: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F1F1F',
  },
});

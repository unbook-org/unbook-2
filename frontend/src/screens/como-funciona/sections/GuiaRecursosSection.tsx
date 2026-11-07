import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import {
  IconeEscudo,
  IconeLivros,
  IconeGrafico,
} from '../../../components/UnbookIcons';

interface GuiaRecursosSectionProps {
  onPressExplore?: () => void;
}

export function GuiaRecursosSection({
  onPressExplore,
}: GuiaRecursosSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const recursos = [
    {
      id: 'catalogo',
      icon: <IconeEscudo size={28} color="#1F1F1F" />,
      iconBg: '#F1C321',
      title: 'Catálogo de Disciplinas e Ementas Oficiais',
      desc: 'Pesquise códigos de matéria (ex: MAT0025, CIC0004), confira a ementa completa, créditos e consulte pré-requisitos antes de planejar o semestre.',
      actionText: 'CONSULTAR MATÉRIAS →',
      action: onPressExplore,
      cardBg: '#FCFAEC',
      btnBg: '#F1C321',
      btnTextColor: '#1F1F1F',
    },
    {
      id: 'materiais',
      icon: <IconeLivros size={28} color="#FFFFFF" />,
      iconBg: '#1349EB',
      title: 'Repositório de Provas, Listas & Resumos',
      desc: 'Pesquise pelo código da disciplina (ex: MAT0025, CIC0004) e encontre listas resolvidas e provas de semestres anteriores enviadas por veteranos.',
      actionText: 'BUSCAR DISCIPLINAS →',
      action: onPressExplore,
      cardBg: '#FAF9F5',
      btnBg: '#1349EB',
      btnTextColor: '#FFFFFF',
    },
    {
      id: 'metricas',
      icon: <IconeGrafico size={28} color="#FFFFFF" />,
      iconBg: '#009A5E',
      title: 'Métricas Reais e Relatos de Quem Já Cursou',
      desc: 'Acesse o histórico de menções distribuídas (SS, MS, MM, MI, SR) e entenda o estilo de cada docente por meio de critérios objetivos da comunidade.',
      actionText: 'VER PROFESSORES →',
      action: onPressExplore,
      cardBg: '#FAF9F5',
      btnBg: '#009A5E',
      btnTextColor: '#FFFFFF',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>RECURSOS & FERRAMENTAS PRÁTICAS</Text>
          </View>
          <Text style={styles.subtitle}>
            Tudo o que você precisa para planejar seu semestre com tranquilidade
          </Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          {recursos.map((rec) => {
            const isHovered = hoveredCard === rec.id;
            return (
              <View
                key={rec.id}
                // @ts-ignore
                onMouseEnter={() => setHoveredCard(rec.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredCard(null)}
                style={[
                  styles.recursoCard,
                  { backgroundColor: rec.cardBg },
                  isHovered && styles.recursoCardHovered,
                ]}
              >
                <View>
                  <View style={[styles.iconContainer, { backgroundColor: rec.iconBg }]}>
                    {rec.icon}
                  </View>
                  <Text style={styles.recursoTitle}>{rec.title}</Text>
                  <Text style={styles.recursoDesc}>{rec.desc}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={rec.actionText}
                  onPress={rec.action}
                  style={({ pressed }) => [
                    styles.recursoBtn,
                    { backgroundColor: rec.btnBg },
                    pressed && styles.btnPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.recursoBtnText,
                      { color: rec.btnTextColor },
                    ]}
                  >
                    {rec.actionText}
                  </Text>
                </Pressable>
              </View>
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
  cardsGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  cardsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  recursoCard: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 320,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  recursoCardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '7px 7px 0px #1F1F1F',
        } as any)
      : {}),
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  recursoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  recursoDesc: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 24,
  },
  recursoBtn: {
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  recursoBtnText: {
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

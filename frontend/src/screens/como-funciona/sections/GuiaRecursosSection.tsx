import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';

interface GuiaRecursosSectionProps {
  onPressGrade?: () => void;
  onPressExplore?: () => void;
}

export function GuiaRecursosSection({
  onPressGrade,
  onPressExplore,
}: GuiaRecursosSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  const recursos = [
    {
      id: 'grade',
      icon: '📅',
      title: 'Montagem de Grade com Detecção de Conflitos',
      desc: 'Selecione suas turmas desejadas e veja o simulador indicar visualmente se há sobreposição de dias ou horários, evitando surpresas no período de matrícula.',
      actionText: 'SIMULAR GRADE AGORA',
      action: onPressGrade,
      cardBg: '#FCFAEC',
      btnBg: '#F1C321',
      btnTextColor: '#1F1F1F',
    },
    {
      id: 'materiais',
      icon: '📚',
      title: 'Repositório Colaborativo de Provas & Resumos',
      desc: 'Pesquise pelo código da matéria (ex: MAT0025, CIC0004) e encontre listas de exercícios resolvidas, apostilas e exames de semestres anteriores enviados por veteranos.',
      actionText: 'BUSCAR DISCIPLINAS',
      action: onPressExplore,
      cardBg: '#FAF9F5',
      btnBg: '#1349EB',
      btnTextColor: '#FFFFFF',
    },
    {
      id: 'metricas',
      icon: '📊',
      title: 'Métricas Reais e Badges da Comunidade',
      desc: 'Visualize a média histórica das menções distribuídas (SS, MS, MM, MI, SR) e entenda o perfil de cada docente através de badges votadas pelos alunos.',
      actionText: 'VER PROFESSORES',
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
            Tudo o que você precisa para planejar seu semestre sem dores de cabeça
          </Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          {recursos.map((rec) => (
            <View
              key={rec.id}
              style={[styles.recursoCard, { backgroundColor: rec.cardBg }]}
            >
              <View>
                <Text style={styles.iconLarge}>{rec.icon}</Text>
                <Text style={styles.recursoTitle}>{rec.title}</Text>
                <Text style={styles.recursoDesc}>{rec.desc}</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={rec.action}
                style={[styles.recursoBtn, { backgroundColor: rec.btnBg }]}
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
          ))}
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
    backgroundColor: '#FF7A00',
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
  },
  recursoCard: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 300,
  },
  iconLarge: {
    fontSize: 32,
  },
  recursoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 12,
    lineHeight: 22,
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
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  recursoBtnText: {
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});


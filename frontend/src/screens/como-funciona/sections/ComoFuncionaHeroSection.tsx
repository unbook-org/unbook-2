import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComoFuncionaHeroSectionProps {
  onPressExplore?: () => void;
  onPressGrade?: () => void;
}

export function ComoFuncionaHeroSection({
  onPressExplore,
  onPressGrade,
}: ComoFuncionaHeroSectionProps) {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>GUIA DE ENGENHARIA & RECURSOS</Text>
        </View>

        <Text style={styles.title}>
          Como o UnBook funciona{'\n'}
          <Text style={styles.titleAccent}>por trás das telas.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Do cálculo de compatibilidade de horários à garantia de anonimato criptográfico: entenda como a inteligência da plataforma transforma a rotina de mais de 12 mil alunos da Universidade de Brasília.
        </Text>

        <View style={styles.guaranteesRow}>
          <View style={styles.guaranteeTag}>
            <Text style={styles.guaranteeText}>⚡ DADOS SINCRONIZADOS COM SIGAA</Text>
          </View>
          <View style={styles.guaranteeTag}>
            <Text style={styles.guaranteeText}>🔒 ANONIMATO MATEMÁTICO REAL</Text>
          </View>
          <View style={styles.guaranteeTag}>
            <Text style={styles.guaranteeText}>💻 100% CÓDIGO ABERTO NO GITHUB</Text>
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
    alignItems: 'center',
  },
  container: {
    maxWidth: 900,
    width: '100%',
    alignItems: 'center',
  },
  badgePill: {
    backgroundColor: '#1349EB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    lineHeight: 48,
    marginBottom: 18,
    letterSpacing: -0.8,
  },
  titleAccent: {
    color: '#009A5E',
  },
  subtitle: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 720,
    marginBottom: 32,
  },
  guaranteesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  guaranteeTag: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  guaranteeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
});


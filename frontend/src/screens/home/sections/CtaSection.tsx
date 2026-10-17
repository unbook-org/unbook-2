import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../constants/theme';

export function CtaSection() {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.tag}>COMECE AGORA</Text>
        <Text style={styles.title}>Pronto para transformar seu semestre?</Text>
        <Text style={styles.description}>
          Junte-se à comunidade da UnB. Explore ementas, simule horários sem conflito e tome decisões informadas na matrícula.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Explorar Catálogo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Simular Grade</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.beige,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    width: '100%',
    maxWidth: 680,
    alignItems: 'center',
  },
  tag: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSizes.xs,
    fontWeight: theme.typography.fontWeights.bold,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },
  title: {
    color: theme.colors.darkCharcoal,
    fontSize: theme.typography.fontSizes.title,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.gray,
    fontSize: theme.typography.fontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
  secondaryButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  secondaryButtonText: {
    color: theme.colors.darkCharcoal,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
  },
});

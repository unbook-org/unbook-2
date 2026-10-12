import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { theme } from '../../../constants/theme';
import { NotebookBackground } from '../../../components/NotebookBackground';
import { UnbookLogo } from '../../../components/UnbookLogo';
import { HeroTornPaper, getTransitionHeight } from '../../../components/HeroTornPaper';

export interface HeroSectionProps {
  onPressStart?: () => void;
}

export function HeroSection({ onPressStart }: HeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const [btnHovered, setBtnHovered] = useState(false);

  // Largura responsiva do logo para ocupar presença nobre sem estourar em smartphones
  const logoWidth = isMobile
    ? Math.min(width - 48, 380)
    : isTablet
    ? Math.min(width - 64, 520)
    : 660;

  const transitionHeight = getTransitionHeight(width);

  return (
    <View style={styles.outerContainer}>
      <NotebookBackground style={styles.section}>
        <View style={styles.content}>
          {/* Tag superior neo-brutalista de boas-vindas */}
          <View style={styles.welcomePill}>
            <Text style={styles.welcomePillText}>BEM-VINDO AO SEMESTRE 2026.2</Text>
          </View>

          {/* Logo Oficial Vetorial Responsivo */}
          <View style={[styles.logoContainer, styles.logoEntrance]}>
            <UnbookLogo width={logoWidth} />
          </View>

          {/* Descrição abrangente expandida */}
          <Text style={[styles.description, isMobile && styles.descriptionMobile]}>
            Planeje sua grade semestral, consulte ementas reais e avalie matérias com total
            anonimato e transparência para toda a comunidade da UnB.
          </Text>

          {/* Botão COMEÇAR AGORA no molde neo-brutalista */}
          <View style={styles.buttonGroup}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Começar agora no UnBook"
              onPress={onPressStart}
              onHoverIn={() => setBtnHovered(true)}
              onHoverOut={() => setBtnHovered(false)}
              style={({ pressed }) => [
                styles.primaryButton,
                btnHovered && styles.primaryButtonHovered,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <View style={styles.buttonContentRow}>
                <Text style={styles.primaryButtonText}>COMEÇAR AGORA</Text>
              </View>
            </Pressable>
          </View>

          {/* Indicadores de Confiança e Comunidade Acadêmica */}
          <View style={[styles.trustRow, isMobile && styles.trustRowMobile]}>
            <View style={styles.trustItem}>
              <Text style={styles.trustItemText}>100% Anônimo & Seguro</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustItemText}>Sincronizado com SIGAA</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Text style={styles.trustItemText}>+12.400 Estudantes da UnB</Text>
            </View>
          </View>
        </View>
      </NotebookBackground>

      {/* Borda inferior rasgada do Hero (Top-Down rasgado autêntico) */}
      <View style={[styles.tornBottomContainer, { height: transitionHeight }]}>
        <HeroTornPaper height={transitionHeight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 20,
  },
  section: {
    paddingHorizontal: 32,
    paddingTop: theme.spacing.xxxl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tornBottomContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    marginTop: -3,
    zIndex: 20,
  },
  content: {
    width: '100%',
    maxWidth: 1360, // Estendido para respirar da esquerda para a direita
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  welcomePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: theme.spacing.md,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  welcomePillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1,
  },
  logoContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoEntrance: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'cartoonPopIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both',
        } as any)
      : {}),
  },
  description: {
    fontSize: 17,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 26,
    maxWidth: 680,
  },
  descriptionMobile: {
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    flexWrap: 'wrap',
  },
  buttonGroupMobile: {
    flexDirection: 'column',
    gap: 12,
  },

  // Molde fiel ao botão "Doe um Café" do Footer:
  // Fundo azul oficial #1349EB, borda de 2px, sombra sólida neo-brutalista 4px 4px,
  // e animação tátil de "empurrar o botão" (translate 3px 3px no pressed).
  primaryButton: {
    backgroundColor: theme.colors.primary, // #1349EB original
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingVertical: 14,
    paddingHorizontal: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        } as any)
      : {}),
  },
  primaryButtonHovered: {
    backgroundColor: '#1E56F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-2px)',
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  primaryButtonPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(3px, 3px)',
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        } as any)
      : {}),
  },
  secondaryButtonHovered: {
    backgroundColor: '#FAF9F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-2px)',
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  secondaryButtonPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(3px, 3px)',
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 16,
    flexWrap: 'wrap',
  },
  trustRowMobile: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustItemDot: {
    fontSize: 12,
  },
  trustItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  trustDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
});

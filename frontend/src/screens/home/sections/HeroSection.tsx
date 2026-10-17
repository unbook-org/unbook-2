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
import Svg, { Path } from 'react-native-svg';

// Ícone vetorial de seta apontando para baixo (estilo neo-brutalista)
function ArrowDownIcon({
  size = 16,
  color = '#1F1F1F',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4v13M18 11l-6 6-6-6"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export interface HeroSectionProps {
  onPressStart?: () => void;
  onPressAbout?: () => void;
}

export function HeroSection({ onPressStart, onPressAbout }: HeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const [btnHovered, setBtnHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

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
          <View
            nativeID="hero-welcome-pill"
            // @ts-ignore
            id="hero-welcome-pill"
            style={[styles.welcomePill, styles.welcomePillEntrance]}
          >
            <Text style={styles.welcomePillText}>BEM-VINDO AO SEMESTRE 2026.2</Text>
          </View>

          {/* Logo Oficial Vetorial Responsivo */}
          <View
            nativeID="hero-logo-container"
            // @ts-ignore
            id="hero-logo-container"
            style={[styles.logoContainer, styles.logoEntrance]}
          >
            <UnbookLogo
              nativeID="hero-logo-svg"
              // @ts-ignore
              id="hero-logo-svg"
              width={logoWidth}
              style={styles.logoFloat}
            />
          </View>

          {/* Descrição abrangente expandida */}
          <Text
            nativeID="hero-description"
            // @ts-ignore
            id="hero-description"
            style={[styles.description, isMobile && styles.descriptionMobile, styles.descriptionEntrance]}
          >
            Planeje sua grade semestral, consulte ementas reais e avalie matérias com total
            anonimato e transparência para toda a comunidade da UnB.
          </Text>

          {/* Botões de Ação no molde neo-brutalista */}
          <View
            nativeID="hero-button-group"
            // @ts-ignore
            id="hero-button-group"
            style={[
              styles.buttonGroup,
              isMobile && styles.buttonGroupMobile,
              styles.buttonGroupEntrance,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Começar agora no UnBook"
              onPress={onPressStart}
              onHoverIn={() => setBtnHovered(true)}
              onHoverOut={() => setBtnHovered(false)}
              style={({ pressed }) => [
                styles.primaryButton,
                isMobile && styles.primaryButtonMobile,
                btnHovered && styles.primaryButtonHovered,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <View style={styles.buttonContentRow}>
                <Text
                  style={[
                    styles.primaryButtonText,
                    isMobile && styles.primaryButtonTextMobile,
                  ]}
                >
                  COMEÇAR AGORA
                </Text>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Por que usar o UnBook?"
              onPress={onPressAbout}
              onHoverIn={() => setSecondaryHovered(true)}
              onHoverOut={() => setSecondaryHovered(false)}
              style={({ pressed }) => [
                styles.secondaryButton,
                isMobile && styles.secondaryButtonMobile,
                secondaryHovered && styles.secondaryButtonHovered,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <View style={styles.buttonContentRow}>
                <Text
                  style={[
                    styles.secondaryButtonText,
                    isMobile && styles.secondaryButtonTextMobile,
                  ]}
                >
                  POR QUE USAR O UNBOOK?
                </Text>
                <View
                  style={[
                    styles.arrowIconContainer,
                    secondaryHovered && styles.arrowIconHovered,
                  ]}
                >
                  <ArrowDownIcon size={16} color="#1F1F1F" />
                </View>
              </View>
            </Pressable>
          </View>

          {/* Indicadores de Confiança e Comunidade Acadêmica */}
          <View
            nativeID="hero-trust-row"
            // @ts-ignore
            id="hero-trust-row"
            style={[styles.trustRow, isMobile && styles.trustRowMobile, styles.trustRowEntrance]}
          >
            <View style={[styles.trustItem, styles.trustItemHoverable]}>
              <Text style={styles.trustItemText}>100% Anônimo & Seguro</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={[styles.trustItem, styles.trustItemHoverable]}>
              <Text style={styles.trustItemText}>Sincronizado com SIGAA</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={[styles.trustItem, styles.trustItemHoverable]}>
              <Text style={styles.trustItemText}>+12.400 Estudantes da UnB</Text>
            </View>
          </View>
        </View>
      </NotebookBackground>

      {/* Borda inferior rasgada do Hero (Top-Down rasgado autêntico) */}
      <View style={[styles.tornBottomContainer, { height: transitionHeight }]}>
        <HeroTornPaper height={transitionHeight} hasTornBorder={false} hasShadow={false} />
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
          cursor: 'default',
        } as any)
      : {}),
  },
  welcomePillEntrance: {
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'heroPillDropIn',
          animationDuration: '580ms',
          animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          animationDelay: '40ms',
          animationFillMode: 'both',
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
          animationKeyframes: 'heroLogoPopIn',
          animationDuration: '850ms',
          animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          animationDelay: '80ms',
          animationFillMode: 'both',
        } as any)
      : {}),
  },
  logoFloat: {
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'heroLogoFloat',
          animationDuration: '4000ms',
          animationTimingFunction: 'ease-in-out',
          animationDelay: '950ms',
          animationIterationCount: 'infinite',
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
  descriptionEntrance: {
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'heroTextSlideUp',
          animationDuration: '720ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationDelay: '280ms',
          animationFillMode: 'both',
        } as any)
      : {}),
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
  buttonGroupEntrance: {
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'heroButtonPunchIn',
          animationDuration: '760ms',
          animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          animationDelay: '440ms',
          animationFillMode: 'both',
        } as any)
      : {}),
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
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, background-color 0.18s ease',
        } as any)
      : {}),
  },
  primaryButtonHovered: {
    backgroundColor: '#1E56F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-3px) scale(1.025)',
          boxShadow: '6.5px 6.5px 0px #1F1F1F',
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
    paddingHorizontal: 28,
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
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease, background-color 0.18s ease',
        } as any)
      : {}),
  },
  secondaryButtonMobile: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondaryButtonHovered: {
    backgroundColor: '#FAF9F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-3px) scale(1.025)',
          boxShadow: '6.5px 6.5px 0px #1F1F1F',
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
  primaryButtonMobile: {
    paddingHorizontal: 26,
    paddingVertical: 12,
  },
  arrowIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  arrowIconHovered: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(3px)',
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
  primaryButtonTextMobile: {
    fontSize: 13,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  secondaryButtonTextMobile: {
    fontSize: 12.5,
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
  trustRowEntrance: {
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'heroTrustFadeUp',
          animationDuration: '650ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationDelay: '580ms',
          animationFillMode: 'both',
        } as any)
      : {}),
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustItemHoverable: {
    ...(Platform.OS === 'web'
      ? ({
          transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'default',
        } as any)
      : {}),
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

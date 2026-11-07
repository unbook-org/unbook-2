import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { Footer } from '../../components/Footer';
import { VidaUniversitariaStyles } from '../../components/vida-universitaria';
import {
  ComoFuncionaHeroSection,
  ModulosSection,
  FluxoAnonimatoSection,
  GuiaRecursosSection,
  FaqComoFuncionaSection,
} from './sections';

interface ComoFuncionaScreenProps {
  onNavigateHome: () => void;
  onNavigateSobre: () => void;
  onNavigateComoAjudar: () => void;
  onNavigateExplore?: () => void;
}

export function ComoFuncionaScreen({
  onNavigateHome,
  onNavigateSobre,
  onNavigateComoAjudar,
  onNavigateExplore,
}: ComoFuncionaScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <VidaUniversitariaStyles />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NewsBanner />
        <Navbar
          onPressLogo={onNavigateHome}
          onPressExplore={onNavigateExplore || onNavigateHome}
          onPressAbout={onNavigateSobre}
          onPressHowItWorks={() => {}}
          onPressDonate={onNavigateComoAjudar}
        />

        <ComoFuncionaHeroSection
          onPressExplore={onNavigateExplore || onNavigateHome}
        />

        <ModulosSection
          onSelectModulo={(modId) => {
            if (modId === 'catalogo' || modId === 'busca') {
              onNavigateHome();
            } else if (onNavigateExplore) {
              onNavigateExplore();
            }
          }}
        />

        <FluxoAnonimatoSection />

        <GuiaRecursosSection
          onPressExplore={onNavigateExplore || onNavigateHome}
        />

        <FaqComoFuncionaSection />

        <Footer
          onPressAbout={onNavigateSobre}
          onPressHowItWorks={() => {}}
          onPressDonate={onNavigateComoAjudar}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});


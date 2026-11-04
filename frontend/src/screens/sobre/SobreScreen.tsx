import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { Footer } from '../../components/Footer';
import {
  SobreHeroSection,
  ManifestoSection,
  PilaresSection,
  VinculoAcademicoSection,
  EquipeSection,
} from './sections';

interface SobreScreenProps {
  onNavigateHome: () => void;
  onNavigateComoFunciona: () => void;
  onNavigateComoAjudar: () => void;
  onNavigateExplore?: () => void;
}

export function SobreScreen({
  onNavigateHome,
  onNavigateComoFunciona,
  onNavigateComoAjudar,
  onNavigateExplore,
}: SobreScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NewsBanner />
        <Navbar
          onPressLogo={onNavigateHome}
          onPressExplore={onNavigateExplore || onNavigateHome}
          onPressAbout={() => {}}
          onPressHowItWorks={onNavigateComoFunciona}
          onPressDonate={onNavigateComoAjudar}
        />

        <SobreHeroSection
          onPressColaborar={onNavigateComoAjudar}
          onPressAvaliar={onNavigateExplore || onNavigateHome}
          onPressGrade={onNavigateHome}
        />

        <ManifestoSection />

        <PilaresSection />

        <VinculoAcademicoSection />

        <EquipeSection onPressJoinTeam={onNavigateComoAjudar} />

        <Footer
          onPressAbout={() => {}}
          onPressHowItWorks={onNavigateComoFunciona}
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


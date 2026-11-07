import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../../constants/theme';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { Footer } from '../../components/Footer';
import {
  VidaUniversitariaStyles,
} from '../../components/vida-universitaria';
import {
  SobreHeroSection,
  ManifestoSection,
  CampiCarteirinhasSection,
  MuralMinhocaoSection,
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
  const historiaRef = useRef<View>(null);

  const handleScrollToHistoria = () => {
    // Rolagem suave até a história se disponível
    if (typeof document !== 'undefined') {
      const el = document.getElementById('secao-historia');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

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
          onPressAbout={() => {}}
          onPressHowItWorks={onNavigateComoFunciona}
          onPressDonate={onNavigateComoAjudar}
        />

        {/* 1. OS 4 CAMPI — Carteirinhas de Estudante com Darcy, FGA, FCE, FAL */}
        <CampiCarteirinhasSection />

        {/* 2. NOSSA HISTÓRIA — Linha do Tempo com Fundo em Mosaico Athos Bulcão */}
        <View nativeID="secao-historia" ref={historiaRef}>
          <ManifestoSection />
        </View>

        {/* 3. CULTURA ACADÊMICA — Mural do Minhocão (Quadro de Cortiça & Post-its) */}
        <MuralMinhocaoSection />

        {/* 4. QUEM CONSTRÓI O UNBOOK — Primeira Versão com Departamentos e Redes */}
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

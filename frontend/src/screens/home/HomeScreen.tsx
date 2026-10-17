import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { theme } from '../../constants/theme';
import { Footer } from '../../components/Footer';
import { CartoonAnimationStyles } from '../../components/CartoonAnimationStyles';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import type { NivelEnsino } from '../../utils/nivelEnsino';

// Import das seções da Landing Page:
// 1. HeroSection (com boas-vindas, logo oficial e Começar Agora direcionando à busca)
// 2. FeaturesSection (Por que usar o UnBook com folha rasgada suave e cards ativos)
// 3. SearchSection (busca de matérias integrada à API do catálogo)
// 4. BadgesSection (Badges oficiais da aplicação: Só o ódio, Morri de paia, Soninho, Passável, Tranquilo, SS papai)
// 5. MarqueeSection (fitas coloridas deslizando em sentidos opostos)
// 6. StatsSection (A UnB em Números com cards em formato de gráfico que crescem em altura)
// 7. CommunitySection (A união faz a aprovação - reformulada e equilibrada)
// 8. SecuritySection (Avalie sem Medo de Retaliação com pop-up cartoon)
// 9. TestimonialsSection (Quem já usa, aprova com modal feedback)
// 10. FaqSection (Dúvidas Comuns com acordeão cartoon suave)
// 11. Footer (Rodapé oficial neo-brutalista profissional e elegante)
import {
  HeroSection,
  FeaturesSection,
  SearchSection,
  BadgesSection,
  MarqueeSection,
  StatsSection,
  CommunitySection,
  SecuritySection,
  TestimonialsSection,
  FaqSection,
} from './sections';

interface HomeScreenProps {
  onSelectMateria: (codigo: string, nivel?: NivelEnsino) => void;
  onSelectProfessor?: (identifier: string, origemNome?: string) => void;
}

export function HomeScreen({ onSelectMateria, onSelectProfessor }: HomeScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [searchLayoutY, setSearchLayoutY] = useState(0);
  const [featuresLayoutY, setFeaturesLayoutY] = useState(0);

  // Rolagem suave até o topo
  const handleScrollToTop = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Rolagem suave até a seção de funcionalidades
  const handleScrollToFeatures = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const featuresElement = document.getElementById('features-section');
      if (featuresElement) {
        featuresElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        return;
      }
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, featuresLayoutY - 20),
        animated: true,
      });
    }
  };

  // Rolagem suave com animação para a SearchSection quando clicar em "COMEÇAR AGORA"
  const handleScrollToSearch = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const searchElement = document.getElementById('search-section');
      if (searchElement) {
        searchElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        return;
      }
    }

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: Math.max(0, searchLayoutY - 20),
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Injeção global das animações, keyframes e curvas cartoon */}
      <CartoonAnimationStyles />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Novidades e Barra de Navegação no topo da página */}
        <NewsBanner />
        <Navbar
          onPressExplore={handleScrollToSearch}
          onPressAbout={handleScrollToFeatures}
          onPressLogo={handleScrollToTop}
        />

        <HeroSection
          onPressStart={handleScrollToSearch}
          onPressAbout={handleScrollToFeatures}
        />

        <View onLayout={(e) => setFeaturesLayoutY(e.nativeEvent.layout.y)}>
          <FeaturesSection />
        </View>

        <View onLayout={(e) => setSearchLayoutY(e.nativeEvent.layout.y)}>
          <SearchSection
            onSelectMateria={onSelectMateria}
            onSelectProfessor={onSelectProfessor}
          />
        </View>

        {/* Badges Oficiais da Aplicação (Só o ódio, Morri de paia, Soninho, etc.) */}
        <BadgesSection />

        <MarqueeSection />
        <StatsSection />
        <CommunitySection />
        <SecuritySection />
        <TestimonialsSection />
        <FaqSection />
        <Footer />
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
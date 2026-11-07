import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { Footer } from '../../components/Footer';
import {
  TicketsDoacaoSection,
  TermometroMetaSection,
  ChequeredDivider,
  ParaOndeVaiDinheiroSection,
  ComoColaborarSection,
  MarqueeApoio,
  PixModal,
} from './sections';

export type ModoApoio = 'doacao' | 'doar' | 'colaborar';

interface ComoAjudarScreenProps {
  onNavigateHome: () => void;
  onNavigateSobre: () => void;
  onNavigateComoFunciona: () => void;
  onNavigateExplore?: () => void;
  initialTab?: ModoApoio;
}

export function ComoAjudarScreen({
  onNavigateHome,
  onNavigateSobre,
  onNavigateComoFunciona,
  onNavigateExplore,
}: ComoAjudarScreenProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('Apoiar o UnBook');
  const [modalAmount, setModalAmount] = useState('R$ 4,50');

  const handleSelectTicket = (title: string, amount: string) => {
    setModalTitle(title);
    setModalAmount(amount);
    setModalVisible(true);
  };

  const handleSelectReitorTicket = () => {
    setModalTitle('Ingresso Patrono Livre - Valor Personalizado');
    setModalAmount('R$ 10,00');
    setModalVisible(true);
  };

  const handlePressMetaDoar = () => {
    setModalTitle('Apoio à Meta de Infraestrutura');
    setModalAmount('R$ 4,50');
    setModalVisible(true);
  };

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
          onPressAbout={onNavigateSobre}
          onPressHowItWorks={onNavigateComoFunciona}
          onPressDonate={() => {}}
        />


        {/* Hero: Vales & Ingressos de Apoio (Fundo escuro como na foto) */}
        <TicketsDoacaoSection
          onSelectTicket={handleSelectTicket}
          onSelectCustomAmount={handleSelectReitorTicket}
        />

        {/* Estrutura: Para onde vai o apoio (Caderno com linhas e espaços) */}
        <ParaOndeVaiDinheiroSection />

        {/* Outras Formas de Colaborar */}
        <ComoColaborarSection
          onPressExplore={onNavigateExplore || onNavigateHome}
        />

        {/* Termômetro da Infraestrutura (posicionado depois da estrutura) */}
        <TermometroMetaSection onPressDoar={handlePressMetaDoar} />

        <MarqueeApoio />

        <Footer
          onPressAbout={onNavigateSobre}
          onPressHowItWorks={onNavigateComoFunciona}
          onPressDonate={() => {
            setModalTitle('Apoie com um Café');
            setModalAmount('R$ 4,50');
            setModalVisible(true);
          }}
        />
      </ScrollView>

      <PixModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        ticketTitle={modalTitle}
        initialAmount={modalAmount}
      />
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


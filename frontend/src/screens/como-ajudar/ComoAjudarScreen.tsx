import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { Footer } from '../../components/Footer';
import {
  TicketsDoacaoSection,
  ChequeredDivider,
  ParaOndeVaiDinheiroSection,
  ComoColaborarSection,
  MarqueeApoio,
  PixModal,
} from './sections';

interface ComoAjudarScreenProps {
  onNavigateHome: () => void;
  onNavigateSobre: () => void;
  onNavigateComoFunciona: () => void;
  onNavigateExplore?: () => void;
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
    setModalTitle('PIX do Reitor - Valor Livre');
    setModalAmount('R$ 10,00');
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

        <TicketsDoacaoSection onSelectTicket={handleSelectTicket} />

        <ChequeredDivider />

        <ParaOndeVaiDinheiroSection
          onSelectReitorTicket={handleSelectReitorTicket}
        />

        <ComoColaborarSection
          onPressDonate={() => {
            setModalTitle('Apoie com um Café');
            setModalAmount('R$ 4,50');
            setModalVisible(true);
          }}
          onPressExplore={onNavigateExplore || onNavigateHome}
        />

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


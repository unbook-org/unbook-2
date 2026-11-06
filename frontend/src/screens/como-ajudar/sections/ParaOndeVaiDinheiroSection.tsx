import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { TicketBarcode } from './TicketBarcode';
import {
  MegaphoneDoodle,
  CoffeeDoodle,
  MagnifierDoodle,
  MoneyDoodle,
} from './ChequeredDivider';

interface ParaOndeVaiDinheiroSectionProps {
  onSelectReitorTicket: () => void;
}

function ServerIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="3" width="20" height="5" rx="2" stroke="#FFFFFF" strokeWidth="2" />
      <Rect x="2" y="10" width="20" height="5" rx="2" stroke="#FFFFFF" strokeWidth="2" />
      <Rect x="2" y="17" width="20" height="5" rx="2" stroke="#FFFFFF" strokeWidth="2" />
      <Circle cx="6" cy="5.5" r="1" fill="#FFFFFF" />
      <Circle cx="6" cy="12.5" r="1" fill="#FFFFFF" />
      <Circle cx="6" cy="19.5" r="1" fill="#FFFFFF" />
    </Svg>
  );
}

function AiIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="12" cy="12" r="4" stroke="#FFFFFF" strokeWidth="2" fill="#1349EB" />
    </Svg>
  );
}

function LightbulbIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ParaOndeVaiDinheiroSection({
  onSelectReitorTicket,
}: ParaOndeVaiDinheiroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.stickerMegaphone} pointerEvents="none">
        <MegaphoneDoodle size={52} />
      </View>
      <View style={styles.stickerMagnifier} pointerEvents="none">
        <MagnifierDoodle size={52} />
      </View>
      <View style={styles.stickerCoffee} pointerEvents="none">
        <CoffeeDoodle size={48} />
      </View>
      <View style={styles.stickerMoney} pointerEvents="none">
        <MoneyDoodle size={52} />
      </View>

      <View style={styles.container}>
        <View style={[styles.twoColumns, isMobile && styles.twoColumnsMobile]}>
          <View style={styles.leftCol}>
            <Text style={styles.sectionHeading}>Como funcionam as doações?</Text>
            <Text style={styles.bodyParagraph}>
              O UnBook é um projeto Open Source feito por estudantes para estudantes. Para mantermos a plataforma ativa e gratuita, contamos com a colaboração da nossa comunidade — seja através de novas ideias ou de contribuições financeiras voluntárias.
            </Text>
            <Text style={styles.bodyParagraph}>
              O processo de apoio funciona via PIX, direcionado aos responsáveis pela manutenção e gerenciamento da infraestrutura do site. Além de cobrir custos de hospedagem e domínio, investimos em novas tecnologias, como o sistema de busca inteligente por Inteligência Artificial, que requer recursos para processamento e API.
            </Text>

            <View style={styles.destinationBox}>
              <Text style={styles.destinationTitle}>Para aonde vai seu dinheiro?</Text>

              <View style={styles.blueCardsRow}>
                <View style={styles.blueCard}>
                  <Text style={styles.blueCardTitle}>Servidores e banco de dados.</Text>
                  <View style={styles.iconCenter}>
                    <ServerIcon size={34} />
                  </View>
                </View>

                <View style={styles.blueCard}>
                  <Text style={styles.blueCardTitle}>Inteligência Artificial</Text>
                  <View style={styles.iconCenter}>
                    <AiIcon size={34} />
                  </View>
                </View>

                <View style={styles.blueCard}>
                  <Text style={styles.blueCardTitle}>Produtividade</Text>
                  <View style={styles.iconCenter}>
                    <LightbulbIcon size={34} />
                  </View>
                </View>
              </View>

              <Text style={styles.cafeFooterText}>e uns cafés também...</Text>
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.reitorTicket}>
              <View style={styles.ticketTeethRow}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <View key={i} style={styles.tooth} />
                ))}
              </View>

              <View style={styles.ticketContent}>
                <Text style={styles.reitorTitle}>PIX do Reitor</Text>

                <View style={styles.reitorPill}>
                  <Text style={styles.reitorPillText}>
                    Valor: R$ O que seu coração mandar
                  </Text>
                </View>

                <Text style={styles.reitorDesc}>
                  Quer investir pesado no futuro da UnBook? Escolha qualquer valor e envie junto com uma mensagem de incentivo. Seu nome pode aparecer no nosso mural de agradecimentos!
                </Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Abrir PIX do Reitor"
                  onPress={onSelectReitorTicket}
                  style={({ pressed }) => [
                    styles.reitorBtn,
                    pressed && styles.reitorBtnPressed,
                  ]}
                >
                  <Text style={styles.reitorBtnText}>E o pix? nada ainda?</Text>
                </Pressable>
              </View>

              <View style={styles.dashedDividerWrapper}>
                <View style={styles.cutoutLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.cutoutRight} />
              </View>

              <View style={styles.barcodeArea}>
                <TicketBarcode code="UNB-PIX-DO-REITOR" height={50} color="#1F1F1F" />
              </View>
            </View>
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
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
    zIndex: 2,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },
  twoColumnsMobile: {
    flexDirection: 'column',
    gap: 36,
  },
  leftCol: {
    flex: 1.2,
  },
  rightCol: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  sectionHeading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 16,
  },
  bodyParagraph: {
    fontSize: 14,
    color: '#4A4A4A',
    lineHeight: 22,
    marginBottom: 16,
  },
  destinationBox: {
    backgroundColor: '#1349EB',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1F1F1F',
    padding: 22,
    marginTop: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  destinationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 18,
    textAlign: 'center',
  },
  blueCardsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  blueCard: {
    flex: 1,
    backgroundColor: '#0F3CC4',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    minHeight: 110,
    justifyContent: 'space-between',
  },
  blueCardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 14,
  },
  iconCenter: {
    marginVertical: 4,
  },
  cafeFooterText: {
    color: '#FCFAEC',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 14,
    opacity: 0.9,
  },
  reitorTicket: {
    backgroundColor: '#F5CD47',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  ticketTeethRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: -8,
    marginBottom: 10,
  },
  tooth: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  ticketContent: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  reitorTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 14,
  },
  reitorPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  reitorPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  reitorDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 18,
  },
  reitorBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  reitorBtnPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
  reitorBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  dashedDividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    position: 'relative',
    height: 20,
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    marginLeft: -10,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 2,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  barcodeArea: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  stickerMegaphone: {
    position: 'absolute',
    top: -24,
    left: 24,
    zIndex: 1,
  },
  stickerMagnifier: {
    position: 'absolute',
    top: 10,
    right: '48%',
    zIndex: 1,
  },
  stickerCoffee: {
    position: 'absolute',
    bottom: 24,
    right: 32,
    zIndex: 1,
  },
  stickerMoney: {
    position: 'absolute',
    bottom: 30,
    left: '38%',
    zIndex: 1,
  },
});


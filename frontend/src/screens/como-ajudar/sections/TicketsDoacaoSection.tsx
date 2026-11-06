import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { TicketBarcode } from './TicketBarcode';

interface TicketsDoacaoSectionProps {
  onSelectTicket: (ticketTitle: string, amount: string) => void;
}

interface TicketData {
  id: string;
  title: string;
  amount: string;
  description: string;
  buttonText: string;
  bgColor: string;
  textColor: string;
}

const TICKETS: TicketData[] = [
  {
    id: 'balinha',
    title: 'Apoie com uma balinha',
    amount: 'Valor: R$ 1,00.',
    description:
      'Nos ajude a comprar uma balinha! Brincadeiras à parte, seu apoio simbólico nos ajuda a manter a motivação e o café necessário para as madrugadas de código.',
    buttonText: 'Enviar um agrado.',
    bgColor: '#4DAE84',
    textColor: '#1F1F1F',
  },
  {
    id: 'ru',
    title: 'Pague meu RU',
    amount: 'Valor: R$ 4,50.',
    description:
      'O servidor também precisa de energia! Esse valor nos ajuda diretamente a manter o domínio do site ativo e a custear os direitos reservados para garantir a estabilidade do sistema.',
    buttonText: 'Alimentar o sistema',
    bgColor: '#DF8151',
    textColor: '#1F1F1F',
  },
  {
    id: 'mecenas',
    title: 'Mecenas da UnB',
    amount: 'Valor: R$ 6,10.',
    description:
      'Se você amou nosso projeto, saiba que o sentimento é mútuo. Esse aporte de "ostentação" é o que garante nossa produtividade no final do mês e permite o investimento em novas ferramentas de IA para a plataforma.',
    buttonText: 'Apoiar com tudo',
    bgColor: '#5E889D',
    textColor: '#1F1F1F',
  },
];

export function TicketsDoacaoSection({ onSelectTicket }: TicketsDoacaoSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1080;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.doodleLeft} pointerEvents="none">
        <Svg width={140} height={180} viewBox="0 0 140 180" fill="none">
          <Path
            d="M20 10 Q 70 40 20 70 T 20 130 T 40 170"
            stroke="#FE4141"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>

      <View style={styles.doodleRight} pointerEvents="none">
        <Svg width={150} height={190} viewBox="0 0 150 190" fill="none">
          <Path
            d="M30 20 Q 80 60 40 100 T 80 150 T 60 180"
            stroke="#F1C321"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>

      <View style={styles.innerContainer}>
        <Text style={styles.mainTitle}>Formas de doação</Text>
        <Text style={styles.subtitle}>
          Estas são algumas das formas de você contribuir para a continuidade do nosso projeto! Selecione um dos tickets de doação abaixo e siga as instruções passo a passo para realizar o procedimento.
        </Text>

        <View style={[styles.ticketsGrid, (isMobile || isTablet) && styles.ticketsGridWrap]}>
          {TICKETS.map((ticket) => {
            const isHovered = hoveredCard === ticket.id;
            return (
              <View
                key={ticket.id}
                style={[
                  styles.ticketCard,
                  { backgroundColor: ticket.bgColor },
                  isHovered && styles.ticketCardHovered,
                ]}
                // @ts-ignore
                onMouseEnter={() => setHoveredCard(ticket.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredCard(null)}
              >
                <View style={styles.ticketTeethRow}>
                  {Array.from({ length: 11 }).map((_, i) => (
                    <View key={i} style={styles.tooth} />
                  ))}
                </View>

                <View style={styles.ticketBody}>
                  <Text style={styles.ticketTitle}>{ticket.title}</Text>

                  <View style={styles.valueBadge}>
                    <Text style={styles.valueText}>{ticket.amount}</Text>
                  </View>

                  <Text style={styles.ticketDesc}>{ticket.description}</Text>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={ticket.buttonText}
                    onPress={() => onSelectTicket(ticket.title, ticket.amount.replace('Valor: ', '').replace('.', ''))}
                    style={({ pressed }) => [
                      styles.ticketActionBtn,
                      pressed && styles.ticketActionBtnPressed,
                    ]}
                  >
                    <Text style={styles.ticketActionBtnText}>{ticket.buttonText}</Text>
                  </Pressable>
                </View>

                <View style={styles.dashedDividerWrapper}>
                  <View style={styles.cutoutLeft} />
                  <View style={styles.dashedLine} />
                  <View style={styles.cutoutRight} />
                </View>

                <View style={styles.ticketBarcodeArea}>
                  <TicketBarcode
                    code={`UNB-${ticket.id.toUpperCase()}`}
                    height={46}
                    color="#1F1F1F"
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#272725',
    paddingVertical: 64,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  doodleLeft: {
    position: 'absolute',
    top: 30,
    left: 20,
    opacity: 0.85,
    zIndex: 1,
  },
  doodleRight: {
    position: 'absolute',
    top: 30,
    right: 20,
    opacity: 0.85,
    zIndex: 1,
  },
  innerContainer: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
    alignItems: 'center',
    zIndex: 2,
  },
  mainTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#D9D9D9',
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 22,
    marginBottom: 44,
  },
  ticketsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    width: '100%',
  },
  ticketsGridWrap: {
    flexWrap: 'wrap',
  },
  ticketCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    backgroundColor: '#4DAE84',
    ...(Platform.OS === 'web' ? ({ transition: 'transform 0.2s ease, box-shadow 0.2s ease' } as any) : {}),
  },
  ticketCardHovered: {
    transform: [{ translateY: -6 }],
    shadowOffset: { width: 8, height: 10 },
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
    backgroundColor: '#272725',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  ticketBody: {
    paddingHorizontal: 22,
    paddingBottom: 20,
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 16,
  },
  valueBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  ticketDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 72,
  },
  ticketActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  ticketActionBtnPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
  ticketActionBtnText: {
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
    backgroundColor: '#272725',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    marginLeft: -10,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#272725',
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
  ticketBarcodeArea: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 14,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});


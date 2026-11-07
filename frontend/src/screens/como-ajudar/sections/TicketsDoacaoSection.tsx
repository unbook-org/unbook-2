import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

interface TicketsDoacaoSectionProps {
  onSelectTicket: (ticketTitle: string, amount: string) => void;
  onSelectCustomAmount?: () => void;
}

interface TicketVoucherData {
  id: string;
  title: string;
  amount: string;
  rawAmount: string;
  description: string;
  buttonText: string;
  bgColor: string;
}

const VOUCHER_TICKETS: TicketVoucherData[] = [
  {
    id: 'balinha',
    title: 'Apoie com uma\nbalinha',
    amount: 'Valor: R$ 1,00.',
    rawAmount: 'R$ 1,00',
    description:
      'Nos ajude a comprar uma balinha! Brincadeira, seu apoio simbólico nos ajuda a manter a motivação e o café necessário para as madrugadas de código.',
    buttonText: 'Enviar um agrado.',
    bgColor: '#41A77C',
  },
  {
    id: 'ru',
    title: 'Pague meu RU',
    amount: 'Valor: R$ 4,50.',
    rawAmount: 'R$ 4,50',
    description:
      'O servidor também precisa de energia! Esse valor nos ajuda diretamente a manter o domínio do site ativo e a custear os direitos reservados para garantir a estabilidade do sistema.',
    buttonText: 'Alimentar o sistema',
    bgColor: '#D98B62',
  },
  {
    id: 'mecenas',
    title: 'Mecenas da UnB',
    amount: 'Valor: R$ 6,10.',
    rawAmount: 'R$ 6,10',
    description:
      "Se você amou nosso projeto, saiba que o sentimento é mútuo. Esse aporte de 'ostentação' é o que garante nossa produtividade no final do mês e permite o investimento em novas ferramentas de IA para a plataforma.",
    buttonText: 'Apoiar com tudo',
    bgColor: '#5B7E8A',
  },
];

// Dentes serrados do topo do ingresso (picote de destacar)
function TopTicketTeeth({ color = '#41A77C' }: { color?: string }) {
  return (
    <Svg width="100%" height={14} viewBox="0 0 280 14" preserveAspectRatio="none">
      <Path
        d="M 0 14 
           L 0 7 
           C 2 7, 3 2, 7 2 C 11 2, 12 7, 14 7
           C 16 7, 17 2, 21 2 C 25 2, 26 7, 28 7
           C 30 7, 31 2, 35 2 C 39 2, 40 7, 42 7
           C 44 7, 45 2, 49 2 C 53 2, 54 7, 56 7
           C 58 7, 59 2, 63 2 C 67 2, 68 7, 70 7
           C 72 7, 73 2, 77 2 C 81 2, 82 7, 84 7
           C 86 7, 87 2, 91 2 C 95 2, 96 7, 98 7
           C 100 7, 101 2, 105 2 C 109 2, 110 7, 112 7
           C 114 7, 115 2, 119 2 C 123 2, 124 7, 126 7
           C 128 7, 129 2, 133 2 C 137 2, 138 7, 140 7
           C 142 7, 143 2, 147 2 C 151 2, 152 7, 154 7
           C 156 7, 157 2, 161 2 C 165 2, 166 7, 168 7
           C 170 7, 171 2, 175 2 C 179 2, 180 7, 182 7
           C 184 7, 185 2, 189 2 C 193 2, 194 7, 196 7
           C 198 7, 199 2, 203 2 C 207 2, 208 7, 210 7
           C 212 7, 213 2, 217 2 C 221 2, 222 7, 224 7
           C 226 7, 227 2, 231 2 C 235 2, 236 7, 238 7
           C 240 7, 241 2, 245 2 C 249 2, 250 7, 252 7
           C 254 7, 255 2, 259 2 C 263 2, 264 7, 266 7
           C 268 7, 269 2, 273 2 C 277 2, 278 7, 280 7
           L 280 14 Z"
        fill={color}
      />
    </Svg>
  );
}

// Dentes serrados triangulares da base do canhoto do código de barras
function BottomStubSawtooth() {
  return (
    <Svg width="100%" height={12} viewBox="0 0 280 12" preserveAspectRatio="none">
      <Path
        d="M 0 0 
           L 0 5
           L 7 12 L 14 5 L 21 12 L 28 5 L 35 12 L 42 5
           L 49 12 L 56 5 L 63 12 L 70 5 L 77 12 L 84 5
           L 91 12 L 98 5 L 105 12 L 112 5 L 119 12 L 126 5
           L 133 12 L 140 5 L 147 12 L 154 5 L 161 12 L 168 5
           L 175 12 L 182 5 L 189 12 L 196 5 L 203 12 L 210 5
           L 217 12 L 224 5 L 231 12 L 238 5 L 245 12 L 252 5
           L 259 12 L 266 5 L 273 12 L 280 5
           L 280 0 Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// Barras verticais autênticas de código de barras
function VoucherBarcodeSvg() {
  const bars = [
    { x: 12, w: 5 },
    { x: 22, w: 3 },
    { x: 29, w: 7 },
    { x: 41, w: 4 },
    { x: 49, w: 8 },
    { x: 62, w: 3 },
    { x: 69, w: 6 },
    { x: 79, w: 4 },
    { x: 87, w: 8 },
    { x: 100, w: 3 },
    { x: 107, w: 5 },
    { x: 116, w: 7 },
    { x: 128, w: 4 },
    { x: 136, w: 8 },
    { x: 149, w: 3 },
    { x: 156, w: 6 },
    { x: 166, w: 5 },
    { x: 175, w: 7 },
    { x: 187, w: 4 },
    { x: 195, w: 8 },
    { x: 208, w: 3 },
    { x: 215, w: 6 },
    { x: 225, w: 5 },
    { x: 234, w: 4 },
    { x: 242, w: 8 },
    { x: 254, w: 4 },
    { x: 262, w: 5 },
  ];

  return (
    <Svg width="100%" height={46} viewBox="0 0 280 46" preserveAspectRatio="none">
      {bars.map((bar, idx) => (
        <Rect
          key={idx}
          x={bar.x}
          y={0}
          width={bar.w}
          height={46}
          fill="#181818"
        />
      ))}
    </Svg>
  );
}

export function TicketsDoacaoSection({
  onSelectTicket,
  onSelectCustomAmount,
}: TicketsDoacaoSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1080;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Cabeçalho do Hero Escuro */}
        <View style={styles.header}>
          <View style={styles.pillBadge}>
            <Text style={styles.pillBadgeText}>VALES & INGRESSOS DE APOIO</Text>
          </View>
          <Text style={styles.title}>
            Pegue um ticket para apoiar o UnBook.
          </Text>
          <Text style={styles.subtitle}>
            Escolha um vale abaixo para contribuir com a manutenção dos servidores e da infraestrutura da plataforma. Toda colaboração retorna diretamente em estabilidade para os estudantes da UnB.
          </Text>
        </View>

        {/* Deck de 3 Tickets Exatamente como na Foto */}
        <View
          style={[
            styles.ticketsDeck,
            isTablet && styles.ticketsDeckTablet,
            isMobile && styles.ticketsDeckMobile,
          ]}
        >
          {VOUCHER_TICKETS.map((ticket) => {
            const isHovered = hoveredCard === ticket.id;
            return (
              <Pressable
                key={ticket.id}
                onPress={() => onSelectTicket(ticket.title.replace('\n', ' '), ticket.rawAmount)}
                // @ts-ignore
                onMouseEnter={() => setHoveredCard(ticket.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredCard(null)}
                style={[
                  styles.ticketWrapper,
                  isHovered && styles.ticketWrapperHovered,
                ]}
              >
                {/* Dentes de Picote no Topo */}
                <View style={styles.topTeethContainer}>
                  <TopTicketTeeth color={ticket.bgColor} />
                </View>

                {/* Corpo do Ingresso com Cor Sólida */}
                <View style={[styles.ticketBody, { backgroundColor: ticket.bgColor }]}>
                  {/* Moldura Interna com Linha Branca Contornando */}
                  <View style={styles.innerWhiteFrame}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>

                    {/* Caixa Branca com o Valor */}
                    <View style={styles.valueBox}>
                      <Text style={styles.valueText}>{ticket.amount}</Text>
                    </View>

                    {/* Texto Descritivo */}
                    <Text style={styles.ticketDesc}>{ticket.description}</Text>

                    {/* Botão Branco com Borda Escura */}
                    <View style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>
                        {ticket.buttonText}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Canhoto do Código de Barras (Fundo Branco) */}
                <View style={styles.barcodeStub}>
                  <VoucherBarcodeSvg />
                </View>

                {/* Dentes Serrados de Baixo (Picote Triangular) */}
                <View style={styles.bottomSawtoothContainer}>
                  <BottomStubSawtooth />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Opção de Valor Livre abaixo dos tickets */}
        <View style={styles.customAmountFooter}>
          <Text style={styles.customAmountPrompt}>
            Deseja contribuir com outro valor?
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir PIX com valor livre"
            onPress={onSelectCustomAmount}
            style={({ pressed }) => [
              styles.customAmountBtn,
              pressed && styles.customAmountBtnPressed,
            ]}
          >
            <Text style={styles.customAmountBtnText}>
              CONTRIBUIR COM QUALQUER VALOR VIA PIX →
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#272725', // Cor escura idêntica à foto
    paddingTop: 64,
    paddingBottom: 72,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#181818',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    maxWidth: 780,
  },
  pillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  pillBadgeText: {
    color: '#FAF9F5',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FAF9F5',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 15,
    color: '#A6A49F',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 700,
  },
  ticketsDeck: {
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    marginBottom: 44,
  },
  ticketsDeckTablet: {
    flexWrap: 'wrap',
    gap: 24,
  },
  ticketsDeckMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 32,
  },
  ticketWrapper: {
    width: 288,
    maxWidth: '100%',
    overflow: 'visible',
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
          transition:
            'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease',
        } as any)
      : {}),
  },
  ticketWrapperHovered: {
    transform: [{ translateY: -16 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 24px 36px rgba(0,0,0,0.65)',
        } as any)
      : {}),
  },
  topTeethContainer: {
    width: '100%',
    height: 14,
    marginBottom: -1,
  },
  ticketBody: {
    padding: 10,
    minHeight: 330,
    justifyContent: 'center',
  },
  innerWhiteFrame: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  ticketTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#181818',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  valueBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  valueText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#181818',
    letterSpacing: -0.3,
  },
  ticketDesc: {
    fontSize: 11.5,
    color: '#181818',
    lineHeight: 17,
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.95,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#181818',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#181818',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#181818',
    letterSpacing: 0.2,
  },
  barcodeStub: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  bottomSawtoothContainer: {
    width: '100%',
    height: 12,
    marginTop: -1,
  },
  customAmountFooter: {
    alignItems: 'center',
    gap: 12,
  },
  customAmountPrompt: {
    fontSize: 14,
    color: '#A6A49F',
  },
  customAmountBtn: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#181818',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2.5px 2.5px 0px #000000',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  customAmountBtnPressed: {
    transform: [{ translateY: 2 }],
  },
  customAmountBtnText: {
    color: '#181818',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});

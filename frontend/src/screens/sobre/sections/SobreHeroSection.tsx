import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Platform,
} from 'react-native';
import Svg, { Rect, Circle, Path, Line, G } from 'react-native-svg';
import { NotebookBackground } from '../../../components/NotebookBackground';
import {
  Migalha,
  WashiTape,
  CarimboMencao,
  TicketRU,
  FONTE_MANUSCRITA,
  vu,
} from '../../../components/vida-universitaria';

interface SobreHeroSectionProps {
  onPressColaborar?: () => void;
  onPressAvaliar?: () => void;
  onPressHistoria?: () => void;
}

// Ilustração estilo Polaroid do Corredor do ICC (Minhocão)
function IccPolaroid() {
  return (
    <View style={styles.polaroidContainer} {...vu('lift')}>
      <WashiTape width={74} height={22} rotation="-3deg" style={styles.polaroidTapeTop} />

      {/* Janela da Foto */}
      <View style={styles.polaroidPhotoWindow}>
        <Svg width="100%" height={150} viewBox="0 0 200 150">
          {/* Céu */}
          <Rect width="200" height="150" fill="#E8EDF2" />

          {/* Vigas de concreto em perspectiva (Arcos do ICC) */}
          <Path d="M 0 0 L 200 0 L 200 45 L 0 45 Z" fill="#9DA3A9" />
          <Line x1="0" y1="45" x2="200" y2="45" stroke="#1F1F1F" strokeWidth="2.5" />

          {/* Pilares curvos do Minhocão */}
          {Array.from({ length: 9 }).map((_, i) => {
            const x = 20 + i * 22;
            const y = 45;
            const h = 85 - i * 3;
            return (
              <G key={i}>
                <Rect x={x} y={y} width="12" height={h} fill={i % 2 === 0 ? '#B0B6BD' : '#9299A1'} stroke="#1F1F1F" strokeWidth="1.5" />
              </G>
            );
          })}

          {/* Jardim interno do ICC com plantas e bancos */}
          <Path d="M 0 115 Q 100 108 200 120 L 200 150 L 0 150 Z" fill="#4B6651" />
          <Path d="M 10 125 Q 35 110 50 135 Q 80 112 110 138 Q 140 115 170 140" stroke="#009A5E" strokeWidth="6" strokeLinecap="round" fill="none" />
          <Path d="M 25 130 Q 45 120 65 140 Q 95 124 125 142" stroke="#2B7A4B" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Piso de concreto polido refletindo o corredor */}
          <Path d="M 120 100 L 200 95 L 200 150 L 80 150 Z" fill="#D3D7DC" opacity={0.6} />

          {/* Tag de localização tipo carimbo de foto */}
          <Rect x="8" y="10" width="105" height="18" rx="4" fill="rgba(31,31,31,0.85)" />
        </Svg>
        <Text style={styles.polaroidBadgeText}>ICC NORTE • 12:15</Text>
      </View>

      {/* Legenda manuscrita na base da Polaroid */}
      <Text style={styles.polaroidCaption}>minhocão em dia de chuva</Text>
    </View>
  );
}

// Xícara de café com vaporzinho
function CafeCopo() {
  return (
    <View style={styles.cafeContainer} {...vu('bob')}>
      <Svg width={44} height={60} viewBox="0 0 44 60">
        {/* Vapores */}
        <Path d="M14 6 Q16 2 14 0 M22 6 Q24 2 22 0 M30 6 Q32 2 30 0" stroke="#707070" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Copo */}
        <Path d="M6 14 L38 14 L32 54 Q31 58 26 58 L18 58 Q13 58 12 54 Z" fill="#FFFFFF" stroke="#1F1F1F" strokeWidth="2" />
        {/* Luva de papelão */}
        <Path d="M9 26 L35 26 L33 42 L11 42 Z" fill="#D9A55B" stroke="#1F1F1F" strokeWidth="1.5" />
        {/* Tampa */}
        <Rect x="4" y="10" width="36" height="5" rx="2" fill="#1F1F1F" />
      </Svg>
    </View>
  );
}

// Folhinha de "Semana de Provas"
function CalendarioProvas() {
  return (
    <View style={styles.calendarioCard} {...vu('drop-3')}>
      <View style={styles.calendarioHeader}>
        <Text style={styles.calendarioHeaderPill}>SEMANA DE PROVAS</Text>
      </View>
      <View style={styles.calendarioGrid}>
        {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((dia, idx) => (
          <View key={dia} style={[styles.calendarioDay, idx === 2 && styles.calendarioDayActive]}>
            <Text style={styles.calendarioDayLabel}>{dia}</Text>
            <Text style={[styles.calendarioDayNum, idx === 2 && styles.calendarioDayNumActive]}>
              {12 + idx}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.calendarioDica}>P1 de Cálculo 1 • Boa sorte!</Text>
    </View>
  );
}

export function SobreHeroSection({
  onPressColaborar,
  onPressAvaliar,
  onPressHistoria,
}: SobreHeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  return (
    <NotebookBackground style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Coluna Esquerda: Texto de Manifesto dos Estudantes */}
        <View style={styles.leftCol}>
          <View style={styles.pillBadge} {...vu('drop-1')}>
            <Text style={styles.pillBadgeText}>FEITO POR QUEM VIVE A UNB</Text>
          </View>

          <Text style={styles.mainTitle} {...vu('drop-2')}>
            Feito por quem já perdeu o{' '}
            <Text style={styles.highlightText}>110 lotado.</Text>
          </Text>

          <Text style={styles.subtitle} {...vu('drop-3')}>
            O UnBook nasceu nos corredores do Minhocão: estudantes ajudando estudantes a escolher matérias, entender os estilos dos docentes e sobreviver ao semestre sem cair em cilada.
          </Text>

          {/* Destaques Rápidos */}
          <View style={styles.quickFactsRow} {...vu('fade-up-2')}>
            <View style={styles.quickFactBox}>
              <Text style={styles.quickFactNum}>100%</Text>
              <Text style={styles.quickFactLabel}>Anônimo & Aberto</Text>
            </View>
            <View style={styles.quickFactBox}>
              <Text style={styles.quickFactNum}>8.200+</Text>
              <Text style={styles.quickFactLabel}>Relatos Sinceros</Text>
            </View>
            <View style={styles.quickFactBox}>
              <Text style={styles.quickFactNum}>4</Text>
              <Text style={styles.quickFactLabel}>Campi Integrados</Text>
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.buttonsRow} {...vu('fade-up-3')}>
            {onPressHistoria && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Conhecer nossa história"
                onPress={onPressHistoria}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.primaryBtnText}>CONHEÇA A HISTÓRIA ↓</Text>
              </Pressable>
            )}

            {onPressColaborar && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Colaborar com o projeto"
                onPress={onPressColaborar}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.secondaryBtnText}>COLABORAR COM O PROJETO →</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Coluna Direita: Colagem Visual do Cotidiano da UnB */}
        <View style={[styles.rightCol, isMobile && styles.rightColMobile]}>
          {/* Polaroid do Minhocão */}
          <View style={styles.polaroidSlot}>
            <IccPolaroid />
          </View>

          {/* Ticket do RU colado ao lado */}
          <View style={styles.ticketRuSlot} {...vu('drop-4')}>
            <WashiTape width={65} height={18} rotation="4deg" color="rgba(0, 154, 94, 0.65)" style={styles.ticketTape} />
            <TicketRU valor="R$ 4,50" data="2026.2" />
          </View>

          {/* Carimbo SR Riscado ("Nunca mais!") */}
          <View style={styles.carimboSlot} {...vu('stamp')}>
            <CarimboMencao mencao="SR" size={72} riscado />
          </View>

          {/* Xícara de Café */}
          <View style={styles.cafeSlot}>
            <CafeCopo />
          </View>

          {/* Calendário de Provas */}
          <View style={styles.calendarioSlot}>
            <CalendarioProvas />
          </View>

          {/* Mascote Migalha (Pombo do ICC com Pão do RU) */}
          <View style={styles.migalhaSlot} {...vu('bob-alt')}>
            <Migalha size={150} pose="pao" />
            {/* Balãozinho de Fala estilo quadrinho */}
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                Pode avaliar sem medo,{'\n'}ninguém vai saber.
              </Text>
              <View style={styles.speechArrow} />
            </View>
          </View>
        </View>
      </View>
    </NotebookBackground>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    width: '100%',
  },
  container: {
    maxWidth: 1180,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
    flexWrap: 'wrap',
  },
  leftCol: {
    flex: 1.15,
    minWidth: 320,
  },
  rightCol: {
    flex: 1,
    minWidth: 320,
    minHeight: 460,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColMobile: {
    minHeight: 480,
    width: '100%',
    marginTop: 24,
  },
  pillBadge: {
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  pillBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 48,
    letterSpacing: -0.8,
    marginBottom: 16,
  },
  highlightText: {
    color: '#009A5E',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 25,
    marginBottom: 28,
    maxWidth: 580,
  },
  quickFactsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  quickFactBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  quickFactNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1349EB',
    letterSpacing: -0.4,
  },
  quickFactLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666666',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: '#1349EB',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 22,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  btnPressed: {
    transform: [{ translateY: 2 }],
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  secondaryBtnText: {
    color: '#1F1F1F',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  /* Elementos da Colagem da Direita */
  polaroidSlot: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 3,
  },
  polaroidContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingBottom: 16,
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    width: 220,
    transform: [{ rotate: '-4deg' }],
  },
  polaroidTapeTop: {
    top: -12,
    alignSelf: 'center',
  },
  polaroidPhotoWindow: {
    backgroundColor: '#E8EDF2',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  polaroidBadgeText: {
    position: 'absolute',
    top: 12,
    left: 14,
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  polaroidCaption: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 17,
    color: '#1F1F1F',
    textAlign: 'center',
    marginTop: 10,
    transform: [{ rotate: '-1deg' }],
  },
  ticketRuSlot: {
    position: 'absolute',
    top: 0,
    right: 15,
    zIndex: 5,
    transform: [{ rotate: '5deg' }],
  },
  ticketTape: {
    top: -8,
    right: 20,
  },
  carimboSlot: {
    position: 'absolute',
    top: 130,
    right: 25,
    zIndex: 6,
  },
  cafeSlot: {
    position: 'absolute',
    top: 190,
    left: 10,
    zIndex: 7,
  },
  cafeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  calendarioSlot: {
    position: 'absolute',
    bottom: 25,
    left: 70,
    zIndex: 4,
  },
  calendarioCard: {
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    width: 170,
    transform: [{ rotate: '3deg' }],
  },
  calendarioHeader: {
    alignItems: 'center',
    marginBottom: 6,
  },
  calendarioHeaderPill: {
    backgroundColor: '#FE4141',
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  calendarioGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calendarioDay: {
    alignItems: 'center',
    padding: 2,
  },
  calendarioDayActive: {
    backgroundColor: '#F1C321',
    borderRadius: 4,
  },
  calendarioDayLabel: {
    fontSize: 7.5,
    color: '#707070',
    fontWeight: '700',
  },
  calendarioDayNum: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  calendarioDayNumActive: {
    color: '#1F1F1F',
  },
  calendarioDica: {
    fontSize: 8.5,
    color: '#555555',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  migalhaSlot: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    zIndex: 8,
    alignItems: 'center',
  },
  speechBubble: {
    position: 'absolute',
    top: -26,
    left: -40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    maxWidth: 150,
  },
  speechText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 14,
    color: '#1F1F1F',
    textAlign: 'center',
    lineHeight: 16,
  },
  speechArrow: {
    position: 'absolute',
    bottom: -6,
    right: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F1F1F',
  },
});

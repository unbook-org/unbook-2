import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Defs,
  Pattern,
} from 'react-native-svg';
import {
  FONTE_MANUSCRITA,
  MigalhaClass,
  vu,
} from '../../../components/vida-universitaria';

interface ComoFuncionaHeroSectionProps {
  onPressExplore?: () => void;
}

export function ComoFuncionaHeroSection({
  onPressExplore,
}: ComoFuncionaHeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  return (
    <View style={styles.sectionWrapper}>
      {/* Textura de parede de tijolinhos aparentes da UnB (PAT/ICC) */}
      <View style={styles.brickBackground} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id="unbBrickPattern" width={72} height={28} patternUnits="userSpaceOnUse">
              <Rect width={72} height={28} fill="#7A3626" />
              <Rect x="1" y="1" width="34" height="12" fill="#8E412E" rx="1" />
              <Rect x="37" y="1" width="34" height="12" fill="#9C4733" rx="1" />
              <Rect x="-17" y="15" width="34" height="12" fill="#843B29" rx="1" />
              <Rect x="19" y="15" width="34" height="12" fill="#924330" rx="1" />
              <Rect x="55" y="15" width="34" height="12" fill="#883D2B" rx="1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#unbBrickPattern)" />
          <Rect width="100%" height="100%" fill="#1F1F1F" opacity={0.32} />
        </Svg>
      </View>

      <View style={styles.mainContainer}>
        {/* ============================================================== */}
        {/* ÁREA DA SALA DE AULA: LOUSA GRANDE ATRÁS DA MESA E DO POMBO    */}
        {/* ============================================================== */}
        <View style={styles.stageContainer}>
          {/* ============================================================ */}
          {/* 1. O GRANDE QUADRO VERDE DE LOUSA (TAMANHO ORIGINAL / AMPLO) */}
          {/* ============================================================ */}
          <View style={styles.blackboardFrame} {...vu('board-enter')}>
            {/* Parafusos nos quatro cantos da moldura */}
            <View style={[styles.cornerScrew, styles.screwTL]} />
            <View style={[styles.cornerScrew, styles.screwTR]} />
            <View style={[styles.cornerScrew, styles.screwBL]} />
            <View style={[styles.cornerScrew, styles.screwBR]} />

            {/* Superfície Verde Escolar da Lousa */}
            <View style={styles.blackboardSurface}>
              {/* Manchas sutis de apagador e pó de giz */}
              <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
                <Path
                  d="M 30 50 Q 280 30 560 60 Q 820 80 1080 40"
                  stroke="#FFFFFF"
                  strokeWidth="28"
                  strokeLinecap="round"
                  opacity={0.04}
                  fill="none"
                />
                <Path
                  d="M 60 140 Q 360 160 700 130 Q 920 120 1100 150"
                  stroke="#FFFFFF"
                  strokeWidth="34"
                  strokeLinecap="round"
                  opacity={0.035}
                  fill="none"
                />
              </Svg>

              {/* Tag superior de giz */}
              <View style={styles.chalkHeader}>
                <View style={styles.chalkBadge}>
                  <Text style={styles.chalkBadgeText}>
                    AULA MAGNA • ARQUITETURA DO SISTEMA
                  </Text>
                </View>

                {/* Título de Giz */}
                <Text style={styles.chalkTitle}>
                  Como o UnBook funciona{'\n'}
                  <Text style={styles.chalkTitleHighlight}>
                    por trás das telas?
                  </Text>
                </Text>

                <Text style={styles.chalkHandwriting}>
                  O que está nesta lousa não cai na prova, mas salva o seu semestre!
                </Text>
              </View>

              {/* Rabiscos de giz nos cantos da lousa */}
              <View style={styles.chalkDoodlesRow} pointerEvents="none">
                <Text style={styles.chalkDoodleText}>
                  f(matrícula) = sem_estresse
                </Text>
                <Text style={styles.chalkDoodleTextCenter}>
                  lim(perrengue → 0) = UnBook
                </Text>
                <Text style={styles.chalkDoodleTextRight}>
                  100% Código Aberto • Sem fins comerciais
                </Text>
              </View>

              {/* Calha de giz (Chalk shelf) com pedaços de giz e apagador */}
              <View style={styles.chalkTray}>
                <View style={styles.chalkPieces}>
                  <View style={[styles.chalkStick, { backgroundColor: '#FFFFFF', width: 28 }]} />
                  <View style={[styles.chalkStick, { backgroundColor: '#FDF0A6', width: 22 }]} />
                  <View style={[styles.chalkStick, { backgroundColor: '#92B7FE', width: 34 }]} />
                  <View style={[styles.chalkStick, { backgroundColor: '#FFB8B8', width: 18 }]} />
                </View>

                {/* Apagador clássico de madeira com feltro */}
                <View style={styles.eraserBlock}>
                  <View style={styles.eraserWood} />
                  <View style={styles.eraserFelt} />
                </View>
              </View>
            </View>
          </View>

          {/* ============================================================ */}
          {/* 2. CANTO DIREITO INFERIOR: MIGALHA COLORIDO E MESA NA FRENTE */}
          {/* ============================================================ */}
          <View
            style={[styles.teacherForegroundStation, isMobile && styles.teacherStationMobile]}
            {...vu('migalha-enter')}
          >
            {/* Mascote Migalha Colorido (SVG oficializado com cores do UnBook) */}
            <View style={styles.migalhaWrapper}>
              <MigalhaClass
                width={isMobile ? 200 : 275}
                style={styles.migalhaSvg}
              />
            </View>

            {/* Mesa Grande do Professor no Canto Direito */}
            <View style={styles.largeTeacherDesk}>
              {/* Tampo grosso de madeira com provas e café */}
              <View style={styles.deskTableTop}>
                {/* Pilha de provas corrigidas com carimbo SS */}
                <View style={styles.examPile}>
                  <View style={[styles.examPaper, { top: 0, left: 0 }]} />
                  <View style={[styles.examPaper, { top: -3, left: 3 }]} />
                  <View style={[styles.examPaper, { top: -6, left: -2 }]}>
                    <Text style={styles.gradeStamp}>SS</Text>
                  </View>
                </View>

                {/* Caixa de giz sobre a mesa */}
                <View style={styles.chalkBoxOnDesk}>
                  <View style={styles.chalkMiniWhite} />
                  <View style={styles.chalkMiniYellow} />
                  <View style={styles.chalkMiniBlue} />
                </View>

                {/* Caneca oficial da UnB com café quente e fumacinha */}
                <View style={styles.unbMug}>
                  <View style={styles.mugHandle} />
                  <Text style={styles.unbMugText}>UnB</Text>
                  <View style={styles.steamContainer} pointerEvents="none">
                    <Svg width={14} height={10} viewBox="0 0 14 10">
                      <Path d="M 4 8 Q 2 4 5 1 M 9 9 Q 12 5 8 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.65} />
                    </Svg>
                  </View>
                </View>
              </View>

              {/* Painel frontal de madeira escura com gaveteiro */}
              <View style={styles.deskFrontPanel}>
                <View style={styles.deskWoodGrain} />
                <View style={styles.deskDrawerRow}>
                  <View style={styles.drawerHandle} />
                  <View style={styles.drawerHandle} />
                </View>
              </View>

              {/* Pés tubulares reforçados de aço preto */}
              <View style={styles.deskLegsRow}>
                <View style={styles.deskLegColumn} />
                <View style={styles.deskLegColumn} />
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
    backgroundColor: '#843B29',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 36,
    paddingBottom: 28,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  brickBackground: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  mainContainer: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: 20,
    zIndex: 3,
    position: 'relative',
  },

  /* Contêiner de camadas do palco */
  stageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },

  /* Moldura de madeira maciça da Lousa Escolar (Tamanho amplo e original) */
  blackboardFrame: {
    width: '100%',
    height: "500px",
    backgroundColor: '#6A4123',
    borderRadius: 14,
    borderWidth: 3.5,
    borderColor: '#1F1F1F',
    padding: 12,
    position: 'relative',
    zIndex: 2,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '8px 8px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cornerScrew: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5DFC5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    zIndex: 10,
  },
  screwTL: { top: 6, left: 6 },
  screwTR: { top: 6, right: 6 },
  screwBL: { bottom: 6, left: 6 },
  screwBR: { bottom: 6, right: 6 },

  /* Superfície da Lousa Verde Escolar */
  blackboardSurface: {
    backgroundColor: '#1C4634',
    borderRadius: 8,
    borderWidth: 2,
    height: "100%",
    borderColor: '#123023',
    paddingVertical: 38,
    paddingHorizontal: 36,
    justifyContent: 'space-around',
    position: 'relative',
    overflow: 'hidden',
  },
  chalkHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chalkBadge: {
    borderWidth: 1.5,
    borderColor: 'rgba(253, 240, 166, 0.85)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
    backgroundColor: 'rgba(28, 70, 52, 0.8)',
  },
  chalkBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FDF0A6',
    letterSpacing: 1.2,
  },
  chalkTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.6,
    marginBottom: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  chalkTitleHighlight: {
    color: '#FDF0A6',
    textShadowColor: 'rgba(253, 240, 166, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  chalkDescription: {
    fontSize: 15.5,
    color: '#FAF9F5',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 720,
    marginBottom: 12,
    opacity: 0.95,
  },
  chalkHandwriting: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 24,
    color: '#FDF0A6',
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 440,
    opacity: 0.9,
  },

  /* Rabiscos de giz nos cantos da lousa */
  chalkDoodlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    paddingTop: 12,
    marginTop: 18,
    flexWrap: 'wrap',
    gap: 8,
  },
  chalkDoodleText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 15,
    color: 'rgba(253, 240, 166, 0.8)',
  },
  chalkDoodleTextCenter: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  chalkDoodleTextRight: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },

  /* Calha de giz */
  chalkTray: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#3D2513',
    borderTopWidth: 2,
    borderTopColor: '#1F1F1F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  chalkPieces: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  chalkStick: {
    height: 6,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  eraserBlock: {
    flexDirection: 'column',
    width: 38,
    height: 12,
    transform: [{ rotate: '-3deg' }],
  },
  eraserWood: {
    height: 7,
    backgroundColor: '#8B5A2B',
    borderRadius: 1,
  },
  eraserFelt: {
    height: 5,
    backgroundColor: '#EBE5D8',
    borderRadius: 1,
  },

  /* Estação do Professor no Canto Direito (Na frente do quadro) */
  teacherForegroundStation: {
    position: 'absolute',
    right: -10, // Empurrado bem para a direita conforme solicitado
    bottom: -15,
    width: 320,
    alignItems: 'center',
    zIndex: 8, // Fica sobreposta e na frente do quadro verde
  },
  teacherStationMobile: {
    position: 'relative',
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    marginTop: -20,
    zIndex: 8,
  },

  /* Migalha Colorido */
  migalhaWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -16,
    zIndex: 4,
  },
  migalhaSvg: {
    ...(Platform.OS === 'web'
      ? ({
          filter: 'drop-shadow(4px 4px 0px #1F1F1F)',
        } as any)
      : {}),
  },

  /* Mesa Grande do Professor no Canto Direito */
  largeTeacherDesk: {
    width: '100%',
    zIndex: 5,
    marginBottom: 10,
  },
  deskTableTop: {
    height: 34,
    backgroundColor: '#D4A373',
    borderWidth: 3,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
        } as any)
      : {}),
    position: 'relative',
    overflow: 'visible',
  },
  examPile: {
    position: 'relative',
    width: 32,
    height: 22,
    marginTop: -8,
  },
  examPaper: {
    position: 'absolute',
    width: 28,
    height: 18,
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeStamp: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FE4141',
  },
  chalkBoxOnDesk: {
    flexDirection: 'row',
    gap: 3,
    backgroundColor: '#5A3D28',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#1F1F1F',
  },
  chalkMiniWhite: { width: 5, height: 10, backgroundColor: '#FFFFFF', borderRadius: 1 },
  chalkMiniYellow: { width: 5, height: 10, backgroundColor: '#FDF0A6', borderRadius: 1 },
  chalkMiniBlue: { width: 5, height: 10, backgroundColor: '#92B7FE', borderRadius: 1 },

  unbMug: {
    width: 20,
    height: 20,
    backgroundColor: '#FE4141',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -10,
  },
  mugHandle: {
    position: 'absolute',
    right: -6,
    top: 3,
    width: 6,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderLeftWidth: 0,
    borderRadius: 3,
  },
  unbMugText: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  steamContainer: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },

  /* Painel frontal de madeira da mesa */
  deskFrontPanel: {
    height: 38,
    backgroundColor: '#A8794E',
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  deskWoodGrain: {
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 6,
  },
  deskDrawerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  drawerHandle: {
    width: 32,
    height: 5,
    backgroundColor: '#D1CDBC',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 2,
  },

  /* Pés da mesa */
  deskLegsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  deskLegColumn: {
    width: 8,
    height: 44,
    backgroundColor: '#1F1F1F',
  },
});

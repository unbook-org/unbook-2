import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../constants/theme';
import { FeaturesTornPaper } from '../../../components/FeaturesTornPaper';
import { getTransitionHeight } from '../../../components/HeroTornPaper';
import { useInView } from '../../../hooks/useInView';
import { CubeTransition } from '../../../components/CubeTransition';

// Ícone vetorial de Livro Aberto (usado em Catálogo e Avaliações)
function BookOpenIcon({
  size = 22,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Ícone vetorial de Estrela (usado em Salve as Turmas)
function StarIcon({
  size = 22,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Ícone vetorial de Calendário (usado em Monte seu Horário)
function CalendarIcon({
  size = 22,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 2v4M8 2v4M3 10h18"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Ícone vetorial de seta apontando para baixo
function ArrowDownIcon({
  size = 13,
  color = '#1F1F1F',
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4v13M18 11l-6 6-6-6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface FeatureItem {
  id: string;
  icon: (size: number, color?: string) => React.ReactNode;
  iconBgColor: string;
  title: string;
  description: string;
  badge: string;
  extendedTitle: string;
  longDescription: string;
  actionText: string;
  highlights: string[];
}

interface FeatureCardProps {
  feature: FeatureItem;
  isMobile: boolean;
  isTablet: boolean;
  index: number;
  isVisible: boolean;
  onPress: () => void;
}

// Cards em formato original: fundo branco, borda neo-brutalista escura e ícone colorido
function FeatureCard({
  feature,
  isMobile,
  isTablet,
  index,
  isVisible,
  onPress,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tiltDeg = index % 2 === 0 ? -1 : 1;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ativar funcionalidade ${feature.title}`}
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.card,
        isMobile && styles.cardMobile,
        isTablet && styles.cardTablet,
        isHovered && {
          transform: [
            { translateY: -8 },
            { rotate: `${tiltDeg}deg` },
            { scale: 1.025 },
          ],
          boxShadow: '8px 8px 0px #1F1F1F',
        },
        pressed && {
          transform: [{ translateY: 2 }, { scale: 0.98 }],
          boxShadow: '1px 1px 0px #1F1F1F',
        },
        isVisible &&
          Platform.OS === 'web' &&
          ({
            animation: `cartoonPopIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) ${
              index * 110
            }ms both`,
          } as any),
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: feature.iconBgColor },
          isMobile && styles.iconContainerMobile,
          isHovered && styles.iconContainerHovered,
        ]}
      >
        {feature.icon(isMobile ? 22 : 24, feature.id === 'horario' ? '#1F1F1F' : '#FFFFFF')}
      </View>
      <Text style={[styles.cardTitle, isMobile && styles.cardTitleMobile]}>
        {feature.title}
      </Text>
      <Text
        style={[
          styles.cardDescription,
          isMobile && styles.cardDescriptionMobile,
        ]}
      >
        {feature.description}
      </Text>

      <View style={styles.cardClickHint}>
        <Text style={styles.cardClickHintText}>Clique para ver detalhes ↗</Text>
      </View>
    </Pressable>
  );
}

export interface FeaturesSectionProps {
  isPageReady?: boolean;
}

export function FeaturesSection({ isPageReady }: FeaturesSectionProps = {}) {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.05 });

  // Cor ativa de fundo da seção (muda para a cor do card quando ativado)
  const [activeColor, setActiveColor] = useState<string>('#009A5E');
  // Funcionalidade ativa (ao ser clicada, oculta os outros cards e exibe o conteúdo dela sem o card branco)
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  // Animação do papel rasgando (Animated API — funciona de verdade no RN Web)
  // 0 = folha inteira contínua ao Hero | 1 = parte de baixo arrancada e fora da tela
  const [tearAnim] = useState(() => new Animated.Value(0));
  const [isTornDone, setIsTornDone] = useState(false);
  const hasStartedTearRef = useRef(false);
  const [overlayHeight, setOverlayHeight] = useState(920);

  const [backBtnHovered, setBackBtnHovered] = useState(false);
  const [ctaBtnHovered, setCtaBtnHovered] = useState(false);

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const transitionHeight = getTransitionHeight(width);
  const transitionMarginTop = -transitionHeight;

  // O rasgo de papel da esquerda para a direita dispara quando a seção entra em visão na tela
  useEffect(() => {
    if (!isVisible || hasStartedTearRef.current) return;
    hasStartedTearRef.current = true;

    const anim = Animated.sequence([
      // Breve pausa para mostrar as duas metades perfeitamente encaixadas como uma folha contínua
      Animated.delay(320),
      // Fase 1: O rasgo inicia na ponta esquerda e rasga até o meio (lado esquerdo cai inclinado)
      Animated.timing(tearAnim, {
        toValue: 0.45,
        duration: 700,
        easing: Easing.bezier(0.35, 0, 0.25, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
      // Fase 2: O corte atinge a ponta direita e desencaixa por completo
      Animated.timing(tearAnim, {
        toValue: 0.65,
        duration: 380,
        easing: Easing.in(Easing.quad),
        useNativeDriver: Platform.OS !== 'web',
      }),
      // Fase 3: A folha descolada despenca livremente e flutua para fora da tela
      Animated.timing(tearAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]);
    anim.start(({ finished }) => {
      if (finished) setIsTornDone(true);
    });
    return () => anim.stop();
  }, [isVisible, tearAnim]);

  // Interpolações do rasgo da esquerda para a direita:
  // Com o pivô fixo no topo direito (transformOrigin: 'top right'), a rotação positiva faz
  // a ponta esquerda cair imediatamente enquanto a direita segura no alto, simulando o rasgo autêntico!
  const tearTranslateY = tearAnim.interpolate({
    inputRange: [0, 0.15, 0.45, 0.65, 1],
    outputRange: [
      0,
      12,
      75,
      Math.round(overlayHeight * 0.45),
      Math.max(overlayHeight * 1.35, 1250),
    ],
  });
  const tearTranslateX = tearAnim.interpolate({
    inputRange: [0, 0.45, 0.65, 1],
    outputRange: [0, 10, 32, 75],
  });
  const tearRotate = tearAnim.interpolate({
    inputRange: [0, 0.15, 0.45, 0.65, 0.85, 1],
    outputRange: ['0deg', '4deg', '16deg', '19deg', '14deg', '10deg'],
  });
  const tearOpacity = tearAnim.interpolate({
    inputRange: [0, 0.65, 0.85, 1],
    outputRange: [1, 1, 0.65, 0],
  });
  const features: FeatureItem[] = [
    {
      id: 'catalogo',
      icon: (s, c) => <BookOpenIcon size={s} color={c} />,
      iconBgColor: '#009A5E', // Verde UnB
      title: 'Explore o Catálogo',
      description:
        'Navegue por cursos e veja avaliações reais de professores no UnBook. Tome decisões baseadas em dados de quem já passou por lá.',
      badge: 'CATÁLOGO SIGAA UNB',
      extendedTitle: 'Catálogo Completo da Universidade de Brasília',
      longDescription:
        'Acesso unificado a todas as disciplinas ofertadas nos quatro campi da UnB (Darcy Ribeiro, Gama, Planaltina e Ceilândia). Consulte pré-requisitos, ementas completas, número de créditos e departamentos sem enfrentar a lentidão dos portais acadêmicos tradicionais.',
      actionText: 'EXPLORAR DISCIPLINAS NO CATÁLOGO ↓',
      highlights: [
        'Mais de 11.000 disciplinas cadastradas e sincronizadas semestralmente',
        'Busca instantânea por código de matéria (ex: MAT0025, CIC0004, FGA0160)',
        'Ementas oficiais e histórico das turmas por semestre',
      ],
    },
    {
      id: 'avaliacoes',
      icon: (s, c) => <BookOpenIcon size={s} color={c} />,
      iconBgColor: '#1349EB', // Azul vibrante
      title: 'Veja as avaliações',
      description:
        'O que os alunos realmente acham — metodologia, provas, didática, frequência.',
      badge: 'OPINIÕES DA COMUNIDADE',
      extendedTitle: 'Avaliações Reais e Critérios Pedagógicos',
      longDescription:
        'Descubra a realidade de cada disciplina com a perspectiva de quem já cursou. Avaliações com foco em metodologia didática, nível de cobrança das provas, formato de chamada e suporte do corpo docente.',
      actionText: 'VER AVALIAÇÕES DE PROFESSORES ↓',
      highlights: [
        '100% anônimo: sua matrícula nunca é registrada ou exposta',
        'Métricas transparentes de dificuldade, didática e clareza de notas',
        'Dicas de sobrevivência para listas de exercícios e provas',
      ],
    },
    {
      id: 'turmas',
      icon: (s, c) => <StarIcon size={s} color={c} />,
      iconBgColor: '#FE4141', // Vermelho
      title: 'Salve as Turmas',
      description:
        'Adicione turmas específicas com nomes de professores e créditos à sua caixa de matérias. Organize suas opções antes de montar o grid.',
      badge: 'PLANEJAMENTO PRÉ-MATRÍCULA',
      extendedTitle: 'Caixa Pessoal de Disciplinas e Turmas',
      longDescription:
        'Guarde as matérias e professores prioritários em uma caixa dedicada de turmas. Monte planos alternativos caso a turma que você queria fique sem vagas durante o período de matrícula no SIGAA.',
      actionText: 'MONTAR MINHA CAIXA DE TURMAS ↓',
      highlights: [
        'Separe opções de turmas matutinas, vespertinas e noturnas',
        'Compare horários e créditos totais pretendidos no semestre',
        'Tenha sempre um plano B pronto antes da abertura das vagas',
      ],
    },
    {
      id: 'horario',
      icon: (s, c) => <CalendarIcon size={s} color={c ?? '#1F1F1F'} />,
      iconBgColor: '#F1C321', // Amarelo
      title: 'Monte seu Horário',
      description:
        'Sua grade semanal é montada automaticamente conforme você escolhe suas turmas. Visualize choques de horário instantaneamente.',
      badge: 'SIMULADOR DE GRADE UNB',
      extendedTitle: 'Simulador Visual de Horários Semanais',
      longDescription:
        'Monte sua grade semestral de forma visual e intuitiva. O simulador analisa suas escolhas e avisa imediatamente se houver choque de horário entre disciplinas antes da confirmação da matrícula.',
      actionText: 'SIMULAR GRADE DE HORÁRIOS ↓',
      highlights: [
        'Detecção instantânea de choques de horário e janelas vagas',
        'Visualização em tabela organizada de segunda a sábado',
        'Exportação rápida da grade para não se perder na semana de aulas',
      ],
    },
  ];

  // Ativação da feat: os outros cards somem, o fundo da tela assume a cor dela
  // e o conteúdo aparece com fundo transparente e elementos em branco puro!
  const handleSelectFeature = (feat: FeatureItem) => {
    setActiveColor(feat.id === 'horario' ? '#B45309' : feat.iconBgColor);
    setSelectedFeature(feat);
  };

  const handleBackToAllFeatures = () => {
    setSelectedFeature(null);
    setActiveColor('#009A5E');
  };

  const handleScrollToSearch = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const searchElement = document.getElementById('search-section');
      if (searchElement) {
        searchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <View
      ref={sectionRef}
      nativeID="features-section"
      // @ts-ignore - ID para ancoragem suave na web
      id="features-section"
      style={[styles.container, { marginTop: transitionMarginTop }]}
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        if (h > 150 && Math.abs(h - overlayHeight) > 10) {
          setOverlayHeight(h);
        }
      }}
    >
      {/* Papel do caderno rasgando da esquerda para a direita e caindo */}
      {!isTornDone && (
        <Animated.View
          nativeID="paper-tear-overlay"
          // @ts-ignore
          id="paper-tear-overlay"
          style={[
            styles.paperTearOverlay,
            {
              height: overlayHeight,
              opacity: tearOpacity,
              transform: [
                { translateY: tearTranslateY },
                { translateX: tearTranslateX },
                { rotate: tearRotate },
              ],
            },
            Platform.OS === 'web' && ({
              transformOrigin: 'top right',
              WebkitTransformOrigin: 'top right',
            } as any),
          ]}
          pointerEvents="none"
        >
          <FeaturesTornPaper
            height={overlayHeight}
            transitionHeight={transitionHeight}
            hasTornBorder={false}
            hasShadow={false}
          />
        </Animated.View>
      )}

      <View
        style={[
          styles.section,
          { backgroundColor: activeColor },
          isMobile && styles.sectionMobile,
          isTablet && styles.sectionTablet,
          { paddingTop: transitionHeight + (isMobile ? 36 : 64) },
        ]}
      >
        {/* ========================================================================= */}
        {/* CABEÇALHO DA SEÇÃO (TÍTULO E DESCRIÇÃO: SÓ APARECEM SE NENHUM CARD ATIVADO) */}
        {/* AO CLICAR EM UM CARD, TITLE E DESCRIPTION SOMEM E SOBRAM APENAS OS ELEMENTOS */}
        {/* ========================================================================= */}
        {!selectedFeature && (
          <View style={styles.sectionHeaderWrapper}>
            {/* Tag da seção com seta para rolar até a grade de recursos */}
            <View style={styles.topTagRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ver recursos do UnBook"
                onPress={() => {
                  if (Platform.OS === 'web' && typeof document !== 'undefined') {
                    const cardsEl = document.getElementById('features-cards-grid');
                    if (cardsEl) {
                      cardsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }
                }}
                style={({ pressed }) => [
                  styles.badgePill,
                  isMobile && styles.badgePillMobile,
                  pressed && styles.badgePillPressed,
                ]}
              >
                <View style={styles.badgePillContent}>
                  <Text style={styles.badgePillText}>POR QUE USAR O UNBOOK?</Text>
                  <ArrowDownIcon size={12} color="#1F1F1F" />
                </View>
              </Pressable>
            </View>

            {/* Título Principal sempre branco */}
            <Text
              style={[
                styles.sectionTitle,
                isMobile && styles.sectionTitleMobile,
                isTablet && styles.sectionTitleTablet,
              ]}
            >
              {isMobile
                ? 'Tudo que você precisa, num só lugar.'
                : 'Tudo que você precisa,\nnum só lugar.'}
            </Text>

            {/* Subtítulo sempre branco */}
            <Text
              style={[
                styles.sectionSubtitle,
                isMobile && styles.sectionSubtitleMobile,
              ]}
            >
              O UnBook oferece um catálogo abrangente, avaliações detalhadas e planejamento de grade eficiente. Clique em qualquer card abaixo para ver o recurso.
            </Text>
          </View>
        )}

        {/* ========================================================================= */}
        {/* CENÁRIO 1: CARDS BRANCOS EM GRADE (QUANDO NENHUM ESTÁ ATIVADO) */}
        {/* ========================================================================= */}
        {!selectedFeature && (
          <View
            nativeID="features-cards-grid"
            // @ts-ignore
            id="features-cards-grid"
            style={[
              styles.grid,
              isMobile && styles.gridMobile,
              isTablet && styles.gridTablet,
            ]}
          >
            {features.map((feature, idx) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isMobile={isMobile}
                isTablet={isTablet}
                index={idx}
                isVisible={isVisible}
                onPress={() => handleSelectFeature(feature)}
              />
            ))}
          </View>
        )}

        {/* ========================================================================= */}
        {/* CENÁRIO 2: CARD ATIVADO -> OS OUTROS CARDS SOMEM, SEM ESSE CARD BRANCO! */}
        {/* O CONTEÚDO FICA COM FUNDO TRANSPARENTE E ELEMENTOS NA COR BRANCA! */}
        {/* ========================================================================= */}
        {selectedFeature && (
          <View style={[styles.activeFeatureWrapper, isMobile && styles.activeFeatureWrapperMobile]}>
            {/* Barra Superior: Botão Voltar + Categoria */}
            <View style={styles.activeTopBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar para todas as funcionalidades"
                onPress={handleBackToAllFeatures}
                onHoverIn={() => setBackBtnHovered(true)}
                onHoverOut={() => setBackBtnHovered(false)}
                style={({ pressed }) => [
                  styles.activeBackButton,
                  backBtnHovered && styles.activeBackButtonHovered,
                  pressed && styles.activeBackButtonPressed,
                ]}
              >
                <Text style={styles.activeBackButtonText}>← VOLTAR PARA TODAS AS FUNCIONALIDADES</Text>
              </Pressable>

              <View style={styles.activeBadgePill}>
                <Text style={styles.activeBadgePillText}>{selectedFeature.badge}</Text>
              </View>
            </View>

            {/* Conteúdo Ativo Transparente (Sem caixa de card branca!) */}
            <View style={styles.activeContentContainer}>
              {/* Linha com Ícone e Título da Feat */}
              <View style={[styles.activeHeaderRow, isMobile && styles.activeHeaderRowMobile]}>
                <View style={styles.activeIconCircle}>
                  {selectedFeature.icon(34, '#FFFFFF')}
                </View>

                <View style={styles.activeHeaderTexts}>
                  <Text style={[styles.activeMainTitle, isMobile && styles.activeMainTitleMobile]}>
                    {selectedFeature.extendedTitle}
                  </Text>
                  <Text style={styles.activeSubtitle}>
                    {selectedFeature.description}
                  </Text>
                </View>
              </View>

              <View style={styles.activeDividerLine} />

              {/* Explicação Profunda */}
              <Text style={styles.activeLongText}>
                {selectedFeature.longDescription}
              </Text>

              {/* Diferenciais Transparentes com Borda Branca e Marcadores */}
              <Text style={styles.activeHighlightsHeading}>DIFERENCIAIS PARA OS ALUNOS DA UNB:</Text>
              <View style={[styles.activeHighlightsRow, isMobile && styles.activeHighlightsRowMobile]}>
                {selectedFeature.highlights.map((item, i) => (
                  <View key={i} style={styles.activeHighlightBox}>
                    <View style={styles.activeCheckCircle}>
                      <Text style={styles.activeCheckmark}>✓</Text>
                    </View>
                    <Text style={styles.activeHighlightText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Botão de Ação Direta para Navegar */}
              <View style={styles.activeActionRow}>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleScrollToSearch}
                  onHoverIn={() => setCtaBtnHovered(true)}
                  onHoverOut={() => setCtaBtnHovered(false)}
                  style={({ pressed }) => [
                    styles.activeCtaBtn,
                    ctaBtnHovered && styles.activeCtaBtnHovered,
                    pressed && styles.activeCtaBtnPressed,
                  ]}
                >
                  <Text style={styles.activeCtaBtnText}>
                    {selectedFeature.actionText}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Transição quadriculada em cubos (pixel dither) ligando Features -> Search */}
      <CubeTransition
        color={activeColor}
        targetBgColor="#FFFFFF"
        direction="down"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'visible',
    zIndex: 10,
  },
  transitionContainer: {
    width: '100%',
    zIndex: 15,
    overflow: 'visible',
    marginBottom: -2,
  },
  section: {
    paddingHorizontal: 32,
    paddingBottom: 72,
    paddingTop: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 880,
    marginTop: -1,
    width: '100%',
    position: 'relative',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'background-color 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        } as any)
      : {}),
  },
  sectionMobile: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 52,
    paddingTop: theme.spacing.xs,
    minHeight: 1040,
  },
  sectionTablet: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
    minHeight: 940,
  },
  sectionHeaderWrapper: {
    width: '100%',
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          animation: 'featDetailEnter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        } as any)
      : {}),
  },
  topTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  badgePillPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(1.5px, 1.5px)',
          boxShadow: '0.5px 0.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  badgePillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgePillMobile: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePillText: {
    color: '#1F1F1F',
    fontWeight: theme.typography.fontWeights.bold,
    fontSize: theme.typography.fontSizes.xs,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 38,
    lineHeight: 46,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    letterSpacing: -0.5,
  },
  sectionTitleTablet: {
    fontSize: 32,
    lineHeight: 38,
  },
  sectionTitleMobile: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 760,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: theme.spacing.xxxl,
  },
  sectionSubtitleMobile: {
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xl,
  },

  // =========================================================================
  // CARDS ORIGINAIS: FUNDO BRANCO, BORDA ESCURA E SOMBRA NEO-BRUTALISTA
  // =========================================================================
  grid: {
    width: '100%',
    maxWidth: 1440,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  gridTablet: {
    maxWidth: 900,
    gap: 20,
  },
  gridMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
    maxWidth: 480,
  },
  card: {
    backgroundColor: '#FFFFFF', // Fundo branco original mantido!
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: theme.spacing.lg,
    flex: 1,
    minWidth: 260,
    maxWidth: 340,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  cardTablet: {
    maxWidth: '47%',
  },
  cardMobile: {
    width: '100%',
    maxWidth: '100%',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          transition: 'transform 0.15s ease',
        } as any)
      : {}),
  },
  iconContainerMobile: {
    width: 44,
    height: 44,
  },
  iconContainerHovered: {
    transform: [{ scale: 1.08 }, { rotate: '-4deg' }],
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.bold,
    color: '#1F1F1F',
    marginBottom: theme.spacing.xs,
  },
  cardTitleMobile: {
    fontSize: theme.typography.fontSizes.md,
  },
  cardDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: '#4B5563',
    lineHeight: 20,
    flex: 1,
    marginBottom: 12,
  },
  cardDescriptionMobile: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardClickHint: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 8,
  },
  cardClickHintText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1349EB',
    letterSpacing: 0.5,
  },

  // =========================================================================
  // ATIVAÇÃO DA FEAT: SEM ESSE CARD BRANCO!
  // FUNDO TRANSPARENTE E ELEMENTOS NA COR BRANCA!
  // =========================================================================
  activeFeatureWrapper: {
    width: '100%',
    maxWidth: 1360,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          animation: 'featDetailEnter 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        } as any)
      : {}),
  },
  activeFeatureWrapperMobile: {
    width: '100%',
  },
  activeTopBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  activeBackButton: {
    backgroundColor: '#FFFFFF', // Botão branco fácil de ler
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        } as any)
      : {}),
  },
  activeBackButtonHovered: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-2px)',
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  activeBackButtonPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px)',
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  activeBackButtonText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.8,
  },
  activeBadgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)',
        } as any)
      : {}),
  },
  activeBadgePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },

  // Conteúdo ativo sem caixa de card branco: flutua diretamente no fundo colorido!
  activeContentContainer: {
    width: '100%',
    backgroundColor: 'transparent', // SEM FUNDO BRANCO!
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  activeHeaderRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 14,
  },
  activeIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.3)',
        } as any)
      : {}),
  },
  activeHeaderTexts: {
    flex: 1,
  },
  activeMainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF', // Cor branca pura
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  activeMainTitleMobile: {
    fontSize: 24,
  },
  activeSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    fontWeight: '600',
  },
  activeDividerLine: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    marginVertical: 24,
    width: '100%',
  },
  activeLongText: {
    fontSize: 17,
    lineHeight: 28,
    color: '#FFFFFF', // Cor branca pura
    marginBottom: 28,
  },
  activeHighlightsHeading: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 16,
  },
  activeHighlightsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  activeHighlightsRowMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  activeHighlightBox: {
    flex: 1,
    minWidth: 260,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Fundo transparente
    borderWidth: 2,
    borderColor: '#FFFFFF', // Borda branca
    borderRadius: 4,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.25)',
        } as any)
      : {}),
  },
  activeCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  activeCheckmark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activeHighlightText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF', // Cor branca pura
    lineHeight: 21,
    flex: 1,
  },
  activeActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    paddingTop: 24,
  },
  activeCtaBtn: {
    backgroundColor: '#FFFFFF', // Botão branco de destaque
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingVertical: 14,
    paddingHorizontal: 30,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        } as any)
      : {}),
  },
  activeCtaBtnHovered: {
    backgroundColor: '#F6F6F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-2px)',
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  activeCtaBtnPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px)',
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  activeCtaBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#1F1F1F', // Texto escuro em botão branco
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // =========================================================================
  // PAPEL RASGADO (pedaço que desce suavemente ao carregar)
  // =========================================================================
  paperTearOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 30,
    overflow: 'visible',
  },
});

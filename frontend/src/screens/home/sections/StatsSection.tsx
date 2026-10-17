import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  Linking,
  Animated,
  Easing,
} from 'react-native';
import { AnimatedCounter } from '../../../components/AnimatedCounter';
import { CartoonButton } from '../../../components/CartoonButton';
import { useInView } from '../../../hooks/useInView';

interface StatCardProps {
  endNumber: number;
  prefix?: string;
  title: string;
  subtitle: string;
  description: string;
  pillText: string;
  chartTag: string;
  accentColor: string;
  index: number;
  isVisible: boolean;
  targetHeight: number;
  isMobile: boolean;
}

function StatCard({
  endNumber,
  prefix = '',
  title,
  subtitle,
  description,
  pillText,
  chartTag,
  accentColor,
  index,
  isVisible,
  targetHeight,
  isMobile,
}: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tiltDeg = index % 2 === 0 ? -1 : 1;

  // Animação de crescimento da altura do card em formato de gráfico
  // O card começa pequeno (180px) e conforme os números contam até o final,
  // a altura se expande verticalmente para cima até o targetHeight!
  const [heightAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!isVisible) return;

    Animated.timing(heightAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: false,
    }).start();
  }, [isVisible, heightAnim]);

  const minHeight = isMobile ? 220 : 180;
  const finalHeight = isMobile
    ? index === 0
      ? 300
      : index === 1
      ? 340
      : 380
    : targetHeight;

  const animatedHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, finalHeight],
  });

  return (
    <Animated.View
      style={[
        styles.statCardWrapper,
        { height: animatedHeight },
      ]}
    >
      <Pressable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={({ pressed }) => [
          styles.statCard,
          { borderColor: '#000000' },
          isHovered && {
            transform: [
              { translateY: -6 },
              { rotate: `${tiltDeg}deg` },
              { scale: 1.015 },
            ],
            boxShadow: `7px 7px 0px ${accentColor}`,
          },
          pressed && {
            transform: [{ translateY: 2 }, { scale: 0.98 }],
            boxShadow: '2px 2px 0px #000000',
          },
        ]}
      >
        {/* Topo do Card: Tag de Nível do Gráfico & Barra Colorida */}
        <View>
          <View style={styles.chartHeaderRow}>
            <View style={[styles.chartLevelPill, { borderColor: accentColor }]}>
              <Text style={[styles.chartLevelText, { color: accentColor }]}>{chartTag}</Text>
            </View>
            <View style={[styles.chartTopLine, { backgroundColor: accentColor }]} />
          </View>

          {/* Número que cresce dinamicamente com animação */}
          <View style={styles.numberWrapper}>
            <AnimatedCounter
              end={endNumber}
              prefix={prefix}
              trigger={isVisible}
              duration={2200}
              style={[styles.statNumber, { color: accentColor }]}
            />
          </View>

          <Text style={[styles.statTitle, { color: accentColor }]}>{title}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
          <Text style={styles.statDescription}>{description}</Text>
        </View>

        {/* Rodapé do Card com Barra de Progresso e Indicador */}
        <View style={styles.cardFooterArea}>
          {/* Barra visual de preenchimento tipo gráfico */}
          <View style={styles.chartBarTrack}>
            <Animated.View
              style={[
                styles.chartBarFill,
                {
                  backgroundColor: accentColor,
                  width: heightAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['15%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.cardPill}>
            <View style={[styles.greenDot, { backgroundColor: accentColor }]} />
            <Text style={styles.cardPillText}>{pillText}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function StatsSection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const handleOpenSchedule = () => {
    const url = 'https://github.com/unbook-org/unbook-2';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View ref={sectionRef} style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Tag do Topo */}
        <View style={styles.badgeWrapper}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>DADOS TRANSPARENTES AO VIVO DA UNB</Text>
          </View>
        </View>

        {/* Título e Subtítulo */}
        <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
          A UnB em Números Reais e Atualizados.
        </Text>
        <Text style={styles.mainSubtitle}>
          Dados coletados da comunidade discente e sincronizados semestralmente com o catálogo de turmas e departamentos.
        </Text>

        {/* Grade com os 3 Cards em Formato de Gráfico Crescente (Heights: 360px -> 430px -> 500px) */}
        <View
          style={[
            styles.cardsGrid,
            isTablet && styles.cardsGridTablet,
            isMobile && styles.cardsGridMobile,
          ]}
        >
          {/* Card 1 - Departamentos e Unidades (Nível 1 • 360px) */}
          <StatCard
            endNumber={100}
            prefix="+"
            title="departamentos acadêmicos."
            subtitle="Faculdades e institutos da UnB."
            description="De Darcy Ribeiro a Ceilândia, Gama e Planaltina, englobando todas as faculdades e unidades acadêmicas."
            pillText="4 campi integrados (Darcy, FGA, FCE, FUP)"
            chartTag="HISTOGRAMA • NÍVEL 1"
            accentColor="#1349EB" // Azul vibrante da UnB
            index={0}
            isVisible={isVisible}
            targetHeight={360}
            isMobile={isMobile}
          />

          {/* Card 2 - 16.000 Matérias (Nível 2 • 430px) */}
          <StatCard
            endNumber={16000}
            prefix="+"
            title="matérias cadastradas."
            subtitle="Disciplinas dos 4 campi da UnB."
            description="Catálogo completo de disciplinas com histórico semestral de turmas, ementas e orientações discentes."
            pillText="Catálogo sincronizado com SIGAA"
            chartTag="HISTOGRAMA • NÍVEL 2"
            accentColor="#009A5E" // Verde oficial UnB
            index={1}
            isVisible={isVisible}
            targetHeight={430}
            isMobile={isMobile}
          />

          {/* Card 3 - 2.800 Professores (Nível 3 • 500px) */}
          <StatCard
            endNumber={2800}
            prefix="+"
            title="professores ativos."
            subtitle="Docentes avaliados pela comunidade."
            description="Docentes cadastrados nos 4 campi com avaliações sinceras e anônimas sobre metodologia, provas e didática."
            pillText="Comunidade docente avaliada"
            chartTag="HISTOGRAMA • NÍVEL 3 (PICO)"
            accentColor="#FE4141" // Vermelho destaque
            index={2}
            isVisible={isVisible}
            targetHeight={500}
            isMobile={isMobile}
          />
        </View>

        {/* Indicador de última captura */}
        <View style={styles.syncRow}>
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>
            Sincronização contínua com os servidores do SIGAA • Semestre Letivo 2026/1
          </Text>
        </View>

        {/* Card Inferior de Explicação & Cronograma */}
        <View style={[styles.infoBanner, isMobile && styles.infoBannerMobile]}>
          <View style={styles.infoLeft}>
            <Text style={styles.infoTitle}>Quer ver mais dados da sua faculdade?</Text>
            <Text style={styles.infoDescription}>
              Nosso pipeline extrai estatísticas abertas sobre menções, taxas de evasão e aprovação de cada departamento da UnB.
            </Text>
          </View>

          <View style={styles.infoRight}>
            <CartoonButton
              variant="white"
              onPress={handleOpenSchedule}
              style={styles.actionBtn}
            >
              VER CÓDIGO NO GITHUB
            </CartoonButton>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#1F1F1F', // Fundo escuro oficial de dados
    paddingVertical: 84,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1360,
    alignItems: 'center',
  },
  badgeWrapper: {
    marginBottom: 16,
  },
  badgePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #000000',
        } as any)
      : {}),
  },
  badgePillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1.2,
  },
  mainTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  mainTitleMobile: {
    fontSize: 24,
    lineHeight: 30,
  },
  mainSubtitle: {
    fontSize: 15,
    color: '#A3A3A3',
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 22,
    marginBottom: 44,
  },

  // Grade de Gráfico (Alinhamento na base: flex-end para os cards crescerem para cima!)
  cardsGrid: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Alinha na base tipo histograma!
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
    marginBottom: 32,
    paddingTop: 20,
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 4,
  },
  cardsGridTablet: {
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  cardsGridMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 20,
  },
  statCardWrapper: {
    flex: 1,
    minWidth: 260,
  },
  statCard: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 4,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    justifyContent: 'space-between', // Espalha o conteúdo com o crescimento
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #000000',
          cursor: 'pointer',
          transition:
            'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease',
        } as any)
      : {}),
  },

  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartLevelPill: {
    borderWidth: 1.5,
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#FAF9F5',
  },
  chartLevelText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  chartTopLine: {
    height: 3,
    width: 24,
    borderRadius: 2,
  },

  numberWrapper: {
    minHeight: 52,
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1.2,
  },
  statTitle: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  statSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 6,
  },
  statDescription: {
    fontSize: 12.5,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 16,
  },

  cardFooterArea: {
    marginTop: 'auto',
  },
  chartBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  cardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardPillText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F1F1F',
  },

  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  syncText: {
    fontSize: 12.5,
    color: '#A3A3A3',
    fontWeight: '600',
  },

  infoBanner: {
    width: '100%',
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#404040',
    borderRadius: 4,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
  },
  infoBannerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13.5,
    color: '#A3A3A3',
    lineHeight: 20,
  },
  infoRight: {
    flexShrink: 0,
  },
  actionBtn: {
    minWidth: 210,
  },
});

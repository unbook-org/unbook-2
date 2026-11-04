import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ComoColaborarSectionProps {
  onPressDonate?: () => void;
  onPressExplore?: () => void;
  onPressDiscord?: () => void;
}

export function ComoColaborarSection({
  onPressDonate,
  onPressExplore,
  onPressDiscord,
}: ComoColaborarSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  const [hoveredAction, setHoveredAction] = useState<number | null>(null);

  const handleOpenUrl = (url: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  const actions = [
    {
      id: 1,
      icon: '⭐',
      title: 'Avalie uma disciplina ou professor',
      action: () => onPressExplore?.(),
    },
    {
      id: 2,
      icon: '📖',
      title: 'Envie provas e resumos para o repositório',
      action: () =>
        handleOpenUrl('https://github.com/unbook-org/unbook-2/issues'),
    },
    {
      id: 3,
      icon: '💡',
      title: 'Sugira ideias e reporte bugs no nosso Discord',
      action: () =>
        onPressDiscord
          ? onPressDiscord()
          : handleOpenUrl('https://discord.gg/unbook'),
    },
    {
      id: 4,
      icon: '👥',
      title: 'Indique o UnBook nos grupos de WhatsApp da UnB',
      action: () => {
        if (
          Platform.OS === 'web' &&
          typeof navigator !== 'undefined' &&
          navigator.share
        ) {
          navigator
            .share({
              title: 'UnBook - Guia Acadêmico UnB',
              text: 'Conheça o UnBook: avaliações anônimas de professores e montador de grade da UnB!',
              url: window.location.origin,
            })
            .catch(() => {});
        } else {
          handleOpenUrl(
            'https://api.whatsapp.com/send?text=Conhe%C3%A7a%20o%20UnBook%20para%20planejar%20sua%20grade%20da%20UnB%3A%20https%3A%2F%2Funbook.com.br'
          );
        }
      },
    },
  ];

  const techStack = ['React', 'TypeScript', 'Python', 'FastAPI', 'Figma', 'PostgreSQL'];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>COMO COLABORAR</Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          <View style={styles.devCard}>
            <View style={styles.cardHeader}>
              <View style={styles.devIconBox}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M16 18l6-6-6-6M8 6l-6 6 6 6"
                    stroke="#1349EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardMainHeading}>PARA DEVS & DESIGNERS</Text>
                <Text style={styles.cardSubHeading}>Engenharia • UX/UI • Dados</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              Quer <Text style={styles.boldWhite}>ganhar horas de extensão</Text>, enriquecer seu portfólio com código em produção e impactar positivamente milhares de estudantes da UnB? O UnBook é seu projeto.
            </Text>

            <View style={styles.devActionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  handleOpenUrl('https://github.com/unbook-org/unbook-2')
                }
                style={styles.devBtnGithub}
              >
                <Text style={styles.devBtnGithubText}>GITHUB ↗</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  onPressDiscord
                    ? onPressDiscord()
                    : handleOpenUrl('https://discord.gg/unbook')
                }
                style={styles.devBtnDiscord}
              >
                <Text style={styles.devBtnDiscordText}>COMUNIDADE</Text>
              </Pressable>
            </View>

            <View style={styles.techPillsRow}>
              {techStack.map((tech) => (
                <View key={tech} style={styles.techPill}>
                  <Text style={styles.techPillText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.studentCard}>
            <View style={styles.cardHeader}>
              <View style={styles.studentIconBox}>
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    stroke="#009A5E"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View>
                <Text style={styles.cardMainHeading}>PARA TODO ESTUDANTE</Text>
                <Text style={styles.cardSubHeadingGreen}>Não precisa saber programar!</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              Não é da área de TI? Sem problema! Você pode colaborar avaliando professores das suas turmas passadas, compartilhando provas antigas ou sugerindo novas ideias.
            </Text>

            <View style={styles.actionsList}>
              {actions.map((act) => {
                const isHovered = hoveredAction === act.id;
                return (
                  <Pressable
                    key={act.id}
                    onPress={act.action}
                    // @ts-ignore
                    onMouseEnter={() => setHoveredAction(act.id)}
                    // @ts-ignore
                    onMouseLeave={() => setHoveredAction(null)}
                    style={[
                      styles.actionItem,
                      isHovered && styles.actionItemHovered,
                    ]}
                  >
                    <View style={styles.actionItemLeft}>
                      <Text style={styles.actionIcon}>{act.icon}</Text>
                      <Text style={styles.actionItemText}>{act.title}</Text>
                    </View>
                    <Text style={styles.actionArrow}>›</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={[styles.coffeeBanner, isMobile && styles.coffeeBannerMobile]}>
          <View style={styles.coffeeBannerContent}>
            <Text style={styles.coffeeBannerIcon}>☕</Text>
            <View style={styles.coffeeBannerTextWrap}>
              <Text style={styles.coffeeBannerTitle}>APOIE COM UM CAFÉ</Text>
              <Text style={styles.coffeeBannerSubtitle}>
                Infraestrutura, domínio e APIs custam dinheiro real. Todo centavo ajuda a manter a plataforma no ar!
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Doar um café via PIX"
            onPress={onPressDonate}
            style={({ pressed }) => [
              styles.coffeeBannerBtn,
              pressed && styles.coffeeBannerBtnPressed,
            ]}
          >
            <Text style={styles.coffeeBannerBtnText}>☕ DOE UM CAFÉ</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#1F1F1F',
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderTopWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  accentBar: {
    width: 6,
    height: 28,
    backgroundColor: '#F1C321',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardsGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
  cardsGridMobile: {
    flexDirection: 'column',
  },
  devCard: {
    flex: 1,
    backgroundColor: '#232A39',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#39435B',
    padding: 24,
    justifyContent: 'space-between',
  },
  studentCard: {
    flex: 1,
    backgroundColor: '#163124',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#24513B',
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  devIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  studentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  cardMainHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardSubHeading: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  cardSubHeadingGreen: {
    fontSize: 12,
    color: '#68D391',
    marginTop: 2,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    color: '#CBD5E0',
    lineHeight: 20,
    marginBottom: 20,
  },
  boldWhite: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  devActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  devBtnGithub: {
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  devBtnGithubText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  devBtnDiscord: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A7C94',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  devBtnDiscordText: {
    color: '#63B3ED',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  techPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  techPillText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  actionsList: {
    gap: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  actionItemHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: '#009A5E',
  },
  actionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  actionIcon: {
    fontSize: 14,
  },
  actionItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  actionArrow: {
    color: '#A0AEC0',
    fontSize: 18,
    fontWeight: '700',
  },
  coffeeBanner: {
    backgroundColor: '#323620',
    borderWidth: 2.5,
    borderColor: '#F1C321',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  coffeeBannerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 16,
  },
  coffeeBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  coffeeBannerIcon: {
    fontSize: 34,
  },
  coffeeBannerTextWrap: {
    flex: 1,
  },
  coffeeBannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  coffeeBannerSubtitle: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
  },
  coffeeBannerBtn: {
    backgroundColor: '#F1C321',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  coffeeBannerBtnPressed: {
    transform: [{ translateY: 2 }],
    shadowOffset: { width: 1, height: 1 },
  },
  coffeeBannerBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
});


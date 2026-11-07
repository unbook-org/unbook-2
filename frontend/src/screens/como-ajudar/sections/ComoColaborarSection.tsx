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
import { NotebookBackground } from '../../../components/NotebookBackground';

interface ComoColaborarSectionProps {
  onPressExplore?: () => void;
  onPressDiscord?: () => void;
}

export function ComoColaborarSection({
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
      num: '01',
      title: 'Avalie matérias e professores que você já cursou',
      action: () => onPressExplore?.(),
    },
    {
      id: 2,
      num: '02',
      title: 'Compartilhe provas e resumos de semestres anteriores',
      action: () =>
        handleOpenUrl('https://github.com/unbook-org/unbook-2/issues'),
    },
    {
      id: 3,
      num: '03',
      title: 'Sugira novos recursos ou reporte melhorias no Discord',
      action: () =>
        onPressDiscord
          ? onPressDiscord()
          : handleOpenUrl('https://discord.gg/unbook'),
    },
    {
      id: 4,
      num: '04',
      title: 'Apresente o UnBook nos grupos de curso e calouros da UnB',
      action: () => {
        if (
          Platform.OS === 'web' &&
          typeof navigator !== 'undefined' &&
          navigator.share
        ) {
          navigator
            .share({
              title: 'UnBook - Guia Acadêmico da UnB',
              text: 'Conheça o UnBook: avaliações anônimas de disciplinas e catálogo de turmas para a UnB!',
              url: window.location.origin,
            })
            .catch(() => {});
        } else {
          handleOpenUrl(
            'https://api.whatsapp.com/send?text=Conhe%C3%A7a%20o%20UnBook%20para%20consultar%20professores%20e%20disciplinas%20da%20UnB%3A%20https%3A%2F%2Funbook.com.br'
          );
        }
      },
    },
  ];

  const techStack = [
    'React Native',
    'TypeScript',
    'FastAPI',
    'PostgreSQL',
    'Meilisearch',
    'Docker',
  ];

  return (
    <NotebookBackground style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>COMUNIDADE ACADÊMICA</Text>
          </View>
          <Text style={styles.title}>Outras formas de somar ao projeto</Text>
          <Text style={styles.subtitle}>
            Nem todo apoio precisa ser financeiro. O UnBook vive da participação de estudantes de todos os cursos da Universidade de Brasília.
          </Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          {/* Card Esquerdo: Para Devs e Designers */}
          <View style={styles.devCard}>
            <View style={styles.cardHeader}>
              <View style={styles.codeTag}>
                <Text style={styles.codeTagText}>DEV & DESIGN</Text>
              </View>
              <Text style={styles.cardMainHeading}>ENGENHARIA E DESIGN</Text>
              <Text style={styles.cardSubHeading}>Código Aberto • Extensão Universitária</Text>
            </View>

            <Text style={styles.cardDescription}>
              Deseja enriquecer seu portfólio com código em produção e impactar positivamente a vida acadêmica de milhares de colegas? Junte-se ao time discente de desenvolvimento.
            </Text>

            <View style={styles.devActionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir repositório no GitHub"
                onPress={() =>
                  handleOpenUrl('https://github.com/unbook-org/unbook-2')
                }
                style={styles.devBtnGithub}
              >
                <Text style={styles.devBtnGithubText}>REPOSITÓRIO NO GITHUB ↗</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Entrar no servidor do Discord"
                onPress={() =>
                  onPressDiscord
                    ? onPressDiscord()
                    : handleOpenUrl('https://discord.gg/unbook')
                }
                style={styles.devBtnDiscord}
              >
                <Text style={styles.devBtnDiscordText}>DISCORD DA COMUNIDADE ↗</Text>
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

          {/* Card Direito: Para Todo Estudante */}
          <View style={styles.studentCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.codeTag, { backgroundColor: '#009A5E' }]}>
                <Text style={styles.codeTagText}>QUALQUER CURSO</Text>
              </View>
              <Text style={styles.cardMainHeading}>PARA TODO ESTUDANTE</Text>
              <Text style={styles.cardSubHeadingGreen}>
                Não precisa programar para fortalecer o ecossistema!
              </Text>
            </View>

            <Text style={styles.cardDescriptionDark}>
              Você fortalece o UnBook sempre que avalia com sinceridade uma matéria concluída, sugere melhorias ou apresenta a ferramenta para os calouros do seu instituto.
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
                      styles.actionRowCard,
                      isHovered && styles.actionRowCardHovered,
                    ]}
                  >
                    <View style={styles.actionNumBox}>
                      <Text style={styles.actionNumText}>{act.num}</Text>
                    </View>
                    <Text style={styles.actionTitleText}>{act.title}</Text>
                    <Text style={styles.actionArrow}>→</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </NotebookBackground>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 72,
    paddingHorizontal: 24,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    width: '100%',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 44,
    maxWidth: 820,
  },
  badgePill: {
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 14,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 25,
  },
  cardsGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  cardsGridMobile: {
    flexDirection: 'column',
  },
  devCard: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 26,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
        } as any)
      : {}),
  },
  studentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 26,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeader: {
    marginBottom: 16,
  },
  codeTag: {
    backgroundColor: '#1349EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  codeTagText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  cardSubHeading: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '600',
  },
  cardSubHeadingGreen: {
    fontSize: 12,
    color: '#009A5E',
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 13,
    color: '#D0D0D0',
    lineHeight: 20,
    marginBottom: 20,
  },
  cardDescriptionDark: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
    marginBottom: 20,
  },
  devActionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  devBtnGithub: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  devBtnGithubText: {
    color: '#1F1F1F',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  devBtnDiscord: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  devBtnDiscordText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  techPillText: {
    color: '#D8D8D8',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsList: {
    gap: 10,
  },
  actionRowCard: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, background-color 0.15s ease',
        } as any)
      : {}),
  },
  actionRowCardHovered: {
    transform: [{ translateX: 4 }],
    backgroundColor: '#FCFAEC',
  },
  actionNumBox: {
    backgroundColor: '#1F1F1F',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  actionTitleText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  actionArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
  },
});

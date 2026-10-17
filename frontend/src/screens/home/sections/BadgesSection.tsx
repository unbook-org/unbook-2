import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useInView } from '../../../hooks/useInView';

export interface EmojiBadgeData {
  id: string;
  level: number;
  name: string;
  mencao: string;
  bgColor: string;
  description: string;
}

export const BADGES: EmojiBadgeData[] = [
  {
    id: 'so-o-odio',
    level: 1,
    name: 'Só o ódio',
    mencao: 'SR',
    bgColor: '#FF6B6B',
    description: 'Cobrança desmedida, desorganização no SIGAA e provas pesadas. Gera revolta coletiva na turma.',
  },
  {
    id: 'morri-de-paia',
    level: 2,
    name: 'Morri de paia',
    mencao: 'II',
    bgColor: '#FFAAA6',
    description: 'Listas intermináveis, provas cheias de pegadinhas e desespero total antes da menção final.',
  },
  {
    id: 'soninho',
    level: 3,
    name: 'Soninho',
    mencao: 'MI',
    bgColor: '#FFE17D',
    description: 'Aulas teóricas extensas, slides sem fim às 08h e pouca dinâmica. Presença cobrada, mas a turma dorme.',
  },
  {
    id: 'passavel',
    level: 4,
    name: 'Passável',
    mencao: 'MM',
    bgColor: '#FFFFFF',
    description: 'Nem bom nem horrível, dá pra levar. Estudando o básico você garante sua menção sem sustos.',
  },
  {
    id: 'tranquilo',
    level: 5,
    name: 'Tranquilo',
    mencao: 'MS',
    bgColor: '#8CE8C5',
    description: 'Didática boa, prazos justos e sem estresse. Docente acessível, provas condizentes e clima leve.',
  },
  {
    id: 'ss-papai',
    level: 6,
    name: 'SS papai',
    mencao: 'SS',
    bgColor: '#6B8EFF',
    description: 'Didática brilhante, professor inspirador, metodologia prática e alto índice de aprovação com louvor.',
  },
];

export function BadgesSection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1080;
  const [activeBadgeId, setActiveBadgeId] = useState<string | null>(null);

  return (
    <View ref={sectionRef} style={styles.section}>
      <View style={styles.container}>
        {/* Tag Superior Neo-Brutal */}
        <View style={styles.tagWrapper}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>SISTEMA OFICIAL DE BADGES DA UNB</Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
          Avalie como os alunos realmente sentem.
        </Text>

        <Text style={styles.sectionSubtitle}>
          Chega de notas frias de 1 a 5. No UnBook, você sabe o que esperar através de uma escala de sentimentos reais, do desespero de trancamento até o SS garantido.
        </Text>

        {/* DIV PRINCIPAL: ESCALA GRADUADA UNIFICADA COM FUNDO CINZA */}
        <View style={[styles.scaleBoard, isMobile && styles.scaleBoardMobile]}>
          {/* Cabeçalho da Escala */}
          <View style={styles.scaleHeader}>
            <View style={styles.scaleExtremityLeft}>
              <Text style={styles.scaleExtremityLeftText}>
                {isMobile ? '◀ 1/6 • Crítica' : '◀ 1/6 • Risco de Trancamento'}
              </Text>
            </View>

            <View style={styles.scaleCenterPill}>
              <Text style={styles.scaleCenterPillText}>
                ESCALA GRADUADA DE SENTIMENTO DISCENTE
              </Text>
            </View>

            <View style={styles.scaleExtremityRight}>
              <Text style={styles.scaleExtremityRightText}>
                {isMobile ? '6/6 • SS ▶' : '6/6 • SS PAPAI ▶'}
              </Text>
            </View>
          </View>

          {/* Trilha Conectada Contínua de Cores */}
          <View style={styles.scaleProgressBar}>
            {BADGES.map((b) => (
              <View
                key={b.id}
                style={[styles.scaleProgressSegment, { backgroundColor: b.bgColor }]}
              />
            ))}
          </View>

          {/* Os 6 Níveis / Cards da Escala Incorporados Lado a Lado */}
          <View
            style={[
              styles.scaleCardsRow,
              isTablet && styles.scaleCardsRowTablet,
              isMobile && styles.scaleCardsRowMobile,
            ]}
          >
            {BADGES.map((b, idx) => {
              const isSelected = b.id === activeBadgeId;
              return (
                <Pressable
                  key={b.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Badge ${b.name}`}
                  onPress={() =>
                    setActiveBadgeId(activeBadgeId === b.id ? null : b.id)
                  }
                  style={({ pressed }) => [
                    styles.badgeCard,
                    { backgroundColor: b.bgColor },
                    isSelected && styles.badgeCardSelected,
                    isTablet && styles.badgeCardTablet,
                    isMobile && styles.badgeCardMobile,
                    pressed && { transform: [{ translateY: 2 }] },
                    isVisible &&
                      Platform.OS === 'web' &&
                      ({
                        animation: `cartoonPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${
                          idx * 60
                        }ms both`,
                      } as any),
                  ]}
                >
                  {/* Indicador de Nível da Escala */}
                  <View style={styles.levelPill}>
                    <Text style={styles.levelPillText}>NÍVEL {b.level}</Text>
                  </View>

                  {/* Sticker Circular da Menção UnB */}
                  <View style={styles.emojiSticker}>
                    <Text style={styles.mencaoText}>{b.mencao}</Text>
                  </View>

                  {/* Nome do Badge */}
                  <Text style={styles.badgeName}>{b.name}</Text>

                  {/* Descrição Direta sem excesso de texto */}
                  <Text style={styles.badgeDescription}>{b.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Legenda Informativa */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            ✦ Cada disciplina recebe sua badge pelo voto médio dos estudantes da UnB ao final de cada semestre.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 72,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 2,
    borderTopColor: '#1F1F1F',
    borderBottomWidth: 2,
    borderBottomColor: '#1F1F1F',
  },
  container: {
    width: '100%',
    maxWidth: 1360,
    alignItems: 'center',
  },
  tagWrapper: {
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#EFEDE1',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 5,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  tagPillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  sectionTitleMobile: {
    fontSize: 24,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    maxWidth: 760,
    lineHeight: 24,
    marginBottom: 32,
  },

  // Div Principal da Escala Graduada com Fundo Cinza Neo-Brutal
  scaleBoard: {
    width: '100%',
    backgroundColor: '#ECECE9', // Fundo cinza sofisticado pedido pelo usuário
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 28,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  scaleBoardMobile: {
    padding: 16,
  },

  // Cabeçalho da Escala
  scaleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  scaleExtremityLeft: {
    paddingVertical: 3,
  },
  scaleExtremityLeftText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#D32F2F',
    textTransform: 'uppercase',
  },
  scaleCenterPill: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 3,
  },
  scaleCenterPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  scaleExtremityRight: {
    paddingVertical: 3,
  },
  scaleExtremityRightText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1349EB',
    textTransform: 'uppercase',
  },

  // Trilha de Cores Conectada
  scaleProgressBar: {
    flexDirection: 'row',
    height: 10,
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  scaleProgressSegment: {
    flex: 1,
    height: '100%',
  },

  // Fileira de Cards da Escala
  scaleCardsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  scaleCardsRowTablet: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },
  scaleCardsRowMobile: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Card Individual de cada Nível da Escala
  badgeCard: {
    flex: 1,
    minWidth: 165,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 12,
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'transform 0.16s ease, box-shadow 0.16s ease',
        } as any)
      : {}),
  },
  badgeCardTablet: {
    flex: undefined,
    width: '31%',
    minWidth: 180,
  },
  badgeCardMobile: {
    flex: undefined,
    width: '48%',
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 8,
    minHeight: 240,
  },
  badgeCardSelected: {
    transform: [{ translateY: -5 }],
    shadowOffset: { width: 4.5, height: 4.5 },
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },

  // Pill de Nível
  levelPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    marginBottom: 12,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  levelPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Sticker Circular do Emoji
  emojiSticker: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  mencaoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.5,
  },

  // Nome do Badge
  badgeName: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#1F1F1F',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  // Descrição Direta
  badgeDescription: {
    fontSize: 12,
    color: '#262626',
    textAlign: 'center',
    lineHeight: 16.5,
    fontWeight: '500',
  },

  // Legenda Informativa Inferior
  infoBanner: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
  },
  infoBannerText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  Linking,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useInView } from '../../../hooks/useInView';

function BookPencilIcon({ size = 24, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 7h6M9 11h4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function ShieldCheckIcon({ size = 24, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CodeTerminalIcon({ size = 24, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2.2" />
      <Path d="M7 10l3 2-3 2M13 14h4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CommunitySection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const [githubHovered, setGithubHovered] = useState(false);

  const handleOpenGitHub = () => {
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
        {/* Tag da Seção */}
        <View style={styles.tagWrapper}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>COMUNIDADE ACADÊMICA DA UNB</Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
          A união faz a aprovação.
        </Text>

        <Text style={styles.mainSubtitle}>
          O UnBook não é uma ferramenta corporativa. É uma rede solidária de estudantes da UnB compartilhando experiências reais para que ninguém passe aperto sozinho.
        </Text>

        {/* 3 Pilares Equilibrados Neo-Brutalistas */}
        <View
          style={[
            styles.pillarsGrid,
            isTablet && styles.pillarsGridTablet,
            isMobile && styles.pillarsGridMobile,
          ]}
        >
          {/* Pilar 1: Dicas Reais */}
          <View style={[styles.pillarCard, isVisible && styles.cardEnter1]}>
            <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
              <BookPencilIcon size={26} color="#1349EB" />
            </View>

            <Text style={styles.pillarTitle}>Dicas de Quem Já Passou</Text>
            <Text style={styles.pillarDesc}>
              Descubra antes do semestre como cada docente cobra nas provas, se as listas são individuais ou em grupo, e onde encontrar os melhores materiais.
            </Text>

            <View style={styles.pillarPill}>
              <Text style={styles.pillarPillText}>✦ +12.400 DICAS REGISTRADAS</Text>
            </View>
          </View>

          {/* Pilar 2: Transparência e Anonimato */}
          <View style={[styles.pillarCard, isVisible && styles.cardEnter2]}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <ShieldCheckIcon size={26} color="#009A5E" />
            </View>

            <Text style={styles.pillarTitle}>Transparência Sem Retaliação</Text>
            <Text style={styles.pillarDesc}>
              Suas avaliações são 100% anônimas por design criptográfico. Você expressa sua opinião com honestidade sem nenhum vínculo com sua matrícula.
            </Text>

            <View style={[styles.pillarPill, { backgroundColor: '#DCFCE7', borderColor: '#009A5E' }]}>
              <Text style={[styles.pillarPillText, { color: '#009A5E' }]}>✦ SEGURANÇA BLINDADA</Text>
            </View>
          </View>

          {/* Pilar 3: Código Aberto */}
          <View style={[styles.pillarCard, isVisible && styles.cardEnter3]}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF08A' }]}>
              <CodeTerminalIcon size={26} color="#854D0E" />
            </View>

            <Text style={styles.pillarTitle}>Feito por e para Alunos</Text>
            <Text style={styles.pillarDesc}>
              Construído de forma voluntária por graduandos dos campi Darcy, FGA, FCE e FUP. Código aberto sob licença MIT para toda a comunidade auditar.
            </Text>

            <View style={[styles.pillarPill, { backgroundColor: '#FEF08A', borderColor: '#854D0E' }]}>
              <Text style={[styles.pillarPillText, { color: '#854D0E' }]}>✦ CÓDIGO ABERTO NO GITHUB</Text>
            </View>
          </View>
        </View>

        {/* Card de Apoio e Contribuição */}
        <View style={[styles.bannerRow, isMobile && styles.bannerRowMobile]}>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>Quer ajudar a manter o UnBook vivo?</Text>
            <Text style={styles.bannerSubtitle}>
              Sugerir uma nova funcionalidade, corrigir dados de turmas ou enviar um pull request. Toda ajuda discente é bem-vinda!
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver repositório no GitHub"
            onPress={handleOpenGitHub}
            onHoverIn={() => setGithubHovered(true)}
            onHoverOut={() => setGithubHovered(false)}
            style={({ pressed }) => [
              styles.githubBtn,
              githubHovered && styles.githubBtnHovered,
              pressed && styles.githubBtnPressed,
            ]}
          >
            <Text style={styles.githubBtnText}>COLABORAR NO GITHUB →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
    paddingVertical: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
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
  mainTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
    color: '#1F1F1F',
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
    color: '#4B5563',
    textAlign: 'center',
    maxWidth: 720,
    lineHeight: 24,
    marginBottom: 44,
  },

  // 3 Pilares em Grade
  pillarsGrid: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
    marginBottom: 40,
    justifyContent: 'center',
  },
  pillarsGridTablet: {
    flexWrap: 'wrap',
  },
  pillarsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  pillarCard: {
    flex: 1,
    minWidth: 280,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  cardEnter1: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        } as any)
      : {}),
  },
  cardEnter2: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 120ms both',
        } as any)
      : {}),
  },
  cardEnter3: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 240ms both',
        } as any)
      : {}),
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pillarTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  pillarDesc: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 21,
    marginBottom: 20,
    flex: 1,
  },
  pillarPill: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#1349EB',
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  pillarPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1349EB',
    letterSpacing: 0.8,
  },

  // Banner Inferior de Chamada
  bannerRow: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  bannerRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 20,
  },
  githubBtn: {
    backgroundColor: '#1349EB',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 22,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  githubBtnHovered: {
    transform: [{ translateY: -2 }],
    boxShadow: '4.5px 4.5px 0px #1F1F1F',
  },
  githubBtnPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '1px 1px 0px #1F1F1F',
  },
  githubBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});

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
import { UnbookLogo } from './UnbookLogo';

function GithubIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface FooterLinkProps {
  label: string;
  onPress: () => void;
}

function FooterLink({ label, onPress }: FooterLinkProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={styles.linkPressable}
    >
      <Text style={[styles.linkText, hovered && styles.linkTextHovered]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Footer() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const [githubBtnHovered, setGithubBtnHovered] = useState(false);

  const handleOpenUrl = (url: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  const handleScrollToTop = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <View style={styles.footerWrapper}>
      <View style={styles.container}>
        {/* Topo do Footer: Identidade e Botão GitHub */}
        <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
          <View style={styles.brandBox}>
            <Pressable onPress={handleScrollToTop} style={styles.logoBtn}>
              <UnbookLogo width={146} showBadge={false} />
            </Pressable>
            <Text style={styles.brandTagline}>
              A plataforma comunitária para planejar sua trajetória acadêmica na UnB com transparência e sem estresse.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver repositório no GitHub"
            onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2')}
            onHoverIn={() => setGithubBtnHovered(true)}
            onHoverOut={() => setGithubBtnHovered(false)}
            style={({ pressed }) => [
              styles.githubActionBtn,
              githubBtnHovered && styles.githubActionBtnHovered,
              pressed && styles.githubActionBtnPressed,
            ]}
          >
            <GithubIcon size={18} color="#FFFFFF" />
            <Text style={styles.githubActionBtnText}>REPOSITÓRIO NO GITHUB</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* 4 Colunas Profissionais de Navegação */}
        <View
          style={[
            styles.columnsGrid,
            isTablet && styles.columnsGridTablet,
            isMobile && styles.columnsGridMobile,
          ]}
        >
          {/* Coluna 1: Plataforma */}
          <View style={styles.col}>
            <Text style={styles.colHeading}>PLATAFORMA</Text>
            <FooterLink
              label="Catálogo SIGAA UnB"
              onPress={() => handleOpenUrl('https://sigaa.unb.br/sigaa/')}
            />
            <FooterLink
              label="Avaliações Anônimas"
              onPress={handleScrollToTop}
            />
            <FooterLink
              label="Estatísticas dos Docentes"
              onPress={handleScrollToTop}
            />
            <FooterLink
              label="Badges Comunitárias"
              onPress={handleScrollToTop}
            />
          </View>

          {/* Coluna 2: Transparência */}
          <View style={styles.col}>
            <Text style={styles.colHeading}>TRANSPARÊNCIA</Text>
            <FooterLink
              label="Garantia de Anonimato"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2/blob/main/README.md')}
            />
            <FooterLink
              label="Moderação Anti-Danos"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2')}
            />
            <FooterLink
              label="Critérios de Menções"
              onPress={handleScrollToTop}
            />
            <FooterLink
              label="Dados Abertos"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2')}
            />
          </View>

          {/* Coluna 3: Links Oficiais UnB */}
          <View style={styles.col}>
            <Text style={styles.colHeading}>LINKS OFICIAIS UNB</Text>
            <FooterLink
              label="SIGAA UnB"
              onPress={() => handleOpenUrl('https://sigaa.unb.br/sigaa/')}
            />
            <FooterLink
              label="Matrícula Web"
              onPress={() => handleOpenUrl('https://sigaa.unb.br/')}
            />
            <FooterLink
              label="Aprender 3 (Moodle)"
              onPress={() => handleOpenUrl('https://aprender3.unb.br/')}
            />
            <FooterLink
              label="Restaurante Universitário (RU)"
              onPress={() => handleOpenUrl('https://ru.unb.br/')}
            />
          </View>

          {/* Coluna 4: Comunidade */}
          <View style={styles.col}>
            <Text style={styles.colHeading}>COMUNIDADE</Text>
            <FooterLink
              label="Contribuir no Projeto"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2/blob/main/CONTRIBUTING.md')}
            />
            <FooterLink
              label="Reportar Bug ou Inconsistência"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2/issues')}
            />
            <FooterLink
              label="Diretrizes Discentes"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2')}
            />
            <FooterLink
              label="Sobre os Desenvolvedores"
              onPress={() => handleOpenUrl('https://github.com/unbook-org/unbook-2')}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Linha Final: Copyright & Disclaimer */}
        <View style={[styles.bottomRow, isMobile && styles.bottomRowMobile]}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} UnBook • Construído por e para estudantes da Universidade de Brasília (UnB).
          </Text>

          <Text style={styles.disclaimerText}>
            Projeto acadêmico independente de código aberto sob licença MIT.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: '#FAF9F5',
    borderTopWidth: 2.5,
    borderTopColor: '#1F1F1F',
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1360,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    gap: 24,
  },
  topRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 20,
  },
  brandBox: {
    maxWidth: 560,
  },
  logoBtn: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  brandTagline: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  githubActionBtn: {
    backgroundColor: '#1F1F1F',
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  githubActionBtnHovered: {
    backgroundColor: '#1349EB',
    transform: [{ translateY: -2 }],
    boxShadow: '4.5px 4.5px 0px #1F1F1F',
  },
  githubActionBtnPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '1px 1px 0px #1F1F1F',
  },
  githubActionBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#E5E7EB',
    marginVertical: 28,
  },

  // Colunas
  columnsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 32,
    width: '100%',
  },
  columnsGridTablet: {
    flexWrap: 'wrap',
    gap: 28,
  },
  columnsGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  col: {
    flex: 1,
    minWidth: 160,
  },
  colHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1,
    marginBottom: 16,
  },
  linkPressable: {
    paddingVertical: 6,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  linkText: {
    fontSize: 13.5,
    color: '#6B7280',
    fontWeight: '600',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'color 0.15s ease',
        } as any)
      : {}),
  },
  linkTextHovered: {
    color: '#1349EB',
    fontWeight: '700',
  },

  // Rodapé Final
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  bottomRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  copyrightText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4B5563',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

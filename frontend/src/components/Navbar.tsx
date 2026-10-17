import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  Modal,
  ScrollView,
} from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { ScheduleSimulatorSection } from '../screens/home/sections/ScheduleSimulatorSection';
import { UnbookLogo } from './UnbookLogo';

// Ícone vetorial de Sol/Lua para alternar tema (estilo neo-brutalista)
function SunMoonIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
      <Path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.636 5.636L7.05 7.05M16.95 16.95L18.364 18.364M5.636 18.364L7.05 16.95M16.95 7.05L18.364 5.636" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

// Ícone de Menu Hambúrguer (Mobile)
function MenuIcon({ size = 20, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

// Ícone fechar (X)
function CloseIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

export interface NavbarProps {
  onPressExplore?: () => void;
  onPressSchedule?: () => void;
  onPressAbout?: () => void;
  onPressLogin?: () => void;
  onPressRegister?: () => void;
  onPressLogo?: () => void;
}

export function Navbar({
  onPressExplore,
  onPressSchedule,
  onPressAbout,
  onPressLogin,
  onPressRegister,
  onPressLogo,
}: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | 'theme' | null>(null);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);

  const [explorarHovered, setExplorarHovered] = useState(false);
  const [gradeHovered, setGradeHovered] = useState(false);
  const [sobreHovered, setSobreHovered] = useState(false);

  const [themeBtnHovered, setThemeBtnHovered] = useState(false);
  const [loginBtnHovered, setLoginBtnHovered] = useState(false);
  const [registerBtnHovered, setRegisterBtnHovered] = useState(false);

  const handleOpenLogin = () => {
    if (onPressLogin) onPressLogin();
    else setAuthModal('login');
  };

  const handleOpenRegister = () => {
    if (onPressRegister) onPressRegister();
    else setAuthModal('register');
  };

  const handleOpenGrade = () => {
    if (onPressSchedule) {
      onPressSchedule();
    } else {
      setGradeModalOpen(true);
    }
  };

  return (
    <>
      <View
        nativeID="app-navbar"
        // @ts-ignore
        id="app-navbar"
        style={styles.navWrapper}
      >
        <View style={styles.navContainer}>
          {/* LADO ESQUERDO: LOGO UNBOOK */}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="UnBook Página Inicial"
            onPress={() => {
              if (onPressLogo) {
                onPressLogo();
              } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            style={styles.logoPressable}
          >
            <UnbookLogo width={isMobile ? 116 : 132} showBadge={false} />
          </Pressable>

          {/* CENTRO: LINKS DE NAVEGAÇÃO (DESKTOP) */}
          {!isMobile && (
            <View style={styles.centerLinks}>
              <Pressable
                onPress={onPressExplore}
                onHoverIn={() => setExplorarHovered(true)}
                onHoverOut={() => setExplorarHovered(false)}
                style={styles.linkItem}
              >
                <Text
                  style={[
                    styles.linkText,
                    explorarHovered && styles.linkTextHovered,
                  ]}
                >
                  Explorar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleOpenGrade}
                onHoverIn={() => setGradeHovered(true)}
                onHoverOut={() => setGradeHovered(false)}
                style={styles.linkItem}
              >
                <Text
                  style={[
                    styles.linkText,
                    gradeHovered && styles.linkTextHovered,
                  ]}
                >
                  Grade
                </Text>
              </Pressable>

              <Pressable
                onPress={onPressAbout}
                onHoverIn={() => setSobreHovered(true)}
                onHoverOut={() => setSobreHovered(false)}
                style={styles.linkItem}
              >
                <Text
                  style={[
                    styles.linkText,
                    sobreHovered && styles.linkTextHovered,
                  ]}
                >
                  Sobre
                </Text>
              </Pressable>
            </View>
          )}

          {/* LADO DIREITO: BOTÕES DE AÇÃO */}
          <View style={styles.rightActions}>
            {/* Botão de Tema (Sol / Lua) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Modo visual caderno UnBook"
              onPress={() => setAuthModal('theme')}
              onHoverIn={() => setThemeBtnHovered(true)}
              onHoverOut={() => setThemeBtnHovered(false)}
              style={({ pressed }) => [
                styles.themeButton,
                themeBtnHovered && styles.buttonHovered,
                pressed && styles.buttonPressed,
              ]}
            >
              <SunMoonIcon size={17} color="#1F1F1F" />
            </Pressable>

            {!isMobile && (
              <>
                {/* Botão Login */}
                <Pressable
                  accessibilityRole="button"
                  onPress={handleOpenLogin}
                  onHoverIn={() => setLoginBtnHovered(true)}
                  onHoverOut={() => setLoginBtnHovered(false)}
                  style={({ pressed }) => [
                    styles.loginButton,
                    loginBtnHovered && styles.buttonHovered,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </Pressable>

                {/* Botão Cadastre-se */}
                <Pressable
                  accessibilityRole="button"
                  onPress={handleOpenRegister}
                  onHoverIn={() => setRegisterBtnHovered(true)}
                  onHoverOut={() => setRegisterBtnHovered(false)}
                  style={({ pressed }) => [
                    styles.registerButton,
                    registerBtnHovered && styles.registerButtonHovered,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={styles.registerButtonText}>Cadastre-se</Text>
                </Pressable>
              </>
            )}

            {/* Menu Hambúrguer para Telas Pequenas */}
            {isMobile && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir menu"
                onPress={() => setMobileMenuOpen(true)}
                style={styles.mobileMenuButton}
              >
                <MenuIcon size={20} color="#1F1F1F" />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Drawer / Menu Mobile */}
      <Modal
        visible={mobileMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMobileMenuOpen(false)}
      >
        <Pressable
          style={styles.mobileModalOverlay}
          onPress={() => setMobileMenuOpen(false)}
        >
          <Pressable
            style={styles.mobileMenuCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.mobileMenuHeader}>
              <UnbookLogo width={118} showBadge={false} />
              <Pressable
                onPress={() => setMobileMenuOpen(false)}
                style={styles.mobileCloseBtn}
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>

            <View style={styles.mobileLinksList}>
              <Pressable
                style={styles.mobileLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  onPressExplore?.();
                }}
              >
                <Text style={styles.mobileLinkText}>Explorar Catálogo</Text>
              </Pressable>

              <Pressable
                style={styles.mobileLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleOpenGrade();
                }}
              >
                <Text style={styles.mobileLinkText}>Simulador de Grade</Text>
              </Pressable>

              <Pressable
                style={styles.mobileLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  onPressAbout?.();
                }}
              >
                <Text style={styles.mobileLinkText}>Sobre o UnBook</Text>
              </Pressable>
            </View>

            <View style={styles.mobileAuthRow}>
              <Pressable
                style={styles.loginButton}
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleOpenLogin();
                }}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>

              <Pressable
                style={styles.registerButton}
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleOpenRegister();
                }}
              >
                <Text style={styles.registerButtonText}>Cadastre-se</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal do Simulador de Grade */}
      <Modal
        visible={gradeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setGradeModalOpen(false)}
      >
        <Pressable
          style={styles.mobileModalOverlay}
          onPress={() => setGradeModalOpen(false)}
        >
          <Pressable
            style={styles.gradeModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.gradeModalTopBar}>
              <View style={styles.gradeModalTitleRow}>
                <View style={styles.betaPill}>
                  <Text style={styles.betaPillText}>FERRAMENTA DISCENTE UNB</Text>
                </View>
                <Text style={styles.authModalTitle}>Simulador de Grade Horária</Text>
              </View>
              <Pressable
                onPress={() => setGradeModalOpen(false)}
                style={styles.mobileCloseBtn}
                accessibilityRole="button"
                accessibilityLabel="Fechar simulador de grade"
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>
            <ScrollView style={styles.gradeModalScroll}>
              <ScheduleSimulatorSection />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de Autenticação / Tema Rápido */}
      <Modal
        visible={authModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setAuthModal(null)}
      >
        <Pressable
          style={styles.mobileModalOverlay}
          onPress={() => setAuthModal(null)}
        >
          <Pressable
            style={styles.authModalCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.mobileMenuHeader}>
              <Text style={styles.authModalTitle}>
                {authModal === 'theme'
                  ? 'Estética Caderno Universitário'
                  : authModal === 'login'
                  ? 'Entrar no UnBook'
                  : 'Criar Conta Discente'}
              </Text>
              <Pressable
                onPress={() => setAuthModal(null)}
                style={styles.mobileCloseBtn}
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>

            <View style={styles.betaPill}>
              <Text style={styles.betaPillText}>
                {authModal === 'theme'
                  ? 'TEMA NEO-BRUTALISTA ATIVO'
                  : 'BETA ABERTO — ACESSO LIVRE SEM LOGIN'}
              </Text>
            </View>

            <Text style={styles.authModalDesc}>
              {authModal === 'theme'
                ? 'O UnBook utiliza a identidade visual de Caderno Universitário de Alto Contraste (#FAF9F5) inspirada nas cores oficiais da UnB para leitura confortável de ementas e grades.'
                : 'Durante o período de Beta Aberto na UnB, todas as funcionalidades de consulta de matérias, perfil de docentes e simulador de horários estão 100% liberadas sem necessidade de cadastro.'}
            </Text>

            <Pressable
              style={styles.authConfirmBtn}
              onPress={() => setAuthModal(null)}
            >
              <Text style={styles.authConfirmBtnText}>Entendido</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#1F1F1F',
    width: '100%',
    zIndex: 90,
    ...(Platform.OS === 'web'
      ? ({
          animationKeyframes: 'navSlideDown',
          animationDuration: '450ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
        } as any)
      : {}),
  },
  navContainer: {
    maxWidth: 'auto',
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  centerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  linkItem: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  linkText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#272725',
    ...(Platform.OS === 'web'
      ? ({
          transition: 'color 0.15s ease',
        } as any)
      : {}),
  },
  linkTextHovered: {
    color: '#1349EB',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  loginButtonText: {
    color: '#1F1F1F',
    fontWeight: '800',
    fontSize: 13.5,
  },
  registerButton: {
    backgroundColor: '#009A5E', // Verde oficial UnB
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 18,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  registerButtonHovered: {
    backgroundColor: '#007A4A',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-1px)',
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  buttonHovered: {
    backgroundColor: '#FAF8F0',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-1px)',
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  buttonPressed: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(1px, 1px)',
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  mobileMenuButton: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
  },
  mobileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mobileMenuCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  mobileCloseBtn: {
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
  },
  mobileLinksList: {
    gap: 14,
    marginBottom: 24,
  },
  mobileLinkItem: {
    paddingVertical: 8,
  },
  mobileLinkText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  mobileAuthRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  authModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  authModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  authModalDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#4B5563',
    marginBottom: 20,
  },
  authConfirmBtn: {
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  authConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  betaPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF7F0',
    borderWidth: 1.5,
    borderColor: '#009A5E',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  betaPillText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#009A5E',
    letterSpacing: 0.6,
  },
  gradeModalCard: {
    width: '100%',
    maxWidth: 1120,
    maxHeight: '90%',
    backgroundColor: '#FAF9F5',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  gradeModalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#1F1F1F',
  },
  gradeModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  gradeModalScroll: {
    width: '100%',
  },
});

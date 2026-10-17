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
import Svg, { Path, Line } from 'react-native-svg';

// Ícone vetorial de Megafone / Alto-falante
function MegaphoneIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11V13C3 14.1046 3.89543 15 5 15H6L11 19V5L6 9H5C3.89543 9 3 9.89543 3 11Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M15.54 8.46C16.4774 9.39764 17.0041 10.6692 17.0041 11.995C17.0041 13.3208 16.4774 14.5924 15.54 15.53"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Path
        d="M18.36 5.64C20.0474 7.32768 20.9953 9.61633 20.9953 12C20.9953 14.3837 20.0474 16.6723 18.36 18.36"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Ícone fechar (X)
function CloseIcon({ size = 16, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

export interface NewsBannerProps {
  message?: string;
  actionText?: string;
  onPressAction?: () => void;
  onDismiss?: () => void;
}

export function NewsBanner({
  message = 'Primeira semana de desenvolvimento do site!',
  actionText = 'Acesse para ver as novidades!',
  onPressAction,
  onDismiss,
}: NewsBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleAction = () => {
    if (onPressAction) {
      onPressAction();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <View style={styles.bannerWrapper}>
        <View style={[styles.bannerContainer, isMobile && styles.bannerContainerMobile]}>
          {/* Conteúdo Central com Ícone de Megafone e Texto */}
          <View style={styles.centerContent}>
            <View style={styles.iconWrapper}>
              <MegaphoneIcon size={17} color="#1F1F1F" />
            </View>

            <Text style={styles.messageText}>
              {message}{' '}
              <Text
                onPress={handleAction}
                // @ts-ignore - Eventos web de hover
                onMouseEnter={() => setLinkHovered(true)}
                // @ts-ignore - Eventos web de hover
                onMouseLeave={() => setLinkHovered(false)}
                style={[styles.actionLinkText, linkHovered && styles.actionLinkTextHovered]}
              >
                {actionText}
              </Text>
            </Text>
          </View>

          {/* Botão Fechar no Canto Direito */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar aviso"
            onPress={handleDismiss}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.closeButtonPressed,
            ]}
          >
            <CloseIcon size={16} color="#1F1F1F" />
          </Pressable>
        </View>
      </View>

      {/* Modal Informativo das Novidades da Semana */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsModalOpen(false)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalTag}>
                  <Text style={styles.modalTagText}>NOVIDADES</Text>
                </View>
                <Text style={styles.modalTitle}>Boletim da Semana 1 ✨</Text>
              </View>
              <Pressable
                onPress={() => setIsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalParagraph}>
                Bem-vindo ao desenvolvimento ativo do <Text style={{ fontWeight: '800' }}>UnBook 2.0</Text>!
              </Text>

              <View style={styles.newsItem}>
                <Text style={styles.newsItemTitle}>Landing Page & Design Neo-Brutalista</Text>
                <Text style={styles.newsItemDesc}>
                  Identidade visual construída nas cores oficiais da UnB, pautas de caderno autênticas e tipografia responsiva.
                </Text>
              </View>

              <View style={styles.newsItem}>
                <Text style={styles.newsItemTitle}>Motor de Busca Integrado (Em breve)</Text>
                <Text style={styles.newsItemDesc}>
                  Sincronização em tempo real com turmas, salas e professores direto do SIGAA.
                </Text>
              </View>

              <View style={styles.newsItem}>
                <Text style={styles.newsItemTitle}>Anonimato Criptográfico</Text>
                <Text style={styles.newsItemDesc}>
                  Sistema de assinatura cega sem retenção de matrícula para avaliações sinceras sem risco de retaliação.
                </Text>
              </View>
            </ScrollView>

            <Pressable
              style={styles.modalConfirmBtn}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.modalConfirmBtnText}>Continuar explorando</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    backgroundColor: '#F1C321', // Amarelo oficial do painel de notícias
    borderBottomWidth: 1.5,
    borderBottomColor: '#1F1F1F',
    width: '100%',
    zIndex: 100,
  },
  bannerContainer: {
    maxWidth: 'auto',
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerContainerMobile: {
    paddingRight: 40,
    justifyContent: 'flex-start',
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  actionLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
    textDecorationLine: 'underline',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  actionLinkTextHovered: {
    color: '#1349EB',
  },
  closeButton: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  closeButtonPressed: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #000000',
        } as any)
      : {}),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1F1F1F',
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTag: {
    backgroundColor: '#F1C321',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  modalTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  modalCloseBtn: {
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
  },
  modalParagraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  newsItem: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  newsItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  newsItemDesc: {
    fontSize: 12.5,
    color: '#4B5563',
    lineHeight: 18,
  },
  modalConfirmBtn: {
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  modalConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

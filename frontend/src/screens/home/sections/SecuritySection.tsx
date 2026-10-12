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
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { CartoonButton } from '../../../components/CartoonButton';
import { useInView } from '../../../hooks/useInView';

function CheckSquareIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="1.5" y="1.5" width="17" height="17" rx="3" fill="#22C55E" stroke="#1F1F1F" strokeWidth="2" />
      <Path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldPadlockIcon({ size = 26, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="#F1C321"
        stroke={color}
        strokeWidth="2"
      />
      <Rect x="9" y="11" width="6" height="5" rx="1" fill="#1F1F1F" />
      <Path d="M10 11V9.5a2 2 0 1 1 4 0V11" stroke="#1F1F1F" strokeWidth="1.8" />
    </Svg>
  );
}

function CloseIcon({ size = 18, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

export function SecuritySection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const [modalOpen, setModalOpen] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  return (
    <View ref={sectionRef} style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View
          style={[
            styles.contentRow,
            isTablet && styles.contentRowTablet,
            isMobile && styles.contentRowMobile,
          ]}
        >
          {/* LADO ESQUERDO: TEXTOS, BENEFÍCIOS & SEGURANÇA */}
          <View style={styles.leftColumn}>
            {/* Tag SEGURANÇA (modelo original limpo) */}
            <View style={styles.tagWrapper}>
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>SEGURANÇA</Text>
              </View>
            </View>

            {/* Título Principal */}
            <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
              Avalie sem Medo de Retaliação
            </Text>

            <Text style={styles.mainDescription}>
              O anonimato é o coração do UnBook. Suas críticas são anônimas — desde opiniões a dados — sem criar vínculos que favoreçam retaliações na vida acadêmica.
            </Text>

            {/* Lista com Checkmarks */}
            <View style={styles.checklist}>
              <View style={styles.checkItem}>
                <CheckSquareIcon size={18} />
                <Text style={styles.checkItemText}>Identidade 100% oculta dos docentes</Text>
              </View>

              <View style={styles.checkItem}>
                <CheckSquareIcon size={18} />
                <Text style={styles.checkItemText}>Moderação comunitária anti-bullying</Text>
              </View>

              <View style={styles.checkItem}>
                <CheckSquareIcon size={18} />
                <Text style={styles.checkItemText}>E-mail institucional nunca vinculado às avaliações</Text>
              </View>
            </View>

            {/* Card com Selo de Anonimato */}
            <View style={styles.badgeCard}>
              <View style={styles.shieldWrapper}>
                <ShieldPadlockIcon size={28} />
              </View>
              <View style={styles.badgeTextContainer}>
                <Text style={styles.badgeTitle}>Anonimato Garantido por Design</Text>
                <Text style={styles.badgeSubtitle}>
                  Auditoria de ponta a ponta: dados criptografados antes de salvar.
                </Text>
              </View>
            </View>

            {/* Botão com Sombra Brutalista e Efeito Slide de Brilho */}
            <CartoonButton
              variant="dark"
              size="lg"
              showSlideArrow
              onPress={() => setModalOpen(true)}
              accessibilityLabel="Saiba mais sobre segurança e criptografia no UnBook"
              style={styles.learnBtnWrapper}
            >
              Saiba mais sobre segurança
            </CartoonButton>
          </View>

          {/* LADO DIREITO: MOCKUP PAPEL SOBREPOSTO */}
          <Pressable
            onHoverIn={() => setCardHovered(true)}
            onHoverOut={() => setCardHovered(false)}
            style={[
              styles.rightColumn,
              cardHovered && styles.rightColumnHovered,
              isVisible &&
                Platform.OS === 'web' &&
                ({
                  animation:
                    'cartoonPopIn 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) 150ms both',
                } as any),
            ]}
          >
            {/* Folha de fundo com rotação para o visual brutalist de papel */}
            <View style={styles.underCard} />

            {/* Card principal estilo folha de caderno */}
            <View style={styles.mainCard}>
              <Text style={styles.cardHeaderTitle}>Como sua identidade é protegida?</Text>

              {/* Passo 1 */}
              <View style={styles.stepItem}>
                <View style={[styles.stepNumberBadge, { backgroundColor: '#1349EB' }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Validação de conta</Text>
                  <Text style={styles.stepDesc}>
                    Você prova que é aluno da UnB sem revelar quem você é.
                  </Text>
                  <View style={[styles.stepMiniTag, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={[styles.stepMiniTagText, { color: '#1E40AF' }]}>
                      JWT + Zero-Knowledge
                    </Text>
                  </View>
                </View>
              </View>

              {/* Passo 2 */}
              <View style={styles.stepItem}>
                <View style={[styles.stepNumberBadge, { backgroundColor: '#009A5E' }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Hash Criptográfico</Text>
                  <Text style={styles.stepDesc}>
                    Seu voto é assinado com chave descartável. Nem os admins sabem quem votou.
                  </Text>
                  <View style={[styles.stepMiniTag, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.stepMiniTagText, { color: '#166534' }]}>
                      SHA-256 + Blind Signature
                    </Text>
                  </View>
                </View>
              </View>

              {/* Passo 3 */}
              <View style={styles.stepItem}>
                <View style={[styles.stepNumberBadge, { backgroundColor: '#F1C321' }]}>
                  <Text style={[styles.stepNumberText, { color: '#1F1F1F' }]}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Publicação Anônima</Text>
                  <Text style={styles.stepDesc}>
                    A avaliação entra no sistema e nunca mais pode ser rastreada até você.
                  </Text>
                  <View style={[styles.stepMiniTag, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.stepMiniTagText, { color: '#92400E' }]}>
                      100% Anônimo
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Modal explicativo de segurança com Animação Cartoon Pop */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="none"
        onRequestClose={() => setModalOpen(false)}
      >
        <Pressable
          style={[styles.modalOverlay, styles.modalOverlayAnimated]}
          onPress={() => setModalOpen(false)}
        >
          <Pressable
            style={[styles.modalBox, styles.modalBoxAnimated]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Criptografia & Privacidade UnBook</Text>
              <Pressable
                onPress={() => setModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalPara}>
                O UnBook foi construído com a premissa inegociável de que nenhum estudante pode ser prejudicado ou identificado por emitir sua opinião honesta sobre disciplinas ou didática docente.
              </Text>
              <Text style={styles.modalPara}>
                Utilizamos assinaturas cegas criptográficas (blind signatures). Quando você confirma que é discente da UnB, um token de validação avulso é emitido. Esse token permite registrar a nota sem que ela fique conectada ao seu login ou matrícula.
              </Text>
              <Text style={styles.modalPara}>
                Nem mesmo nossa equipe de desenvolvimento ou banco de dados armazena o endereço IP ou vínculo entre o avaliador e a avaliação enviada.
              </Text>
            </ScrollView>

            <CartoonButton
              variant="primary"
              size="md"
              onPress={() => setModalOpen(false)}
              style={styles.modalConfirmBtn}
            >
              Entendi, estou protegido!
            </CartoonButton>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#1349EB',
    paddingVertical: 72,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1440,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 48,
  },
  contentRowTablet: {
    flexDirection: 'column',
    gap: 40,
  },
  contentRowMobile: {
    flexDirection: 'column',
    gap: 36,
  },
  leftColumn: {
    flex: 1.1,
  },
  tagWrapper: {
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  tagPillText: {
    color: '#1349EB',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  mainTitleMobile: {
    fontSize: 26,
  },
  mainDescription: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#E0E7FF',
    marginBottom: 24,
  },
  checklist: {
    gap: 12,
    marginBottom: 28,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkItemText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
  },
  badgeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  shieldWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  badgeSubtitle: {
    color: '#E0E7FF',
    fontSize: 12,
    lineHeight: 16,
  },
  learnBtnWrapper: {
    alignSelf: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    position: 'relative',
    minWidth: 300,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    ...(Platform.OS === 'web'
      ? ({
          transition:
            'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
        } as any)
      : {}),
  },
  rightColumnHovered: {
    transform: [{ translateY: -4 }, { scale: 1.015 }],
  },
  underCard: {
    position: 'absolute',
    top: 10,
    left: -10,
    right: 10,
    bottom: -10,
    backgroundColor: '#E2E8F0',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    transform: [{ rotate: '-2.5deg' }],
  },
  mainCard: {
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
  cardHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 4,
  },
  stepMiniTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  stepMiniTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayAnimated: {
    ...(Platform.OS === 'web'
      ? ({
          animation: 'modalBackdropFade 0.22s ease forwards',
        } as any)
      : {}),
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
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 7,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '7px 7px 0px #000000',
        } as any)
      : {}),
  },
  modalBoxAnimated: {
    ...(Platform.OS === 'web'
      ? ({
          animation:
            'modalCartoonPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        } as any)
      : {}),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#1F1F1F',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  modalCloseBtn: {
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    backgroundColor: '#FAF9F6',
  },
  modalPara: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#374151',
    marginBottom: 12,
  },
  modalConfirmBtn: {
    marginTop: 12,
    width: '100%',
  },
});

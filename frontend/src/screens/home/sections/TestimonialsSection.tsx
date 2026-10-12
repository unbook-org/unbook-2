import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
  Modal,
  TextInput,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { CartoonButton } from '../../../components/CartoonButton';
import { useInView } from '../../../hooks/useInView';

function StarIcon({ size = 16, color = '#F1C321' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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

interface TestimonialCardProps {
  quote: string;
  author: string;
  course: string;
  initials: string;
  badgeBg: string;
  index: number;
  isVisible: boolean;
}

function TestimonialCard({
  quote,
  author,
  course,
  initials,
  badgeBg,
  index,
  isVisible,
}: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tiltDeg = index % 2 === 0 ? -1 : 1;

  return (
    <Pressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.testimonialCard,
        isHovered && {
          transform: [
            { translateY: -6 },
            { rotate: `${tiltDeg}deg` },
            { scale: 1.02 },
          ],
          boxShadow: '6px 6px 0px #1F1F1F',
        },
        pressed && {
          transform: [{ translateY: 2 }, { scale: 0.98 }],
          boxShadow: '2px 2px 0px #1F1F1F',
        },
        isVisible &&
          Platform.OS === 'web' &&
          ({
            animation: `cartoonPopIn 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) ${
              index * 120
            }ms both`,
          } as any),
      ]}
    >
      {/* 5 Estrelas */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon key={i} size={16} />
        ))}
      </View>

      <Text style={styles.quoteText}>"{quote}"</Text>

      {/* Autor */}
      <View style={styles.authorRow}>
        <View style={[styles.avatarBadge, { backgroundColor: badgeBg }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author}</Text>
          <Text style={styles.authorCourse}>{course}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function TestimonialsSection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setFeedbackModalOpen(false);
    }, 1500);
  };

  return (
    <View ref={sectionRef} style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Tag DEPOIMENTOS (modelo original limpo) */}
        <View style={styles.tagWrapper}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>DEPOIMENTOS</Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
          Quem já usa, aprova
        </Text>
        <Text style={styles.mainSubtitle}>
          Milhares de estudantes da UnB já planejam seus semestres com o UnBook.
        </Text>

        {/* Grade de Depoimentos */}
        <View
          style={[
            styles.cardsGrid,
            isTablet && styles.cardsGridTablet,
            isMobile && styles.cardsGridMobile,
          ]}
        >
          <TestimonialCard
            quote="Finalmente consegui montar minha grade sem conflito de horário! O UnBook salvou a minha vida no período de matrícula. Muito mais fácil do que usar planilha."
            author="Mariana Souza"
            course="Engenharia de Software • 6º Semestre"
            initials="MS"
            badgeBg="#009A5E" // Verde UnB
            index={0}
            isVisible={isVisible}
          />

          <TestimonialCard
            quote="As avaliações dos professores me ajudaram demais a escolher as turmas certas. Poupei muito tempo e foi metade de dor de cabeça a menos no semestre."
            author="Pedro Almeida"
            course="Ciência da Computação • 4º Semestre"
            initials="PA"
            badgeBg="#1349EB" // Azul vibrante
            index={1}
            isVisible={isVisible}
          />

          <TestimonialCard
            quote="Interface super intuitiva. Em 15 minutos já tinha minha grade montada e as turmas reservas prontas. Recomendo para todo calouro da UnB."
            author="Julia Nobre"
            course="Comunicação • 3º Semestre"
            initials="JN"
            badgeBg="#FE4141" // Vermelho destaque
            index={2}
            isVisible={isVisible}
          />
        </View>

        {/* Caixa de Feedback Inferior */}
        <View style={[styles.feedbackBanner, isMobile && styles.feedbackBannerMobile]}>
          <View style={styles.feedbackLeft}>
            <Text style={styles.feedbackTitle}>
              Você gostaria de enviar um feedback sobre o site?
            </Text>
            <Text style={styles.feedbackDescription}>
              Estamos empenhados a resguardar todas as necessidades dos estudantes da UnB. Portanto, sinta-se à vontade para compartilhar suas análises e nos dar sugestões de melhorias ou qualquer detalhe que possamos ter deixado passar. Sua opinião é muito importante para nós!
            </Text>
            <Text style={styles.feedbackTags}>
              Crítica e elogios • Novas funcionalidades • Notificação de bugs
            </Text>
          </View>

          <CartoonButton
            variant="white"
            size="md"
            showSlideArrow
            onPress={() => setFeedbackModalOpen(true)}
            accessibilityLabel="Abrir formulário de feedback"
            style={styles.feedbackBtnWrapper}
          >
            Enviar feedback
          </CartoonButton>
        </View>
      </View>

      {/* Modal Interativo de Feedback com Animação Cartoon Pop */}
      <Modal
        visible={feedbackModalOpen}
        transparent
        animationType="none"
        onRequestClose={() => setFeedbackModalOpen(false)}
      >
        <Pressable
          style={[styles.modalOverlay, styles.modalOverlayAnimated]}
          onPress={() => setFeedbackModalOpen(false)}
        >
          <Pressable
            style={[styles.modalBox, styles.modalBoxAnimated]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Envie seu Feedback</Text>
              <Pressable
                onPress={() => setFeedbackModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <CloseIcon size={18} />
              </Pressable>
            </View>

            {feedbackSent ? (
              <View style={styles.successBox}>
                <Text style={styles.successTitle}>Obrigado pela contribuição! ✨</Text>
                <Text style={styles.successSub}>
                  Seu feedback foi recebido pela equipe de estudantes mantenedores do UnBook.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalDesc}>
                  Tem uma ideia para o simulador de grade, encontrou uma ementa desatualizada ou quer deixar um elogio? Escreva abaixo:
                </Text>

                <TextInput
                  style={styles.feedbackInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Conta pra gente sua experiência ou sugestão..."
                  placeholderTextColor="#9CA3AF"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                />

                <View style={styles.modalActions}>
                  <CartoonButton
                    variant="white"
                    size="sm"
                    onPress={() => setFeedbackModalOpen(false)}
                  >
                    Cancelar
                  </CartoonButton>

                  <CartoonButton
                    variant="primary"
                    size="sm"
                    onPress={handleSubmitFeedback}
                  >
                    Enviar para a equipe
                  </CartoonButton>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F6',
    paddingVertical: 72,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1440,
    alignItems: 'center',
  },
  tagWrapper: {
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#F1C321',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tagPillText: {
    color: '#1F1F1F',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  mainTitleMobile: {
    fontSize: 24,
  },
  mainSubtitle: {
    fontSize: 14.5,
    color: '#707070',
    textAlign: 'center',
    maxWidth: 580,
    lineHeight: 22,
    marginBottom: 44,
  },
  cardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
    width: '100%',
    marginBottom: 36,
  },
  cardsGridTablet: {
    flexWrap: 'wrap',
  },
  cardsGridMobile: {
    flexDirection: 'column',
  },
  testimonialCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 24,
    justifyContent: 'space-between',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          cursor: 'pointer',
          transition:
            'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease',
        } as any)
      : {}),
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  quoteText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#272725',
    marginBottom: 20,
    minHeight: 76,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
  },
  avatarBadge: {
    width: 34,
    height: 34,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 1,
  },
  authorCourse: {
    fontSize: 11.5,
    color: '#6B7280',
    fontWeight: '600',
  },
  feedbackBanner: {
    width: '100%',
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 28,
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
  feedbackBannerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 20,
    gap: 20,
  },
  feedbackLeft: {
    flex: 1,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#4B5563',
    marginBottom: 12,
  },
  feedbackTags: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6B7280',
  },
  feedbackBtnWrapper: {
    alignSelf: 'center',
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
          animation: 'modalBackdropFade 0.2s ease forwards',
        } as any)
      : {}),
  },
  modalBox: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
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
    marginBottom: 14,
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
    borderRadius: 2,
  },
  modalDesc: {
    fontSize: 13.5,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 14,
  },
  feedbackInput: {
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#1F1F1F',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#FAF9F6',
    marginBottom: 16,
    ...(Platform.OS === 'web'
      ? ({
          outline: 'none',
        } as any)
      : {}),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  successBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#009A5E',
    marginBottom: 8,
  },
  successSub: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
});

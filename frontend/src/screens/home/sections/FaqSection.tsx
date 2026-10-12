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
import Svg, { Path } from 'react-native-svg';
import { useInView } from '../../../hooks/useInView';

function ChevronDownIcon({
  size = 18,
  color = '#1F1F1F',
  isOpen = false,
}: {
  size?: number;
  color?: string;
  isOpen?: boolean;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{
        transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
        ...(Platform.OS === 'web'
          ? ({
              transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            } as any)
          : {}),
      }}
    >
      <Path
        d="M6 9L12 15L18 9"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface FaqItemData {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    question: 'O UnBook é totalmente gratuito?',
    answer:
      'Sim! O UnBook é 100% gratuito e de código aberto. Não cobramos mensalidades, não exibimos anúncios e não vendemos dados de alunos. O projeto é mantido voluntariamente pela comunidade acadêmica.',
  },
  {
    question: 'Os dados do catálogo são atualizados em tempo real?',
    answer:
      'Sim. Nosso crawler sincroniza regularmente com a base de dados pública do SIGAA durante os períodos de matrícula e ajuste, garantindo que turmas, vagas e horários reflitam a realidade da UnB.',
  },
  {
    question: 'É possível salvar várias versões da sua grade de estudos?',
    answer:
      'Sim! Você pode criar simulações alternativas (Plano A, Plano B, Plano C) para se preparar caso alguma turma de alta demanda fique lotada na primeira fase de matrícula.',
  },
  {
    question: 'O simulador identifica automaticamente conflitos de horário?',
    answer:
      'Com certeza. O sistema valida os códigos de horário padrão UnB (como 24M12, 35T34) e avisa instantaneamente se houver choque de dias e horários entre disciplinas selecionadas.',
  },
  {
    question: 'O UnBook funciona em dispositivos móveis?',
    answer:
      'Sim! A aplicação foi construída com tecnologia universal (React Native), funcionando tanto no navegador do seu celular e computador quanto em aplicativo instalado.',
  },
];

interface FaqAccordionItemProps {
  item: FaqItemData;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  isVisible: boolean;
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
  isVisible,
}: FaqAccordionItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const tiltDeg = index % 2 === 0 ? -0.5 : 0.5;

  return (
    <View
      style={[
        styles.accordionBox,
        isOpen && styles.accordionBoxOpen,
        isHovered && {
          transform: [
            { translateY: -3 },
            { rotate: `${tiltDeg}deg` },
            { scale: 1.01 },
          ],
          boxShadow: '6px 6px 0px #000000',
        },
        isVisible &&
          Platform.OS === 'web' &&
          ({
            animation: `cartoonPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${
              index * 90
            }ms both`,
          } as any),
      ]}
    >
      <Pressable
        accessibilityRole="button"
        onPress={onToggle}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        style={styles.questionHeader}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <ChevronDownIcon size={18} color="#1F1F1F" isOpen={isOpen} />
      </Pressable>

      {isOpen && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
}

export function FaqSection() {
  const { width } = useWindowDimensions();
  const [sectionRef, isVisible] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;

  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenDocs = () => {
    const url = 'https://github.com/unbook-org/unbook-2/tree/main/docs';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View ref={sectionRef} style={styles.sectionWrapper}>
      {/* Conteúdo Central Verde */}
      <View style={styles.centerContent}>
        <View style={styles.container}>
          {/* Tag PERGUNTAS FREQUENTES (modelo original limpo) */}
          <View style={styles.tagWrapper}>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>PERGUNTAS FREQUENTES</Text>
            </View>
          </View>

          {/* Título Principal */}
          <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
            Dúvidas Comuns
          </Text>
          <Text style={styles.mainSubtitle}>
            Estamos aqui para tornar sua experiência acadêmica mais simples. Se você não encontrar a resposta que procurava, ou se tiver sugestões para melhorar nossos serviços, não hesite em nos contatar!
          </Text>

          {/* Lista de Acordeões */}
          <View style={styles.accordionList}>
            {FAQ_ITEMS.map((item, index) => (
              <FaqAccordionItem
                key={index}
                item={item}
                isOpen={openIndexes.includes(index)}
                onToggle={() => toggleIndex(index)}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </View>

          {/* Rodapé de Ajuda */}
          <View style={styles.helpFooter}>
            <Text style={styles.helpFooterText}>
              Ainda não encontrou a resposta para sua dúvida? Dê uma olhada no nosso{' '}
            </Text>
            <Pressable onPress={handleOpenDocs}>
              <Text style={styles.helpLinkText}>SISTEMA DE FAQ ↗</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#009A5E',
    width: '100%',
  },
  centerContent: {
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 1140,
    alignItems: 'center',
  },
  tagWrapper: {
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: '#007A4A',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  tagPillText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  mainTitleMobile: {
    fontSize: 26,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#E6F4EA',
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 22,
    marginBottom: 36,
  },
  accordionList: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  accordionBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #000000',
          transition:
            'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease',
        } as any)
      : {}),
  },
  accordionBoxOpen: {
    backgroundColor: '#FCFAEC',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  answerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1.5,
    borderTopColor: '#E5E7EB',
    ...(Platform.OS === 'web'
      ? ({
          animation:
            'cartoonFadeUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        } as any)
      : {}),
  },
  answerText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#374151',
  },
  helpFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  helpFooterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  helpLinkText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});

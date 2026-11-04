import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'O professor consegue saber quem fez uma avaliação?',
    answer:
      'Não. O sistema separa criptograficamente sua identificação institucional (@aluno.unb.br) do conteúdo da sua avaliação antes de salvar qualquer registro no banco de dados. Nem os próprios desenvolvedores conseguem fazer a correlação reversa.',
  },
  {
    id: '2',
    question: 'Como os dados de turmas, docentes e horários são atualizados?',
    answer:
      'Utilizamos scripts automatizados e pipelines de dados de código aberto que consultam os dados públicos do catálogo SIGAA da UnB periodicamente, garantindo que novos semestres e mudanças de salas sejam refletidos.',
  },
  {
    id: '3',
    question: 'O UnBook substitui a matrícula oficial no SIGAA?',
    answer:
      'Não. O UnBook é uma ferramenta de apoio e planejamento prévio. Você utiliza o UnBPlanner para montar a grade ideal sem choques de horário e verificar avaliações, mas a confirmação de matrícula oficial deve sempre ser realizada pelo SIGAA ou Matrícula Web da UnB.',
  },
  {
    id: '4',
    question: 'Como faço para enviar provas antigas ou resumos para a minha matéria?',
    answer:
      'Você pode enviar arquivos de semestres passados diretamente pela comunidade no Discord ou abrindo uma issue/PR no repositório do GitHub. Nossa equipe comunitária faz a triagem para garantir a integridade dos materiais.',
  },
  {
    id: '5',
    question: 'O UnBook tem algum custo para os estudantes?',
    answer:
      'Não, o UnBook é e sempre será 100% gratuito e livre de anúncios invasivos. Os custos de servidores, domínio e APIs de Inteligência Artificial são mantidos através de doações voluntárias via PIX pela comunidade.',
  },
];

export function FaqComoFuncionaSection() {
  const [openId, setOpenId] = useState<string | null>('1');

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>PERGUNTAS FREQUENTES</Text>
          </View>
          <Text style={styles.subtitle}>
            Tire suas dúvidas sobre o funcionamento, privacidade e dados do UnBook
          </Text>
        </View>

        <View style={styles.faqList}>
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <Pressable
                key={faq.id}
                onPress={() => toggleFaq(faq.id)}
                style={[styles.faqCard, isOpen && styles.faqCardOpen]}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <View style={styles.toggleIconBox}>
                    <Text style={styles.toggleIconText}>{isOpen ? '−' : '+'}</Text>
                  </View>
                </View>

                {isOpen && (
                  <View style={styles.faqAnswerBox}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 960,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 36,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  accentBar: {
    width: 6,
    height: 28,
    backgroundColor: '#009A5E',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#707070',
    marginLeft: 18,
  },
  faqList: {
    gap: 14,
  },
  faqCard: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  faqCardOpen: {
    backgroundColor: '#FFFFFF',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
    flex: 1,
  },
  toggleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    backgroundColor: '#EFEDE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  faqAnswerBox: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    marginTop: 14,
    paddingTop: 12,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 22,
  },
});


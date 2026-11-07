import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'Docentes ou o departamento conseguem saber quem fez uma avaliação?',
    answer:
      'Não. O sistema separa criptograficamente seu e-mail institucional (@aluno.unb.br) do texto e notas da sua avaliação antes de salvar qualquer registro no banco de dados. Nem os próprios mantenedores do projeto têm acesso à correlação entre sua conta e sua avaliação.',
  },
  {
    id: '2',
    question: 'Como os dados de disciplinas, professores e horários são atualizados?',
    answer:
      'Utilizamos scripts automatizados de código aberto que consultam os dados públicos do catálogo SIGAA da UnB no início de cada semestre, assegurando que novas turmas, salas e professores constem na plataforma.',
  },
  {
    id: '3',
    question: 'O UnBook substitui a matrícula oficial no SIGAA ou Matrícula Web?',
    answer:
      'Não. O UnBook é uma plataforma de consulta acadêmica colaborativa e transparente. Você pesquisa disciplinas, avaliações honestas de docentes e ementas para embasar suas decisões de matrícula, mas o registro oficial das matérias deve sempre ser feito diretamente no SIGAA da UnB.',
  },
  {
    id: '4',
    question: 'Como posso enviar provas antigas ou resumos para a minha matéria?',
    answer:
      'Você pode enviar materiais de semestres anteriores diretamente pelo repositório no GitHub ou pela nossa comunidade estudantil no Discord. Nossa equipe de curadoria revisa os arquivos para assegurar qualidade e pertinência ao curso.',
  },
  {
    id: '5',
    question: 'O UnBook possui algum custo ou cobra mensalidade?',
    answer:
      'Não. O UnBook é e sempre será 100% gratuito e livre de anúncios invasivos. A infraestrutura de servidores, banco de dados e APIs de IA acadêmica é mantida inteiramente com doações voluntárias e trabalho discente.',
  },
];

export function FaqComoFuncionaSection() {
  const [openId, setOpenId] = useState<string | null>('1');
  const [hoveredFaq, setHoveredFaq] = useState<string | null>(null);

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
            Tire suas dúvidas sobre o funcionamento, privacidade e recursos do UnBook
          </Text>
        </View>

        <View style={styles.faqList}>
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            const isHovered = hoveredFaq === faq.id;
            return (
              <Pressable
                key={faq.id}
                onPress={() => toggleFaq(faq.id)}
                // @ts-ignore
                onMouseEnter={() => setHoveredFaq(faq.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredFaq(null)}
                style={[
                  styles.faqCard,
                  isOpen && styles.faqCardOpen,
                  isHovered && styles.faqCardHovered,
                ]}
              >
                <View style={styles.faqQuestionRow}>
                  <Text style={[styles.faqQuestionText, isOpen && styles.faqQuestionTextOpen]}>
                    {faq.question}
                  </Text>
                  <View style={[styles.toggleIconBox, isOpen && styles.toggleIconBoxOpen]}>
                    <Text style={[styles.toggleIconText, isOpen && styles.toggleIconTextOpen]}>
                      {isOpen ? '−' : '+'}
                    </Text>
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
    backgroundColor: '#009A5E',
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
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
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '3px 3px 0px #1F1F1F',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease',
        } as any)
      : {}),
  },
  faqCardOpen: {
    backgroundColor: '#FFFFFF',
    borderColor: '#009A5E',
  },
  faqCardHovered: {
    transform: [{ translateY: -2 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
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
  faqQuestionTextOpen: {
    color: '#009A5E',
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
  toggleIconBoxOpen: {
    backgroundColor: '#009A5E',
    borderColor: '#1F1F1F',
  },
  toggleIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  toggleIconTextOpen: {
    color: '#FFFFFF',
  },
  faqAnswerBox: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    marginTop: 14,
    paddingTop: 12,
  },
  faqAnswerText: {
    fontSize: 13.5,
    color: '#4A4A4A',
    lineHeight: 22,
  },
});

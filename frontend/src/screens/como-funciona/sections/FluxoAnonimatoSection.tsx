import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

export function FluxoAnonimatoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;

  const steps = [
    {
      step: '01',
      title: 'Login com E-mail @aluno.unb.br',
      description:
        'Você faz login com o e-mail institucional apenas para provar que é um aluno real da UnB, eliminando bots e avaliações falsas.',
      badge: 'AUTENTICAÇÃO',
      badgeBg: '#1349EB',
    },
    {
      step: '02',
      title: 'Hasheamento Criptográfico Unidirecional',
      description:
        'Nosso backend aplica uma função hash com salt secreto que transforma seu login em um identificador matemático impossível de reverter.',
      badge: 'CRIPTOGRAFIA',
      badgeBg: '#009A5E',
    },
    {
      step: '03',
      title: 'Desacoplamento Completo do Usuário',
      description:
        'A avaliação é salva em uma tabela isolada, sem ponte de chave estrangeira (FK) ligando a nota ou comentário ao seu perfil.',
      badge: 'PRIVACIDADE',
      badgeBg: '#FF7A00',
    },
    {
      step: '04',
      title: 'Disponibilidade Pública e Auditável',
      description:
        'A comunidade acessa a média e os comentários agregados com total proteção contra retaliação por parte de docentes.',
      badge: 'SEGURANÇA',
      badgeBg: '#9747FF',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>
              COMO FUNCIONA O ANONIMATO POR DESIGN
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Entenda como garantimos que nenhum professor, coordenador ou colega saiba quem escreveu
          </Text>
        </View>

        <View style={[styles.stepsGrid, isMobile && styles.stepsGridMobile]}>
          {steps.map((st, idx) => (
            <View key={st.step} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>{st.step}</Text>
                <View style={[styles.stepBadge, { backgroundColor: st.badgeBg }]}>
                  <Text style={styles.stepBadgeText}>{st.badge}</Text>
                </View>
              </View>

              <Text style={styles.stepTitle}>{st.title}</Text>
              <Text style={styles.stepDesc}>{st.description}</Text>

              {idx < steps.length - 1 && !isMobile && (
                <View style={styles.arrowIndicator}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.guaranteeBox}>
          <Text style={styles.guaranteeIcon}>🛡️</Text>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Compromisso Estudantil de Dados</Text>
            <Text style={styles.guaranteeBody}>
              Nem os próprios mantenedores do projeto têm acesso à correlação entre sua conta e sua avaliação. O código-fonte deste pipeline é 100% aberto e pode ser inspecionado por qualquer pessoa no GitHub.
            </Text>
          </View>
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
    maxWidth: 1160,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 40,
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
    backgroundColor: '#1349EB',
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
  stepsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 36,
  },
  stepsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#FAF9F5',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 20,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    minHeight: 220,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 20,
    marginBottom: 10,
  },
  stepDesc: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
  arrowIndicator: {
    position: 'absolute',
    right: -14,
    top: '45%',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  guaranteeBox: {
    flexDirection: 'row',
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  guaranteeIcon: {
    fontSize: 32,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  guaranteeBody: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
  },
});


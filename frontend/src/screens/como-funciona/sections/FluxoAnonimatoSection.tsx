import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { IconeEscudo } from '../../../components/UnbookIcons';

export function FluxoAnonimatoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Login Institucional @aluno.unb.br',
      description:
        'A autenticação via e-mail da UnB serve unicamente para confirmar que você estuda na universidade, barrando bots e avaliações falsas.',
      badge: 'VALIDAÇÃO',
      badgeBg: '#1349EB',
      badgeTextColor: '#FFFFFF',
    },
    {
      step: '02',
      title: 'Hasheamento com Salt Secreto',
      description:
        'Nosso backend processa sua identificação com uma função hash criptográfica irreversível acoplada a um salt exclusivo.',
      badge: 'CRIPTOGRAFIA',
      badgeBg: '#009A5E',
      badgeTextColor: '#FFFFFF',
    },
    {
      step: '03',
      title: 'Desacoplamento Completo da Conta',
      description:
        'A avaliação é gravada em tabela isolada, sem chave estrangeira ligando o comentário ou nota ao seu e-mail ou perfil.',
      badge: 'PRIVACIDADE',
      badgeBg: '#F1C321',
      badgeTextColor: '#1F1F1F',
    },
    {
      step: '04',
      title: 'Métricas e Médias Auditáveis',
      description:
        'A comunidade acessa a distribuição consolidada de notas sem qualquer possibilidade de rastreio ou represália por docentes.',
      badge: 'SEGURANÇA',
      badgeBg: '#FE4141',
      badgeTextColor: '#FFFFFF',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>
              ANONIMATO CRIPTOGRÁFICO POR DESIGN
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Como garantimos matematicamente que sua identidade nunca é exposta
          </Text>
        </View>

        {/* Linha dos 4 passos sequenciais */}
        <View style={[styles.stepsGrid, isMobile && styles.stepsGridMobile]}>
          {steps.map((st, idx) => {
            const isHovered = hoveredStep === st.step;
            return (
              <View
                key={st.step}
                // @ts-ignore
                onMouseEnter={() => setHoveredStep(st.step)}
                // @ts-ignore
                onMouseLeave={() => setHoveredStep(null)}
                style={[
                  styles.stepCard,
                  isHovered && styles.stepCardHovered,
                ]}
              >
                <View style={styles.stepHeader}>
                  <Text style={styles.stepNumber}>{st.step}</Text>
                  <View style={[styles.stepBadge, { backgroundColor: st.badgeBg }]}>
                    <Text
                      style={[
                        styles.stepBadgeText,
                        { color: st.badgeTextColor },
                      ]}
                    >
                      {st.badge}
                    </Text>
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
            );
          })}
        </View>

        {/* Caixa de garantia estudantil sem emoji */}
        <View style={styles.guaranteeBox}>
          <View style={styles.guaranteeIconCircle}>
            <IconeEscudo size={26} color="#009A5E" />
          </View>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>Compromisso Estudantil de Dados</Text>
            <Text style={styles.guaranteeBody}>
              Nem os próprios desenvolvedores do UnBook possuem meios de associar seu perfil a uma avaliação específica. O código do pipeline de anonimato é totalmente aberto e auditável por qualquer estudante no GitHub.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#1349EB',
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
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
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    minHeight: 220,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  stepCardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
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
    fontSize: 12.5,
    color: '#555555',
    lineHeight: 18,
  },
  arrowIndicator: {
    position: 'absolute',
    right: -13,
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
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 22,
    alignItems: 'center',
    gap: 18,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
        } as any)
      : {}),
  },
  guaranteeIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6F8F0',
    borderWidth: 2,
    borderColor: '#009A5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  guaranteeBody: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 20,
  },
});

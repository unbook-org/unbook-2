import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

function ShieldIcon({ size = 26, color = '#1349EB' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CommunityIcon({ size = 26, color = '#009A5E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2.2" />
      <Path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function OpenCodeIcon({ size = 26, color = '#E67E22' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PilaresSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  const pilares = [
    {
      id: 'privacidade',
      title: 'ANONIMATO POR DESIGN',
      tag: 'PRIVACIDADE',
      tagBg: '#1349EB',
      icon: <ShieldIcon size={26} color="#1349EB" />,
      text: 'Sua voz importa, sua identidade é sua. Utilizamos autenticação via e-mail institucional @aluno.unb.br apenas para validar que você é um estudante real. O sistema separa criptograficamente seu login da sua avaliação antes de salvar no banco de dados.',
      footerTag: '🛡️ Autenticação via @aluno.unb.br',
    },
    {
      id: 'comunidade',
      title: 'ESPÍRITO COLABORATIVO',
      tag: 'COMUNIDADE',
      tagBg: '#009A5E',
      icon: <CommunityIcon size={26} color="#009A5E" />,
      text: 'Tudo o que está aqui é construído coletivamente. Das avaliações às provas antigas compartilhadas no módulo de materiais, a comunidade se ajuda mutuamente — de calouro a veterano.',
      footerTag: '👥 +12.400 contribuições este semestre',
    },
    {
      id: 'opensource',
      title: 'ABERTURA & OPEN SOURCE',
      tag: 'CÓDIGO ABERTO',
      tagBg: '#E67E22',
      icon: <OpenCodeIcon size={26} color="#E67E22" />,
      text: 'Código transparente e infraestrutura aberta. O UnBook é um bem público para a comunidade universitária, sem fins lucrativos. Qualquer estudante pode contribuir, auditar ou replicar o projeto.',
      footerTag: '⚖️ MIT License • GitHub público',
    },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>OS 3 PILARES FUNDAMENTAIS</Text>
          </View>
          <Text style={styles.subtitle}>
            Princípios inegociáveis que guiam cada decisão do projeto
          </Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          {pilares.map((pilar) => (
            <View key={pilar.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>{pilar.icon}</View>
                <View style={[styles.tagPill, { backgroundColor: pilar.tagBg }]}>
                  <Text style={styles.tagPillText}>{pilar.tag}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{pilar.title}</Text>
              <Text style={styles.cardText}>{pilar.text}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.footerTagText}>{pilar.footerTag}</Text>
              </View>
            </View>
          ))}
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
  cardsGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  cardsGridMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    justifyContent: 'space-between',
    minHeight: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  tagPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  cardText: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardFooter: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    paddingTop: 14,
  },
  footerTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#707070',
  },
});


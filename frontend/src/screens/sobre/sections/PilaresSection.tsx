import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import {
  IconeEscudo,
  IconeComunidade,
  IconeCodigoAberto,
  IconeCheck,
} from '../../../components/UnbookIcons';

export function PilaresSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;
  const [hoveredPilar, setHoveredPilar] = useState<string | null>(null);

  const pilares = [
    {
      id: 'privacidade',
      title: 'ANONIMATO POR DESIGN',
      tag: 'PRIVACIDADE',
      tagBg: '#1349EB',
      icon: <IconeEscudo size={24} color="#1349EB" />,
      text: 'Sua voz importa, e sua identidade é protegida. A autenticação via e-mail institucional @aluno.unb.br serve apenas para validar que você estuda na UnB. O sistema separa matematicamente seu login da sua avaliação antes de registrar no banco de dados.',
      footerTag: 'Autenticação exclusiva via @aluno.unb.br',
      footerIcon: <IconeCheck size={14} color="#009A5E" />,
    },
    {
      id: 'comunidade',
      title: 'ESPÍRITO COLABORATIVO',
      tag: 'COMUNIDADE',
      tagBg: '#009A5E',
      icon: <IconeComunidade size={24} color="#009A5E" />,
      text: 'Tudo o que existe aqui é construído coletivamente. Das avaliações sinceras de matérias aos arquivos de provas antigas e resumos compartilhados, calouros e veteranos fortalecem o mesmo ambiente.',
      footerTag: 'Mais de 12.400 contribuições registradas',
      footerIcon: <IconeCheck size={14} color="#009A5E" />,
    },
    {
      id: 'opensource',
      title: 'TRANSPARÊNCIA TOTAL',
      tag: 'CÓDIGO ABERTO',
      tagBg: '#F1C321',
      icon: <IconeCodigoAberto size={24} color="#1F1F1F" />,
      text: 'Código aberto e infraestrutura transparente. O UnBook é um bem público estudantil, sem fins lucrativos. Qualquer aluno pode auditar as linhas de código, sugerir melhorias ou colaborar diretamente no GitHub.',
      footerTag: 'Licença MIT aberta • Repositório público',
      footerIcon: <IconeCheck size={14} color="#009A5E" />,
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
            Princípios indispensáveis que guiam cada decisão da plataforma
          </Text>
        </View>

        <View style={[styles.cardsGrid, isMobile && styles.cardsGridMobile]}>
          {pilares.map((pilar) => {
            const isHovered = hoveredPilar === pilar.id;
            return (
              <View
                key={pilar.id}
                // @ts-ignore
                onMouseEnter={() => setHoveredPilar(pilar.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredPilar(null)}
                style={[
                  styles.card,
                  isHovered && styles.cardHovered,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>{pilar.icon}</View>
                  <View style={[styles.tagPill, { backgroundColor: pilar.tagBg }]}>
                    <Text
                      style={[
                        styles.tagPillText,
                        pilar.tagBg === '#F1C321' && styles.tagPillTextDark,
                      ]}
                    >
                      {pilar.tag}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{pilar.title}</Text>
                <Text style={styles.cardText}>{pilar.text}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.footerRow}>
                    {pilar.footerIcon}
                    <Text style={styles.footerTagText}>{pilar.footerTag}</Text>
                  </View>
                </View>
              </View>
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
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    justifyContent: 'space-between',
    minHeight: 300,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
          transition:
            'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  cardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '7px 7px 0px #1F1F1F',
        } as any)
      : {}),
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
  tagPillTextDark: {
    color: '#1F1F1F',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  cardText: {
    fontSize: 13.5,
    color: '#4A4A4A',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardFooter: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    paddingTop: 14,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555555',
  },
});

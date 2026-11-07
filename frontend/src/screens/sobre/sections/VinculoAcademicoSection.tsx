import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import {
  IconeCheck,
  IconeAlerta,
  IconeCadeado,
} from '../../../components/UnbookIcons';

export function VinculoAcademicoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  const transparenciaRows = [
    { label: 'Natureza:', value: 'Iniciativa independente organizada por estudantes da UnB' },
    { label: 'Relação com SIGAA:', value: 'Consulta dados públicos abertos • Sem vínculo institucional' },
    { label: 'Financiamento:', value: 'Totalmente voluntário • Sem fins lucrativos ou anúncios' },
    { label: 'Licença:', value: 'MIT License • Código-fonte 100% aberto e auditável' },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>VÍNCULO ACADÊMICO & TRANSPARÊNCIA</Text>
        </View>

        <View style={[styles.contentRow, isMobile && styles.contentRowMobile]}>
          {/* Card Esquerdo: Transparência Institucional */}
          <View style={styles.leftCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.greenCheckIcon}>
                <IconeCheck size={16} color="#009A5E" />
              </View>
              <Text style={styles.cardTitle}>COMPROMISSO ÉTICO E TRANSPARÊNCIA</Text>
            </View>

            <View style={styles.rowsList}>
              {transparenciaRows.map((row, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <View style={styles.rowValuePill}>
                    <Text style={styles.rowValueText}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Cards Direitos: Isenção e Privacidade */}
          <View style={styles.rightCardsColumn}>
            <View style={styles.warningCard}>
              <View style={styles.cardHeaderSmall}>
                <View style={styles.warningIconBox}>
                  <IconeAlerta size={15} color="#FE4141" />
                </View>
                <Text style={styles.warningCardTitle}>NOTA DE ISENÇÃO DE RESPONSABILIDADE</Text>
              </View>
              <Text style={styles.warningCardText}>
                O UnBook é uma plataforma autônoma e não representa canais ou posições oficiais da{' '}
                <Text style={styles.boldDark}>Universidade de Brasília (UnB)</Text>. Nosso objetivo é facilitar a colaboração e a organização do semestre entre colegas de curso.
              </Text>
            </View>

            <View style={styles.privacyCard}>
              <View style={styles.cardHeaderSmall}>
                <View style={styles.privacyIconBox}>
                  <IconeCadeado size={15} color="#1349EB" />
                </View>
                <Text style={styles.privacyCardTitle}>PROTEÇÃO DE DADOS & ANONIMATO</Text>
              </View>
              <Text style={styles.privacyCardText}>
                As avaliações são <Text style={styles.boldDark}>desacopladas criptograficamente</Text> do e-mail no momento do envio com chave hash irreversível. Nenhum professor, coordenador ou colega tem acesso à sua identidade.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 36,
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
  contentRow: {
    flexDirection: 'row',
    gap: 28,
  },
  contentRowMobile: {
    flexDirection: 'column',
    gap: 20,
  },
  leftCard: {
    flex: 1.1,
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
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  greenCheckIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E6F8F0',
    borderWidth: 1.5,
    borderColor: '#009A5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.4,
  },
  rowsList: {
    gap: 14,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#555555',
    width: 120,
  },
  rowValuePill: {
    flex: 1,
    backgroundColor: '#FCFAEC',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rowValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 16,
  },
  rightCardsColumn: {
    flex: 1,
    gap: 18,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  cardHeaderSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  warningIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5,
    borderColor: '#FE4141',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  warningCardText: {
    fontSize: 12.5,
    color: '#4A4A4A',
    lineHeight: 19,
  },
  privacyIconBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: '#1349EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1349EB',
    letterSpacing: 0.5,
  },
  privacyCardText: {
    fontSize: 12.5,
    color: '#4A4A4A',
    lineHeight: 19,
  },
  boldDark: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
});

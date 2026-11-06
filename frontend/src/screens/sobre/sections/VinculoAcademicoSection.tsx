import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export function VinculoAcademicoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  const transparenciaRows = [
    { label: 'Tipo:', value: 'Projeto de extensão universitária independente' },
    { label: 'Vínculo SIGAA:', value: 'Nenhum vínculo administrativo formal' },
    { label: 'Financiamento:', value: 'Voluntário — sem fins lucrativos' },
    { label: 'Licença:', value: 'MIT License — código 100% aberto' },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>VÍNCULO ACADÊMICO & EXTENSÃO</Text>
        </View>

        <View style={[styles.contentRow, isMobile && styles.contentRowMobile]}>
          <View style={styles.leftCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.greenCheckIcon}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Circle cx="12" cy="12" r="10" stroke="#009A5E" strokeWidth="2.5" />
                  <Path d="M8 12l3 3 5-5" stroke="#009A5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.cardTitle}>TRANSPARÊNCIA INSTITUCIONAL</Text>
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

          <View style={styles.rightCardsColumn}>
            <View style={styles.warningCard}>
              <View style={styles.cardHeaderSmall}>
                <Text style={styles.warningIcon}>⚠️</Text>
                <Text style={styles.warningCardTitle}>AVISO DE ISENÇÃO</Text>
              </View>
              <Text style={styles.warningCardText}>
                Não representamos posições oficiais da <Text style={styles.boldDark}>Universidade de Brasília (UnB)</Text>. Nosso foco é o apoio mútuo entre os estudantes no âmbito acadêmico. As informações exibidas têm caráter informativo e são extraídas de dados públicos do catálogo institucional ou fornecidas pelos próprios estudantes.
              </Text>
            </View>

            <View style={styles.privacyCard}>
              <View style={styles.cardHeaderSmall}>
                <Text style={styles.privacyIcon}>🔒</Text>
                <Text style={styles.privacyCardTitle}>DADOS & PRIVACIDADE</Text>
              </View>
              <Text style={styles.privacyCardText}>
                Avaliações são <Text style={styles.boldDark}>desvinculadas criptograficamente</Text> do usuário no momento do salvamento através de hashing irreversível. Nenhum dado pessoal sensível além da validação do domínio @aluno.unb.br é armazenado.
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
    backgroundColor: '#FF7A00',
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
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
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
    width: 110,
  },
  rowValuePill: {
    flex: 1,
    backgroundColor: '#F3EFE6',
    borderWidth: 1.5,
    borderColor: '#E2DCD2',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  rowValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  rightCardsColumn: {
    flex: 1,
    gap: 18,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#FF7A00',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  privacyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1349EB',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  cardHeaderSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  warningIcon: {
    fontSize: 14,
  },
  warningCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF7A00',
    letterSpacing: 0.5,
  },
  warningCardText: {
    fontSize: 12,
    color: '#4A4A4A',
    lineHeight: 18,
  },
  privacyIcon: {
    fontSize: 14,
  },
  privacyCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1349EB',
    letterSpacing: 0.5,
  },
  privacyCardText: {
    fontSize: 12,
    color: '#4A4A4A',
    lineHeight: 18,
  },
  boldDark: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
});


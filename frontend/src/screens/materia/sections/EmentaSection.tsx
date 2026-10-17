import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { MateriaDetalhe } from '../../../types/materia';
import { LARGURA_MAXIMA, sombra } from '../estilos';
import { IconeDocumento, IconeGrafico } from '../icones';

// Os indicadores dependem do módulo de avaliações, que ainda não expõe dados.
const INDICADORES_PANORAMA = ['DIDÁTICO', 'DIFICULDADE', 'MOLEZA'];

export function EmentaSection({ materia }: { materia: MateriaDetalhe }) {
  const { width } = useWindowDimensions();
  const empilhado = width < 820;

  return (
    <View style={[styles.linha, empilhado && styles.linhaEmpilhada]}>
      <View style={[styles.cartaoEmenta, !empilhado && styles.cartaoEmentaLargo]}>
        <View style={styles.barraTopoEmenta}>
          <View style={styles.tituloCartao}>
            <IconeDocumento />
            <Text style={styles.textoTitulo}>EMENTA DA DISCIPLINA</Text>
          </View>
          <View style={styles.tagSigaa}>
            <Text style={styles.textoTagSigaa}>SIGAA UNB</Text>
          </View>
        </View>
        <Text style={styles.ementa}>
          {materia.ementa || 'Ementa não informada pelo departamento no SIGAA.'}
        </Text>
      </View>

      <View style={[styles.cartaoPanorama, !empilhado && styles.cartaoPanoramaLargo]}>
        <View style={styles.tituloCartao}>
          <IconeGrafico />
          <Text style={[styles.textoTitulo, styles.textoTituloClaro]}>PANORAMA</Text>
          <View style={styles.badgeEmBreve}>
            <Text style={styles.textoBadgeEmBreve}>EM BREVE</Text>
          </View>
        </View>
        <Text style={styles.subtituloPanorama}>Métricas comunitárias</Text>
        {INDICADORES_PANORAMA.map((rotulo) => (
          <View key={rotulo} style={styles.indicador}>
            <Text style={styles.rotuloIndicador}>{rotulo}</Text>
            <Text style={styles.valorIndicador}>—</Text>
          </View>
        ))}
        <View style={styles.rodapePanorama}>
          <Text style={styles.semAvaliacoes}>Módulo de avaliações da comunidade UnB em breve.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 24,
  },
  linhaEmpilhada: {
    flexDirection: 'column',
  },
  cartaoEmenta: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 20,
    gap: 14,
    ...sombra(4),
  },
  cartaoEmentaLargo: {
    flex: 1,
  },
  barraTopoEmenta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.lightGray,
    paddingBottom: 10,
    gap: 12,
  },
  tagSigaa: {
    backgroundColor: theme.colors.beige,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoTagSigaa: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  tituloCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  textoTituloClaro: {
    color: theme.colors.white,
  },
  ementa: {
    fontSize: 14.5,
    lineHeight: 23,
    color: theme.colors.darkCharcoal,
  },
  cartaoPanorama: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 18,
    gap: 10,
    ...sombra(4),
  },
  cartaoPanoramaLargo: {
    width: 280,
  },
  subtituloPanorama: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.white,
    opacity: 0.85,
    letterSpacing: 0.5,
    marginTop: -4,
  },
  indicador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...sombra(2),
  },
  rotuloIndicador: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  valorIndicador: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.gray,
  },
  rodapePanorama: {
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 8,
    marginTop: 4,
  },
  semAvaliacoes: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.white,
    lineHeight: 16,
  },
  badgeEmBreve: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 'auto',
  },
  textoBadgeEmBreve: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
});

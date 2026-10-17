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
        <View style={styles.tituloCartao}>
          <IconeDocumento />
          <Text style={styles.textoTitulo}>Ementa</Text>
        </View>
        <Text style={styles.ementa}>{materia.ementa || 'Ementa não informada.'}</Text>
      </View>

      <View style={[styles.cartaoPanorama, !empilhado && styles.cartaoPanoramaLargo]}>
        <View style={styles.tituloCartao}>
          <IconeGrafico />
          <Text style={[styles.textoTitulo, styles.textoTituloClaro]}>Panorama</Text>
        </View>
        {INDICADORES_PANORAMA.map((rotulo) => (
          <View key={rotulo} style={styles.indicador}>
            <Text style={styles.rotuloIndicador}>{rotulo}</Text>
            <Text style={styles.valorIndicador}>—</Text>
          </View>
        ))}
        <Text style={styles.semAvaliacoes}>Ainda sem avaliações suficientes.</Text>
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
    gap: 12,
  },
  cartaoEmentaLargo: {
    flex: 1,
  },
  tituloCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  textoTituloClaro: {
    color: theme.colors.white,
  },
  ementa: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.darkCharcoal,
  },
  cartaoPanorama: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 16,
    gap: 10,
    ...sombra(4),
  },
  cartaoPanoramaLargo: {
    width: 260,
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
  },
  rotuloIndicador: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  valorIndicador: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.gray,
  },
  semAvaliacoes: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
  },
});

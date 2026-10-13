import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { MateriaDetalhe } from '../../../types/materia';
import { semestreAtual } from '../../../utils/horario';
import { coresMateria, LARGURA_MAXIMA } from '../estilos';
import { IconeCapelo, IconeVoltar } from '../icones';

interface BarraSuperiorProps {
  onVoltar: () => void;
}

export function BarraSuperior({ onVoltar }: BarraSuperiorProps) {
  return (
    <View style={styles.barra}>
      <View style={styles.barraConteudo}>
        <Pressable onPress={onVoltar} style={styles.voltar} accessibilityRole="button">
          <IconeVoltar />
          <Text style={styles.textoVoltar}>Voltar</Text>
        </Pressable>
        <View style={styles.barraDireita}>
          <Text style={styles.atualizacao}>Última atualização: hoje</Text>
          <View style={styles.seloSemestre}>
            <Text style={styles.textoSeloSemestre}>SEMESTRE {semestreAtual()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Indicador({ rotulo, valor, cor }: { rotulo: string; valor: string; cor: string }) {
  return (
    <View style={[styles.indicador, { backgroundColor: cor }]}>
      <Text style={styles.rotuloIndicador}>{rotulo}</Text>
      <Text style={styles.valorIndicador}>{valor}</Text>
    </View>
  );
}

export function CabecalhoMateria({ materia }: { materia: MateriaDetalhe }) {
  const { width } = useWindowDimensions();
  const compacto = width < 640;

  return (
    <View style={styles.cabecalho}>
      <View style={[styles.cabecalhoConteudo, compacto && styles.cabecalhoCompacto]}>
        <View style={styles.identificacao}>
          <View style={styles.selos}>
            <View style={styles.seloMaterias}>
              <Text style={styles.textoSeloMaterias}>MATÉRIAS</Text>
            </View>
            {materia.nivel_de_ensino && (
              <View style={styles.seloNivel}>
                <Text style={styles.textoSeloNivel}>{materia.nivel_de_ensino.toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.titulo, compacto && styles.tituloCompacto]} accessibilityRole="header">
            [{materia.codigo_materia}] {materia.nome}
          </Text>
          {materia.departamento && (
            <View style={styles.departamento}>
              <IconeCapelo />
              <Text style={styles.textoDepartamento}>
                {materia.departamento.codigo} - {materia.departamento.nome.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.indicadores}>
          <Indicador
            rotulo="CRÉDITOS"
            valor={String(materia.creditos).padStart(2, '0')}
            cor={theme.colors.warning}
          />
          <Indicador rotulo="HORAS" valor={`${materia.carga_horaria}h`} cor={coresMateria.horas} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: coresMateria.fundo,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
    paddingHorizontal: 16,
  },
  barraConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 10,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textoVoltar: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  barraDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  atualizacao: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  seloSemestre: {
    backgroundColor: theme.colors.danger,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textoSeloSemestre: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  cabecalho: {
    backgroundColor: coresMateria.fundo,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
    paddingHorizontal: 16,
  },
  cabecalhoConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 24,
    paddingVertical: 28,
  },
  cabecalhoCompacto: {
    flexDirection: 'column',
    gap: 20,
  },
  identificacao: {
    flexShrink: 1,
    gap: 8,
  },
  selos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  seloMaterias: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoSeloMaterias: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  seloNivel: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoSeloNivel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  tituloCompacto: {
    fontSize: 24,
  },
  departamento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textoDepartamento: {
    flexShrink: 1,
    fontSize: 13,
    color: theme.colors.darkCharcoal,
  },
  indicadores: {
    flexDirection: 'row',
    gap: 10,
  },
  indicador: {
    minWidth: 72,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rotuloIndicador: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
  },
  valorIndicador: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.dark,
  },
});

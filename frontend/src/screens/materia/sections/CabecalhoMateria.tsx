import React from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { MateriaDetalhe } from '../../../types/materia';
import {
  formatarNomeDepartamentoLimpo,
  formatarNomeProfessor,
} from '../../../utils/formatadorTexto';
import { semestreAtual } from '../../../utils/horario';
import { coresMateria, LARGURA_MAXIMA, sombra } from '../estilos';
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
          <Text style={styles.textoVoltar}>Voltar para a busca</Text>
        </Pressable>
        <View style={styles.barraDireita}>
          <Text style={styles.atualizacao}>Sincronizado com SIGAA</Text>
          <View style={styles.seloSemestre}>
            <Text style={styles.textoSeloSemestre}>SEMESTRE {semestreAtual()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function Indicador({
  rotulo,
  valor,
  cor,
  corTexto = theme.colors.dark,
}: {
  rotulo: string;
  valor: string;
  cor: string;
  corTexto?: string;
}) {
  const textoClaro = corTexto === theme.colors.white;
  return (
    <View style={[styles.indicador, { backgroundColor: cor }]}>
      <Text style={[styles.rotuloIndicador, textoClaro && styles.rotuloIndicadorClaro]}>
        {rotulo}
      </Text>
      <Text style={[styles.valorIndicador, { color: corTexto }]}>{valor}</Text>
    </View>
  );
}

interface CabecalhoMateriaProps {
  materia: MateriaDetalhe;
  onRolarParaSecao?: (secao: 'ementa' | 'requisitos' | 'turmas') => void;
}

export function CabecalhoMateria({ materia, onRolarParaSecao }: CabecalhoMateriaProps) {
  const { width } = useWindowDimensions();
  const compacto = width < 640;
  const totalTurmas = materia.turmas?.length ?? 0;
  const nomeMateriaFormatado = formatarNomeProfessor(materia.nome);
  const nomeDeptoFormatado = formatarNomeDepartamentoLimpo(materia.departamento?.nome);

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
            <View style={styles.seloAtiva}>
              <Text style={styles.textoSeloAtiva}>CATÁLOGO UNB</Text>
            </View>
          </View>
          <Text style={[styles.titulo, compacto && styles.tituloCompacto]} accessibilityRole="header">
            [{materia.codigo_materia}] {nomeMateriaFormatado}
          </Text>
          {materia.departamento && (
            <View style={styles.departamento}>
              <IconeCapelo />
              <Text style={styles.textoDepartamento}>
                {materia.departamento.codigo} • {nomeDeptoFormatado}
              </Text>
            </View>
          )}

          {/* Atalhos Rápidos para as seções da página */}
          <View style={styles.barraAtalhos}>
            <Pressable
              onPress={() => onRolarParaSecao?.('ementa')}
              style={styles.botaoAtalho}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoAtalho}>EMENTA</Text>
            </Pressable>
            <Pressable
              onPress={() => onRolarParaSecao?.('requisitos')}
              style={styles.botaoAtalho}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoAtalho}>REQUISITOS</Text>
            </Pressable>
            <Pressable
              onPress={() => onRolarParaSecao?.('turmas')}
              style={[styles.botaoAtalho, styles.botaoAtalhoTurmas]}
              accessibilityRole="button"
            >
              <Text style={[styles.textoBotaoAtalho, styles.textoBotaoAtalhoTurmas]}>
                TURMAS ({totalTurmas})
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.indicadores}>
          <Indicador
            rotulo="CRÉDITOS"
            valor={String(materia.creditos).padStart(2, '0')}
            cor={theme.colors.warning}
          />
          <Indicador rotulo="HORAS" valor={`${materia.carga_horaria}h`} cor={coresMateria.horas} />
          <Indicador
            rotulo="TURMAS"
            valor={String(totalTurmas).padStart(2, '0')}
            cor={theme.colors.secondary}
            corTexto={theme.colors.white}
          />
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
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transition: 'all 0.15s ease' } as object) : {}),
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
    ...sombra(2.5),
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
    ...sombra(3),
  },
  rotuloIndicador: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
  },
  rotuloIndicadorClaro: {
    color: theme.colors.white,
    opacity: 0.9,
  },
  valorIndicador: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  seloAtiva: {
    backgroundColor: theme.colors.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoSeloAtiva: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  barraAtalhos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  botaoAtalho: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoBotaoAtalho: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  botaoAtalhoTurmas: {
    backgroundColor: theme.colors.secondary,
  },
  textoBotaoAtalhoTurmas: {
    color: theme.colors.white,
  },
});

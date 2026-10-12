import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SeletorDepartamento } from '../../../components/SeletorDepartamento';
import { theme } from '../../../constants/theme';
import type { DepartamentoOpcao } from '../../../types/materia';
import { fonteMono, LARGURA_MAXIMA } from '../estilos';

export type TipoCatalogo = 'materias' | 'professores';

interface BarraFiltrosProps {
  tipo: TipoCatalogo;
  onTipo: (tipo: TipoCatalogo) => void;
  termo: string;
  onTermo: (termo: string) => void;
  departamentos: DepartamentoOpcao[] | null;
  carregandoDepartamentos: boolean;
  erroDepartamentos: string | null;
  departamentoId: string | null;
  onDepartamento: (departamentoId: string | null) => void;
  atalhos: DepartamentoOpcao[];
}

function Chip({ texto, ativo, onPress }: { texto: string; ativo: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={[styles.chip, ativo && styles.chipAtivo]}
    >
      <Text style={[styles.textoChip, ativo && styles.textoChipAtivo]}>{texto}</Text>
    </Pressable>
  );
}

export function BarraFiltros({
  tipo,
  onTipo,
  termo,
  onTermo,
  departamentos,
  carregandoDepartamentos,
  erroDepartamentos,
  departamentoId,
  onDepartamento,
  atalhos,
}: BarraFiltrosProps) {
  return (
    <View style={styles.barra}>
      <View style={styles.conteudo}>
        <View style={styles.linhaBusca}>
          <View style={styles.campoBusca}>
            <Text style={styles.iconeBusca}>⌕</Text>
            <TextInput
              value={termo}
              onChangeText={onTermo}
              placeholder={
                tipo === 'materias' ? 'Buscar matéria pelo nome ou código...' : 'Buscar professor...'
              }
              placeholderTextColor={theme.colors.gray}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              accessibilityLabel={tipo === 'materias' ? 'Buscar matérias' : 'Buscar professores'}
            />
          </View>
          <View style={styles.alternador} accessibilityRole="tablist">
            {(['materias', 'professores'] as const).map((opcao) => (
              <Pressable
                key={opcao}
                onPress={() => onTipo(opcao)}
                accessibilityRole="tab"
                accessibilityState={{ selected: tipo === opcao }}
                style={[styles.opcaoAlternador, tipo === opcao && styles.opcaoAtiva]}
              >
                <Text style={[styles.textoAlternador, tipo === opcao && styles.textoAtivo]}>
                  {opcao === 'materias' ? 'MATÉRIAS' : 'PROFESSORES'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.chips}>
          <Chip texto="TODOS" ativo={departamentoId === null} onPress={() => onDepartamento(null)} />
          {atalhos.map((departamento) => (
            <Chip
              key={departamento.id}
              texto={departamento.codigo}
              ativo={departamentoId === departamento.id}
              onPress={() => onDepartamento(departamento.id)}
            />
          ))}
        </View>

        <View style={styles.seletor}>
          <Text style={styles.rotuloSeletor}>▽ DEPARTAMENTO:</Text>
          <View style={styles.seletorCampo}>
            <SeletorDepartamento
              departamentos={departamentos}
              selecionadoId={departamentoId}
              onSelecionar={onDepartamento}
              carregando={carregandoDepartamentos}
              erro={erroDepartamentos}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: theme.colors.beige,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  conteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA - 240,
    alignSelf: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  linhaBusca: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  campoBusca: {
    flexGrow: 1,
    flexBasis: 320,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 12,
  },
  iconeBusca: {
    fontSize: 16,
    color: theme.colors.darkCharcoal,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.dark,
    paddingVertical: 9,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  alternador: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: theme.colors.dark,
  },
  opcaoAlternador: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: theme.colors.white,
    minHeight: 36,
  },
  opcaoAtiva: {
    backgroundColor: theme.colors.dark,
  },
  textoAlternador: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.dark,
  },
  textoAtivo: {
    color: theme.colors.white,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderWidth: 2,
    borderColor: theme.colors.dark,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipAtivo: {
    backgroundColor: theme.colors.dark,
  },
  textoChip: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.dark,
  },
  textoChipAtivo: {
    color: theme.colors.white,
  },
  seletor: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  rotuloSeletor: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.darkCharcoal,
  },
  seletorCampo: {
    flexGrow: 1,
    flexBasis: 260,
  },
});

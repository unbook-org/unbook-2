import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../constants/theme';
import { useConsulta } from '../../../hooks/useConsulta';
import { buscarMaterias } from '../../../services/api';
import type { DepartamentoOpcao } from '../../../types/materia';
import { CartaoMateria, CartaoVerMais } from '../components/Cartoes';
import { corDoCartao, fonteMono, LARGURA_MAXIMA } from '../estilos';

const ITENS_POR_PRATELEIRA = 8;

interface PrateleiraProps {
  departamento: DepartamentoOpcao;
  onSelectMateria: (codigo: string) => void;
  onVerTodas: () => void;
}

export function Prateleira({ departamento, onSelectMateria, onVerTodas }: PrateleiraProps) {
  const { dados, carregando, erro } = useConsulta(
    (sinal) =>
      buscarMaterias(
        {
          termo: '',
          departamentoId: departamento.id,
          pagina: 1,
          tamanhoPagina: ITENS_POR_PRATELEIRA,
        },
        sinal,
      ),
    [departamento.id],
  );
  const total = departamento.total_materias.toLocaleString('pt-BR');

  return (
    <View style={styles.prateleira}>
      <View style={styles.cabecalho}>
        <View style={styles.titulo}>
          <View
            style={[styles.marcador, { backgroundColor: corDoCartao(departamento.codigo).fundo }]}
          />
          <View style={styles.textos}>
            <Text style={styles.textoTitulo} accessibilityRole="header">
              {departamento.nome}
            </Text>
            <Text style={styles.subtitulo}>◎ {departamento.codigo}</Text>
          </View>
        </View>
        <View style={styles.acoes}>
          <Text style={styles.total}>{total} MATÉRIAS</Text>
          <Pressable onPress={onVerTodas} style={styles.botaoVerTodas} accessibilityRole="button">
            <Text style={styles.textoVerTodas}>VER TODAS ›</Text>
          </Pressable>
        </View>
      </View>

      {carregando && <ActivityIndicator color={theme.colors.secondary} style={styles.carregando} />}
      {!carregando && erro && <Text style={styles.erro}>{erro}</Text>}
      {!carregando && dados && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cartoes}
        >
          {dados.items.map((materia) => (
            <CartaoMateria
              key={`${materia.codigo_materia}-${materia.nome}`}
              materia={materia}
              onPress={() => onSelectMateria(materia.codigo_materia)}
            />
          ))}
          <CartaoVerMais onPress={onVerTodas} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  prateleira: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  titulo: {
    flexDirection: 'row',
    gap: 10,
    flexShrink: 1,
  },
  marcador: {
    width: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
  },
  textos: {
    flexShrink: 1,
  },
  textoTitulo: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: theme.colors.dark,
    textTransform: 'uppercase',
  },
  subtitulo: {
    fontFamily: fonteMono,
    fontSize: 10,
    color: theme.colors.darkCharcoal,
  },
  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  total: {
    fontFamily: fonteMono,
    fontSize: 10,
    letterSpacing: 1,
    color: theme.colors.darkCharcoal,
  },
  botaoVerTodas: {
    borderWidth: 2,
    borderColor: theme.colors.dark,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textoVerTodas: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.dark,
  },
  carregando: {
    marginVertical: 48,
  },
  erro: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.danger,
  },
  cartoes: {
    gap: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
});

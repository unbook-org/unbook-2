import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { theme } from '../constants/theme';
import type { DepartamentoOpcao } from '../types/materia';
import { formatarNomeDepartamentoLimpo } from '../utils/formatadorTexto';

interface SeletorDepartamentoProps {
  departamentos: DepartamentoOpcao[] | null;
  selecionadoId: string | null;
  onSelecionar: (departamentoId: string | null) => void;
  carregando?: boolean;
  erro?: string | null;
}

function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export function SeletorDepartamento({
  departamentos,
  selecionadoId,
  onSelecionar,
  carregando = false,
  erro = null,
}: SeletorDepartamentoProps) {
  const [aberto, setAberto] = useState(false);
  const [filtro, setFiltro] = useState('');

  const selecionado = departamentos?.find((departamento) => departamento.id === selecionadoId);
  const opcoes = useMemo(() => {
    const filtroNormalizado = normalizar(filtro.trim());
    return (departamentos ?? []).filter((departamento) =>
      normalizar(`${departamento.codigo} ${departamento.nome}`).includes(filtroNormalizado),
    );
  }, [departamentos, filtro]);

  const escolher = (departamentoId: string | null) => {
    onSelecionar(departamentoId);
    setAberto(false);
    setFiltro('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <Pressable
          onPress={() => setAberto((anterior) => !anterior)}
          style={styles.botao}
          accessibilityRole="button"
          accessibilityLabel="Escolher departamento"
          disabled={carregando || !!erro}
        >
          <Text style={styles.rotulo}>Departamento:</Text>
          <Text style={styles.valor} numberOfLines={1}>
            {carregando
              ? 'carregando...'
              : erro
                ? 'indisponível'
                : selecionado
                  ? `${selecionado.codigo} — ${formatarNomeDepartamentoLimpo(selecionado.nome)}`
                  : 'Todos'}
          </Text>
          <Text style={styles.seta}>{aberto ? '▲' : '▼'}</Text>
        </Pressable>
        {selecionado && (
          <Pressable
            onPress={() => escolher(null)}
            style={styles.limpar}
            accessibilityRole="button"
            accessibilityLabel="Remover filtro de departamento"
          >
            <Text style={styles.textoLimpar}>✕</Text>
          </Pressable>
        )}
      </View>

      {aberto && (
        <View style={styles.painel}>
          <TextInput
            value={filtro}
            onChangeText={setFiltro}
            placeholder="Filtrar departamentos..."
            placeholderTextColor={theme.colors.gray}
            style={styles.filtro}
            autoFocus
            autoCorrect={false}
          />
          {carregando && <ActivityIndicator color={theme.colors.primary} />}
          <ScrollView style={styles.lista} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            <Opcao texto="Todos os departamentos" onPress={() => escolher(null)} />
            {opcoes.map((departamento) => (
              <Opcao
                key={departamento.id}
                texto={`${departamento.codigo} — ${formatarNomeDepartamentoLimpo(departamento.nome)}`}
                detalhe={`${departamento.total_materias} matérias`}
                ativa={departamento.id === selecionadoId}
                onPress={() => escolher(departamento.id)}
              />
            ))}
            {opcoes.length === 0 && (
              <Text style={styles.semOpcoes}>Nenhum departamento encontrado.</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

interface OpcaoProps {
  texto: string;
  detalhe?: string;
  ativa?: boolean;
  onPress: () => void;
}

function Opcao({ texto, detalhe, ativa = false, onPress }: OpcaoProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.opcao, (pressed || ativa) && styles.opcaoAtiva]}
      accessibilityRole="button"
    >
      <Text style={styles.textoOpcao}>{texto}</Text>
      {detalhe && <Text style={styles.detalheOpcao}>{detalhe}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  linha: {
    flexDirection: 'row',
    gap: 8,
  },
  botao: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  valor: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  seta: {
    fontSize: 11,
    color: theme.colors.dark,
  },
  limpar: {
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: theme.colors.beige,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
  },
  textoLimpar: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  painel: {
    marginTop: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
    padding: 8,
    gap: 6,
  },
  filtro: {
    borderWidth: 1.5,
    borderColor: theme.colors.lightGray,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.dark,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  lista: {
    maxHeight: 260,
  },
  opcao: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  },
  opcaoAtiva: {
    backgroundColor: theme.colors.beige,
  },
  textoOpcao: {
    fontSize: 14,
    color: theme.colors.dark,
  },
  detalheOpcao: {
    fontSize: 12,
    color: theme.colors.gray,
    marginTop: 2,
  },
  semOpcoes: {
    padding: 10,
    fontSize: 13,
    color: theme.colors.gray,
  },
});

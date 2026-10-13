import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SeletorDepartamento } from '../../../components/SeletorDepartamento';
import { theme } from '../../../constants/theme';
import { useConsulta } from '../../../hooks/useConsulta';
import {
  TAMANHO_MINIMO_BUSCA,
  buscarMaterias,
  listarDepartamentos,
} from '../../../services/api';
import type { MateriaResumo } from '../../../types/materia';
import { nivelDaApi, type NivelEnsino } from '../../../utils/nivelEnsino';

const ATRASO_BUSCA_MS = 350;

interface SearchSectionProps {
  onSelectMateria: (codigo: string, nivel?: NivelEnsino) => void;
}

export function SearchSection({ onSelectMateria }: SearchSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const [termo, setTermo] = useState('');
  const [departamentoId, setDepartamentoId] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const termoLimpo = termo.trim();
  const termoCurto = termoLimpo.length > 0 && termoLimpo.length < TAMANHO_MINIMO_BUSCA;
  const buscaAtiva = !termoCurto && (termoLimpo.length > 0 || departamentoId !== null);

  const departamentos = useConsulta((sinal) => listarDepartamentos(sinal), []);
  const { dados, carregando, erro } = useConsulta(
    buscaAtiva
      ? (sinal) => buscarMaterias({ termo: termoLimpo, departamentoId, pagina }, sinal)
      : null,
    [termoLimpo, departamentoId, pagina],
    ATRASO_BUSCA_MS,
  );

  const alterarTermo = (novoTermo: string) => {
    setTermo(novoTermo);
    setPagina(1);
  };

  const alterarDepartamento = (novoDepartamentoId: string | null) => {
    setDepartamentoId(novoDepartamentoId);
    setPagina(1);
  };

  return (
    <View
      nativeID="search-section"
      // @ts-ignore - ID para ancoragem suave na web
      id="search-section"
      style={styles.sectionWrapper}
    >
      <View style={[styles.card, isMobile && styles.cardMobile]}>
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Encontre qualquer matéria da UnB
        </Text>
        <Text style={styles.subtitle}>
          Busque pelo nome ou código, com ou sem acento, ou escolha um departamento.
        </Text>

        <SeletorDepartamento
          departamentos={departamentos.dados}
          selecionadoId={departamentoId}
          onSelecionar={alterarDepartamento}
          carregando={departamentos.carregando}
          erro={departamentos.erro}
        />

        <TextInput
          value={termo}
          onChangeText={alterarTermo}
          placeholder="Ex.: cálculo, CIC0004, estruturas de dados..."
          placeholderTextColor={theme.colors.gray}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Buscar matérias"
        />

        <View style={styles.resultados}>
          {termoCurto && (
            <Text style={styles.aviso}>
              Digite pelo menos {TAMANHO_MINIMO_BUSCA} caracteres.
            </Text>
          )}
          {buscaAtiva && carregando && (
            <ActivityIndicator color={theme.colors.primary} style={styles.carregando} />
          )}
          {buscaAtiva && !carregando && erro && <Text style={styles.erro}>{erro}</Text>}
          {buscaAtiva && !carregando && dados && (
            <>
              <Text style={styles.total}>
                {dados.meta.total_items === 0
                  ? 'Nenhuma matéria encontrada.'
                  : `${dados.meta.total_items} ${
                      dados.meta.total_items === 1 ? 'matéria encontrada' : 'matérias encontradas'
                    }`}
              </Text>
              {dados.items.map((materia) => (
                <ItemMateria
                  key={`${materia.codigo_materia}-${materia.nivel_de_ensino ?? materia.nome}`}
                  materia={materia}
                  onPress={() =>
                    onSelectMateria(
                      materia.codigo_materia,
                      nivelDaApi(materia.nivel_de_ensino) ?? undefined,
                    )
                  }
                />
              ))}
              {dados.meta.total_pages > 1 && (
                <Paginacao
                  pagina={dados.meta.page}
                  totalPaginas={dados.meta.total_pages}
                  onMudar={setPagina}
                />
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  onMudar: (pagina: number) => void;
}

function Paginacao({ pagina, totalPaginas, onMudar }: PaginacaoProps) {
  return (
    <View style={styles.paginacao}>
      <BotaoPagina
        texto="← Anterior"
        desabilitado={pagina <= 1}
        onPress={() => onMudar(pagina - 1)}
      />
      <Text style={styles.textoPagina}>
        Página {pagina} de {totalPaginas}
      </Text>
      <BotaoPagina
        texto="Próxima →"
        desabilitado={pagina >= totalPaginas}
        onPress={() => onMudar(pagina + 1)}
      />
    </View>
  );
}

function BotaoPagina({
  texto,
  desabilitado,
  onPress,
}: {
  texto: string;
  desabilitado: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      style={[styles.botaoPagina, desabilitado && styles.botaoPaginaDesabilitado]}
      accessibilityRole="button"
    >
      <Text style={styles.textoBotaoPagina}>{texto}</Text>
    </Pressable>
  );
}

function ItemMateria({ materia, onPress }: { materia: MateriaResumo; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressionado]}
      accessibilityRole="button"
    >
      <Text style={styles.itemCodigo}>{materia.codigo_materia}</Text>
      <View style={styles.itemTextos}>
        <Text style={styles.itemNome}>{materia.nome}</Text>
        {materia.departamento && (
          <Text style={styles.itemDepartamento}>{materia.departamento.nome}</Text>
        )}
      </View>
    </Pressable>
  );
}

const sombra = (deslocamento: number) =>
  Platform.OS === 'web'
    ? ({ boxShadow: `${deslocamento}px ${deslocamento}px 0px ${theme.colors.dark}` } as object)
    : {};

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: theme.colors.white,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
    ...(Platform.OS === 'web'
      ? ({
          scrollMarginTop: '30px',
        } as any)
      : {}),
  },
  card: {
    width: '100%',
    maxWidth: 820,
    minHeight: 400,
    backgroundColor: theme.colors.cream,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 8,
    paddingVertical: 36,
    paddingHorizontal: 32,
    ...sombra(6),
  },
  cardMobile: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleMobile: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.gray,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.dark,
    ...sombra(3),
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  resultados: {
    marginTop: 20,
    gap: 10,
  },
  aviso: {
    fontSize: 13,
    color: theme.colors.gray,
  },
  erro: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.danger,
  },
  carregando: {
    marginTop: 12,
  },
  total: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.gray,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...sombra(3),
  },
  itemPressionado: {
    backgroundColor: theme.colors.beige,
  },
  itemCodigo: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
    minWidth: 72,
  },
  itemTextos: {
    flex: 1,
  },
  itemNome: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  textoPagina: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.gray,
  },
  botaoPagina: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  botaoPaginaDesabilitado: {
    opacity: 0.35,
  },
  textoBotaoPagina: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  itemDepartamento: {
    fontSize: 12,
    color: theme.colors.gray,
    marginTop: 2,
  },
});

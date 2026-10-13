import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { theme } from '../../../constants/theme';
import { useConsulta } from '../../../hooks/useConsulta';
import { buscarMaterias, listarProfessores, TAMANHO_MINIMO_BUSCA } from '../../../services/api';
import type { Pagina } from '../../../types/materia';
import { CartaoMateria, CartaoProfessor } from '../components/Cartoes';
import { fonteMono, LARGURA_MAXIMA } from '../estilos';

const ATRASO_BUSCA_MS = 350;
const ITENS_POR_PAGINA = 20;
const ESPACO = 16;
const MARGEM = 20;
const LARGURA_CONTEUDO = LARGURA_MAXIMA - 240;

function useLarguraCartao() {
  const { width } = useWindowDimensions();
  const conteudo = Math.min(width - MARGEM * 2, LARGURA_CONTEUDO);
  const colunas = conteudo >= 960 ? 4 : conteudo >= 700 ? 3 : conteudo >= 440 ? 2 : 1;
  return { conteudo, largura: (conteudo - ESPACO * (colunas - 1)) / colunas };
}

function Paginacao({
  pagina,
  totalPaginas,
  onPagina,
}: {
  pagina: number;
  totalPaginas: number;
  onPagina: (pagina: number) => void;
}) {
  if (totalPaginas <= 1) {
    return null;
  }
  return (
    <View style={styles.paginacao}>
      <Pressable
        onPress={() => onPagina(pagina - 1)}
        disabled={pagina <= 1}
        style={[styles.botaoPagina, pagina <= 1 && styles.desabilitado]}
        accessibilityRole="button"
        accessibilityLabel="Página anterior"
      >
        <Text style={styles.textoBotaoPagina}>‹ ANTERIOR</Text>
      </Pressable>
      <Text style={styles.textoPagina}>
        {pagina} / {totalPaginas}
      </Text>
      <Pressable
        onPress={() => onPagina(pagina + 1)}
        disabled={pagina >= totalPaginas}
        style={[styles.botaoPagina, pagina >= totalPaginas && styles.desabilitado]}
        accessibilityRole="button"
        accessibilityLabel="Próxima página"
      >
        <Text style={styles.textoBotaoPagina}>PRÓXIMA ›</Text>
      </Pressable>
    </View>
  );
}

function Aviso({ texto }: { texto: string }) {
  return (
    <View style={styles.aviso}>
      <Text style={styles.textoAviso}>{texto}</Text>
    </View>
  );
}

function Grade<Item>({
  titulo,
  dados,
  renderizar,
  onPagina,
}: {
  titulo: string;
  dados: Pagina<Item>;
  renderizar: (item: Item, largura: number) => React.ReactNode;
  onPagina: (pagina: number) => void;
}) {
  const { conteudo, largura } = useLarguraCartao();
  const total = dados.meta.total_items;

  return (
    <View style={[styles.secao, { width: conteudo }]}>
      <Text style={styles.total}>
        {total.toLocaleString('pt-BR')} {titulo}
        {total === 1 ? '' : 'S'}
      </Text>
      {total === 0 ? (
        <Aviso texto="Nada encontrado com esses filtros." />
      ) : (
        <View style={styles.grade}>{dados.items.map((item) => renderizar(item, largura))}</View>
      )}
      <Paginacao
        pagina={dados.meta.page}
        totalPaginas={dados.meta.total_pages}
        onPagina={onPagina}
      />
    </View>
  );
}

interface ResultadosMateriasProps {
  termo: string;
  departamentoId: string | null;
  pagina: number;
  onPagina: (pagina: number) => void;
  onSelectMateria: (codigo: string) => void;
}

export function ResultadosMaterias({
  termo,
  departamentoId,
  pagina,
  onPagina,
  onSelectMateria,
}: ResultadosMateriasProps) {
  const termoCurto = termo.length > 0 && termo.length < TAMANHO_MINIMO_BUSCA;
  const { dados, carregando, erro } = useConsulta(
    termoCurto
      ? null
      : (sinal) =>
          buscarMaterias(
            { termo, departamentoId, pagina, tamanhoPagina: ITENS_POR_PAGINA },
            sinal,
          ),
    [termo, departamentoId, pagina],
    ATRASO_BUSCA_MS,
  );

  if (termoCurto) {
    return <Aviso texto={`Digite pelo menos ${TAMANHO_MINIMO_BUSCA} caracteres para buscar.`} />;
  }
  if (carregando) {
    return <ActivityIndicator color={theme.colors.secondary} style={styles.carregando} />;
  }
  if (erro || !dados) {
    return <Aviso texto={erro ?? 'Não foi possível carregar as matérias.'} />;
  }
  return (
    <Grade
      titulo="MATÉRIA"
      dados={dados}
      onPagina={onPagina}
      renderizar={(materia, largura) => (
        <CartaoMateria
          key={`${materia.codigo_materia}-${materia.nome}`}
          materia={materia}
          largura={largura}
          onPress={() => onSelectMateria(materia.codigo_materia)}
        />
      )}
    />
  );
}

interface ResultadosProfessoresProps {
  termo: string;
  departamentoCodigo: string | null;
  pagina: number;
  onPagina: (pagina: number) => void;
}

export function ResultadosProfessores({
  termo,
  departamentoCodigo,
  pagina,
  onPagina,
}: ResultadosProfessoresProps) {
  const { dados, carregando, erro } = useConsulta(
    (sinal) =>
      listarProfessores(
        { termo, departamentoCodigo, pagina, tamanhoPagina: ITENS_POR_PAGINA },
        sinal,
      ),
    [termo, departamentoCodigo, pagina],
    ATRASO_BUSCA_MS,
  );

  if (carregando) {
    return <ActivityIndicator color={theme.colors.secondary} style={styles.carregando} />;
  }
  if (erro) {
    return <Aviso texto={erro} />;
  }
  if (!dados) {
    return <Aviso texto="A lista de professores ainda não está disponível. Volte em breve!" />;
  }
  return (
    <Grade
      titulo="PROFESSOR"
      dados={dados}
      onPagina={onPagina}
      renderizar={(professor, largura) => (
        <CartaoProfessor key={professor.id} professor={professor} largura={largura} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  secao: {
    alignSelf: 'center',
    gap: 16,
  },
  total: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.darkCharcoal,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACO,
  },
  carregando: {
    marginVertical: 64,
  },
  aviso: {
    width: '100%',
    maxWidth: LARGURA_CONTEUDO,
    alignSelf: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 20,
  },
  textoAviso: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  botaoPagina: {
    borderWidth: 2,
    borderColor: theme.colors.dark,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  desabilitado: {
    opacity: 0.4,
  },
  textoBotaoPagina: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.dark,
  },
  textoPagina: {
    fontFamily: fonteMono,
    fontSize: 11,
    color: theme.colors.darkCharcoal,
  },
});

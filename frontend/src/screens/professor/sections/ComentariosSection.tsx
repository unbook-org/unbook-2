import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CartoonButton } from '../../../components/CartoonButton';
import { theme } from '../../../constants/theme';
import type { AvaliacaoComentario } from '../../../types/professor';
import { coresProfessor, LARGURA_MAXIMA, sombra } from '../estilos';
import {
  IconeDenuncia,
  IconeEnviar,
  IconeEstrela,
  IconeFiltro,
  IconeThumbsDown,
  IconeThumbsUp,
} from '../icones';

interface ComentariosSectionProps {
  avaliacoes: AvaliacaoComentario[];
  onAdicionarComentario?: (comentario: AvaliacaoComentario) => void;
}

export function ComentariosSection({
  avaliacoes,
  onAdicionarComentario,
}: ComentariosSectionProps) {
  const [novoComentario, setNovoComentario] = useState('');
  const [ordem, setOrdem] = useState<'recentes' | 'melhores' | 'piores'>('recentes');
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [limiteExibicao, setLimiteExibicao] = useState(4);

  // Estados locais para contagem de reações (upvote/downvote)
  const [votos, setVotos] = useState<Record<string, { upvotes: number; downvotes: number; votou: 'up' | 'down' | null }>>({});

  const handleVotar = (id: string, tipo: 'up' | 'down', upInicial: number, downInicial: number) => {
    setVotos((prev) => {
      const atual = prev[id] ?? { upvotes: upInicial, downvotes: downInicial, votou: null };
      if (atual.votou === tipo) {
        // Remove voto
        return {
          ...prev,
          [id]: {
            upvotes: tipo === 'up' ? atual.upvotes - 1 : atual.upvotes,
            downvotes: tipo === 'down' ? atual.downvotes - 1 : atual.downvotes,
            votou: null,
          },
        };
      }
      return {
        ...prev,
        [id]: {
          upvotes:
            tipo === 'up'
              ? atual.votou === 'down'
                ? atual.upvotes + 1
                : atual.upvotes + 1
              : atual.votou === 'up'
              ? atual.upvotes - 1
              : atual.upvotes,
          downvotes:
            tipo === 'down'
              ? atual.votou === 'up'
                ? atual.downvotes + 1
                : atual.downvotes + 1
              : atual.votou === 'down'
              ? atual.downvotes - 1
              : atual.downvotes,
          votou: tipo,
        },
      };
    });
  };

  const handleDenunciar = () => {
    const msg = 'Comentário denunciado para a moderação da comunidade UnBook.';
    if (Platform.OS === 'web') {
      window.alert(msg);
    } else {
      Alert.alert('Denúncia Recebida', msg);
    }
  };

  const handleEnviar = () => {
    if (!novoComentario.trim()) return;

    if (onAdicionarComentario) {
      const nova: AvaliacaoComentario = {
        id: String(Date.now()),
        autor_anonimo: `Anônimo #${Math.floor(1000 + Math.random() * 9000)}`,
        curso_autor: 'Engenharia de Software',
        semestre: '2026.2',
        nota_didatica: 4,
        nota_dificuldade: 3,
        comentario: novoComentario.trim(),
        emoji_vibe: 'top',
        cobra_presenca: true,
        avaliacao_justa: true,
        upvotes: 1,
        downvotes: 0,
        criado_em: new Date().toISOString(),
      };
      onAdicionarComentario(nova);
    }
    setNovoComentario('');
  };

  // Ordenação das avaliações
  const avaliacoesOrdenadas = [...avaliacoes].sort((a, b) => {
    if (ordem === 'melhores') return b.nota_didatica - a.nota_didatica;
    if (ordem === 'piores') return a.nota_didatica - b.nota_didatica;
    // Mais recentes
    return new Date(b.criado_em ?? 0).getTime() - new Date(a.criado_em ?? 0).getTime();
  });

  const visiveis = avaliacoesOrdenadas.slice(0, limiteExibicao);

  return (
    <View style={styles.container}>
      {/* Cabeçalho da Seção de Comentários */}
      <View style={styles.topoComentarios}>
        <View style={styles.tituloBloco}>
          <Text style={styles.tituloComentarios}>COMENTÁRIOS</Text>
          <View style={styles.subtituloLinha}>
            <View style={styles.barraVerdeVertical} />
            <Text style={styles.subtituloComentarios}>
              Relatos reais sobre a experiência em sala.
            </Text>
          </View>
        </View>

        {/* Controles de Filtro e Ordenação */}
        <View style={styles.controlesLinha}>
          <Pressable
            onPress={() => setFiltroAberto(!filtroAberto)}
            style={styles.botaoDropdown}
            accessibilityRole="button"
          >
            <Text style={styles.textoDropdown}>
              {ordem === 'recentes'
                ? 'MAIS RECENTES'
                : ordem === 'melhores'
                ? 'MELHORES NOTAS'
                : 'PIORES NOTAS'}{' '}
              ▾
            </Text>
          </Pressable>

          {filtroAberto && (
            <View style={styles.menuDropdown}>
              <Pressable
                onPress={() => {
                  setOrdem('recentes');
                  setFiltroAberto(false);
                }}
                style={styles.itemDropdown}
              >
                <Text style={styles.textoItemDropdown}>MAIS RECENTES</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setOrdem('melhores');
                  setFiltroAberto(false);
                }}
                style={styles.itemDropdown}
              >
                <Text style={styles.textoItemDropdown}>MELHORES NOTAS</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setOrdem('piores');
                  setFiltroAberto(false);
                }}
                style={styles.itemDropdown}
              >
                <Text style={styles.textoItemDropdown}>PIORES NOTAS</Text>
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={() => setFiltroAberto(!filtroAberto)}
            style={styles.botaoIconeFiltro}
            accessibilityRole="button"
            accessibilityLabel="Filtrar comentários"
          >
            <IconeFiltro />
          </Pressable>
        </View>
      </View>

      {/* Caixa de Entrada de Novo Comentário */}
      <View style={styles.caixaInput}>
        <TextInput
          placeholder="Digite aqui..."
          placeholderTextColor="#8C8C85"
          value={novoComentario}
          onChangeText={setNovoComentario}
          multiline
          style={styles.inputComentario}
        />
        <View style={styles.linhaBotaoEnviar}>
          <Pressable
            onPress={handleEnviar}
            style={styles.botaoEnviar}
            accessibilityRole="button"
            accessibilityLabel="Enviar comentário"
          >
            <IconeEnviar />
          </Pressable>
        </View>
      </View>

      {/* Lista de Comentários */}
      <View style={styles.listaComentarios}>
        {visiveis.map((av, index) => {
          const votoState = votos[av.id] ?? {
            upvotes: av.upvotes,
            downvotes: av.downvotes,
            votou: null,
          };
          const corAvatar =
            coresProfessor.avatares[index % coresProfessor.avatares.length];
          const inicial = av.autor_anonimo.replace('Anônimo #', '')[0] || 'A';

          return (
            <View key={av.id} style={styles.cartaoComentario}>
              {/* Topo do Comentário */}
              <View style={styles.comentarioTopo}>
                <View style={styles.autorLinha}>
                  {/* Avatar Quadrado com Inicial */}
                  <View style={[styles.avatarAutor, { backgroundColor: corAvatar }]}>
                    <Text style={styles.avatarAutorTexto}>{inicial}</Text>
                  </View>

                  <View style={styles.autorInfo}>
                    <View style={styles.autorNomeLinha}>
                      <Text style={styles.autorNome}>{av.autor_anonimo}</Text>
                      {av.semestre && (
                        <Text style={styles.autorSemestre}>{av.semestre}</Text>
                      )}
                    </View>
                    <Text style={styles.autorCurso}>
                      {av.curso_autor || 'Universidade de Brasília'}
                    </Text>
                  </View>
                </View>

                {/* Badge de Nota com Estrela */}
                <View style={styles.badgeNota}>
                  <IconeEstrela tamanho={14} cor="#1F1F1F" />
                  <Text style={styles.textoBadgeNota}>
                    {av.nota_didatica.toFixed(1)}
                  </Text>
                </View>
              </View>

              {/* Texto do Comentário */}
              <Text style={styles.textoComentario}>{av.comentario}</Text>

              {/* Linha Divisória */}
              <View style={styles.divisorComentario} />

              {/* Rodapé: Upvote, Downvote e Denunciar */}
              <View style={styles.comentarioRodape}>
                <View style={styles.botoesReacao}>
                  <Pressable
                    onPress={() =>
                      handleVotar(av.id, 'up', av.upvotes, av.downvotes)
                    }
                    style={[
                      styles.botaoReacao,
                      votoState.votou === 'up' && styles.botaoReacaoAtivo,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Curtir comentário (${votoState.upvotes})`}
                  >
                    <IconeThumbsUp />
                    <Text style={styles.textoReacao}>{votoState.upvotes}</Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      handleVotar(av.id, 'down', av.upvotes, av.downvotes)
                    }
                    style={[
                      styles.botaoReacao,
                      votoState.votou === 'down' && styles.botaoReacaoAtivo,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Não curtir comentário (${votoState.downvotes})`}
                  >
                    <IconeThumbsDown />
                    <Text style={styles.textoReacao}>{votoState.downvotes}</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleDenunciar}
                  style={styles.botaoDenunciar}
                  accessibilityRole="button"
                >
                  <IconeDenuncia />
                  <Text style={styles.textoDenunciar}>DENUNCIAR</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {/* Botão Carregar Mais Comentários */}
      {visiveis.length < avaliacoesOrdenadas.length && (
        <View style={styles.carregarMaisContainer}>
          <CartoonButton
            variant="white"
            size="md"
            onPress={() => setLimiteExibicao((prev) => prev + 4)}
            style={styles.botaoCarregarMais}
            textStyle={styles.textoCarregarMais}
          >
            CARREGAR MAIS COMENTÁRIOS
          </CartoonButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    paddingVertical: 24,
  },
  topoComentarios: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  tituloBloco: {
    gap: 4,
  },
  tituloComentarios: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  subtituloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barraVerdeVertical: {
    width: 4,
    height: 16,
    backgroundColor: coresProfessor.verde,
  },
  subtituloComentarios: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.darkCharcoal,
  },
  controlesLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    zIndex: 50,
  },
  botaoDropdown: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoDropdown: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  botaoIconeFiltro: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 8,
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  menuDropdown: {
    position: 'absolute',
    top: 42,
    right: 44,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    width: 160,
    ...sombra(3),
    zIndex: 60,
  },
  itemDropdown: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  textoItemDropdown: {
    fontSize: 11.5,
    fontWeight: '800',
    color: theme.colors.dark,
  },

  // Caixa de Entrada de Comentário
  caixaInput: {
    backgroundColor: '#F6F3EB',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 16,
    marginBottom: 24,
    ...sombra(3),
  },
  inputComentario: {
    minHeight: 64,
    fontSize: 14,
    color: theme.colors.dark,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  linhaBotaoEnviar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  botaoEnviar: {
    backgroundColor: coresProfessor.verde,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },

  // Lista de Comentários
  listaComentarios: {
    gap: 16,
  },
  cartaoComentario: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 16,
    gap: 12,
    ...sombra(4),
  },
  comentarioTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  autorLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarAutor: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarAutorTexto: {
    fontSize: 16,
    fontWeight: '900',
    color: coresProfessor.borda,
  },
  autorInfo: {
    gap: 2,
  },
  autorNomeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autorNome: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  autorSemestre: {
    fontSize: 12,
    color: theme.colors.darkCharcoal,
  },
  autorCurso: {
    fontSize: 12,
    color: theme.colors.darkCharcoal,
  },
  badgeNota: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: coresProfessor.amarelo,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...sombra(1),
  },
  textoBadgeNota: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.dark,
  },
  textoComentario: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.dark,
    fontWeight: '500',
  },
  divisorComentario: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  comentarioRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botoesReacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  botaoReacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...sombra(1),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  botaoReacaoAtivo: {
    backgroundColor: '#EBF3FE',
    borderColor: coresProfessor.primaria,
  },
  textoReacao: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  botaoDenunciar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoDenunciar: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.darkCharcoal,
    letterSpacing: 0.5,
  },
  carregarMaisContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  botaoCarregarMais: {
    minWidth: 240,
  },
  textoCarregarMais: {
    fontSize: 13,
    letterSpacing: 0.8,
  },
});


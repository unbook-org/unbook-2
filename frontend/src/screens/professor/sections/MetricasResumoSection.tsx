import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { CartoonButton } from '../../../components/CartoonButton';
import { theme } from '../../../constants/theme';
import type { AvaliacaoComentario, ProfessorProfile, TurmaDocente } from '../../../types/professor';
import { coresProfessor, sombra } from '../estilos';

interface MetricasResumoSectionProps {
  professor: ProfessorProfile;
  turmaAtiva?: TurmaDocente | null;
  onNovaAvaliacao?: (avaliacao: AvaliacaoComentario) => void;
}

export function MetricasResumoSection({
  professor,
  turmaAtiva,
  onNovaAvaliacao,
}: MetricasResumoSectionProps) {
  const { width } = useWindowDimensions();
  const compacto = width < 768;

  // Controle do Wizard Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);

  // Estados das respostas do Wizard
  const [statusDesfecho, setStatusDesfecho] = useState<'passei' | 'reprovei' | 'tranquei'>('passei');
  const [emojiSelecionado, setEmojiSelecionado] = useState('🥱');
  const [cobrancaJusta, setCobrancaJusta] = useState<boolean | null>(true);
  const [disponibilizaMaterial, setDisponibilizaMaterial] = useState<boolean | null>(true);
  const [chamadaObrigatoria, setChamadaObrigatoria] = useState<'sim' | 'desconsidera' | 'nao'>('sim');
  const [monitoriaAtiva, setMonitoriaAtiva] = useState<boolean | null>(true);
  const [notaEstrelas, setNotaEstrelas] = useState(4);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);

  // Selo Padge atual
  const seloPadge = professor.resumo_didatica.selo_padge ?? professor.resumo_ia?.selo_padge ?? 'PADGE: SONO';
  const emojiExibido = seloPadge.includes('SONO')
    ? '🥱'
    : seloPadge.includes('TANKEI') || seloPadge.includes('PAU')
    ? '🤯'
    : seloPadge.includes('JUSTO')
    ? '😎'
    : '🧐';

  // Cálculos das porcentagens das barras no card
  const chamadaPct = professor.resumo_didatica.cobra_presenca_percentual ?? 85;
  const justaPct = professor.resumo_didatica.avaliacao_justa_percentual ?? 15;
  const monitoriaPct = 78;

  const abrirModalNaEtapa = (etapa = 1) => {
    setEtapaAtual(etapa);
    setEnviadoSucesso(false);
    setModalAberto(true);
  };

  const handleFinalizar = () => {
    if (onNovaAvaliacao) {
      const nova: AvaliacaoComentario = {
        id: String(Date.now()),
        autor_anonimo: `Anônimo #${Math.floor(1000 + Math.random() * 9000)}`,
        curso_autor: 'Estudante UnB',
        semestre: turmaAtiva?.semestre ?? '2026.2',
        nota_didatica: notaEstrelas,
        nota_dificuldade: cobrancaJusta ? 3 : 5,
        comentario:
          comentarioTexto.trim() ||
          `Disciplina com ${professor.nome_completo}. Chamada: ${
            chamadaObrigatoria === 'sim' ? 'Cobra presença' : 'Não cobra'
          }. Avaliação: ${cobrancaJusta ? 'Justa' : 'Rigorosa'}.`,
        emoji_vibe: emojiSelecionado,
        cobra_presenca: chamadaObrigatoria === 'sim',
        avaliacao_justa: cobrancaJusta ?? true,
        upvotes: 1,
        downvotes: 0,
        criado_em: new Date().toISOString(),
      };
      onNovaAvaliacao(nova);
    }
    setEnviadoSucesso(true);
    setTimeout(() => {
      setEnviadoSucesso(false);
      setModalAberto(false);
      setEtapaAtual(1);
      setComentarioTexto('');
    }, 1800);
  };

  // Emojis da Etapa 2 (Imagem 2)
  const listaEmojis = [
    { emoji: '😡', fundo: '#F87171', label: 'Revolta' },
    { emoji: '🫠', fundo: '#FDBA74', label: 'Derretendo' },
    { emoji: '🥱', fundo: '#FDE047', label: 'Sono' },
    { emoji: '🤔', fundo: '#FEF08A', label: 'Complexo' },
    { emoji: '🙂', fundo: '#86EFAC', label: 'Tranquilo' },
    { emoji: '😎', fundo: '#93C5FD', label: 'Top' },
  ];

  return (
    <View style={styles.cardContainer}>
      {/* Barra de Título do Card */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderEsquerda}>
          <View style={styles.quadradoVerde} />
          <Text style={styles.cardHeaderTitulo}>
            MÉTRICAS DE DESEMPENHO E PERGUNTAS FREQUENTES
          </Text>
        </View>
        <View style={styles.cardHeaderDireita}>
          <View style={styles.quadradoVerdePequeno} />
          <View style={styles.quadradoEscuroPequeno} />
        </View>
      </View>

      {/* Corpo com Grid de Duas Colunas */}
      <View style={[styles.cardCorpo, compacto && styles.cardCorpoCompacto]}>
        {/* Coluna Esquerda: Vibe / Emoji / PADGE */}
        <Pressable
          onPress={() => abrirModalNaEtapa(2)}
          style={styles.blocoVibe}
          accessibilityRole="button"
          accessibilityLabel="Escolher emoji de vibe"
        >
          <View style={styles.emojiCard}>
            <Text style={styles.emojiGrande}>{emojiExibido}</Text>
          </View>
          <View style={styles.blocoVibeTexto}>
            <Text style={styles.vibeDescricao}>
              A maioria das pessoas avaliaram esse emoji a essa matéria
            </Text>
            <View style={styles.seloPadge}>
              <Text style={styles.textoSeloPadge}>{seloPadge.toUpperCase()}</Text>
            </View>
            <Text style={styles.cliqueParaVotar}>👆 Clique para votar na vibe</Text>
          </View>
        </Pressable>

        {/* Coluna Direita: Barras Proporcionais SIM / NÃO com feedback visual */}
        <View style={styles.blocoBarras}>
          {/* Métrica 1: Chamada Obrigatória */}
          <View style={styles.metricaItem}>
            <View style={styles.metricaRotuloLinha}>
              <Text style={styles.metricaRotulo}>TEM CHAMADA OBRIGATÓRIA</Text>
              <Text style={styles.metricaPlacar}>
                {(chamadaPct / 10).toFixed(1)} / {((100 - chamadaPct) / 10).toFixed(1)}
              </Text>
            </View>
            <Pressable
              onPress={() => abrirModalNaEtapa(5)}
              style={styles.barraProporcional}
              accessibilityRole="button"
              accessibilityLabel="Votar se tem chamada obrigatória"
            >
              <View style={[styles.barraSim, { flex: Math.max(chamadaPct, 15) }]}>
                <Text style={styles.textoBarra}>SIM</Text>
              </View>
              <View style={[styles.barraNao, { flex: Math.max(100 - chamadaPct, 15) }]}>
                <Text style={styles.textoBarra}>NÃO</Text>
              </View>
            </Pressable>
          </View>

          {/* Métrica 2: Prova Justa */}
          <View style={styles.metricaItem}>
            <View style={styles.metricaRotuloLinha}>
              <Text style={styles.metricaRotulo}>COBRANÇA JUSTA NAS PROVAS?</Text>
              <Text style={styles.metricaPlacar}>
                {(justaPct / 10).toFixed(1)} / {((100 - justaPct) / 10).toFixed(1)}
              </Text>
            </View>
            <Pressable
              onPress={() => abrirModalNaEtapa(3)}
              style={styles.barraProporcional}
              accessibilityRole="button"
              accessibilityLabel="Votar se a prova é justa"
            >
              <View style={[styles.barraSim, { flex: Math.max(justaPct, 15) }]}>
                <Text style={styles.textoBarra}>SIM</Text>
              </View>
              <View style={[styles.barraNao, { flex: Math.max(100 - justaPct, 15) }]}>
                <Text style={styles.textoBarra}>NÃO</Text>
              </View>
            </Pressable>
          </View>

          {/* Métrica 3: Monitoria Ativa */}
          <View style={styles.metricaItem}>
            <View style={styles.metricaRotuloLinha}>
              <Text style={styles.metricaRotulo}>TEM MONITORIA ATIVA EM SALA?</Text>
              <Text style={styles.metricaPlacar}>
                {(monitoriaPct / 10).toFixed(1)} / {((100 - monitoriaPct) / 10).toFixed(1)}
              </Text>
            </View>
            <Pressable
              onPress={() => abrirModalNaEtapa(6)}
              style={styles.barraProporcional}
              accessibilityRole="button"
              accessibilityLabel="Votar se tem monitoria ativa"
            >
              <View style={[styles.barraSim, { flex: Math.max(monitoriaPct, 15) }]}>
                <Text style={styles.textoBarra}>SIM</Text>
              </View>
              <View style={[styles.barraNao, { flex: Math.max(100 - monitoriaPct, 15) }]}>
                <Text style={styles.textoBarra}>NÃO</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Botão de Ação: AVALIAR PROFESSOR */}
      <View style={styles.cardAcao}>
        <CartoonButton
          variant="primary"
          size="lg"
          onPress={() => abrirModalNaEtapa(1)}
          style={styles.botaoAvaliar}
          textStyle={styles.textoBotaoAvaliar}
        >
          AVALIAR PROFESSOR
        </CartoonButton>
      </View>

      {/* =========================================================================
          WIZARD MODAL MULTI-ETAPAS (Conforme Imagens 1 a 5)
         ========================================================================= */}
      <Modal
        visible={modalAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.janelaModal}>
            {/* Barra de Título Azul com Ícones [?] e [X] */}
            <View style={styles.barraJanelaAzul}>
              <View style={styles.espacoEsquerda} />
              <Text style={styles.tituloJanela}>Avaliação</Text>
              <View style={styles.iconesJanelaDireita}>
                <Pressable
                  onPress={() => setModalAjudaAberto(true)}
                  style={styles.botaoIconeJanela}
                  accessibilityRole="button"
                  accessibilityLabel="Ajuda sobre a avaliação"
                >
                  <Text style={styles.textoIconeJanela}>?</Text>
                </Pressable>
                <Pressable
                  onPress={() => setModalAberto(false)}
                  style={styles.botaoIconeJanela}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar modal de avaliação"
                >
                  <Text style={styles.textoIconeJanela}>✕</Text>
                </Pressable>
              </View>
            </View>

            {/* Conteúdo Interno da Janela */}
            <View style={styles.corpoJanela}>
              {enviadoSucesso ? (
                <View style={styles.sucessoWrapper}>
                  <Text style={styles.sucessoEmoji}>🎉</Text>
                  <Text style={styles.sucessoTitulo}>Avaliação Registrada!</Text>
                  <Text style={styles.sucessoSubtitulo}>
                    Seu voto foi computado com sucesso e ajuda toda a comunidade UnB.
                  </Text>
                </View>
              ) : (
                <>
                  {/* ETAPA 1: Antes de tudo - Você passou nessa matéria? (Imagem 1) */}
                  {etapaAtual === 1 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.tituloEtapa1}>Antes de tudo</Text>
                      <Text style={styles.perguntaEtapa}>VOCÊ PASSOU NESSA MATÉRIA?</Text>

                      <View style={styles.grupoOpcoesLinha}>
                        <Pressable
                          onPress={() => setStatusDesfecho('reprovei')}
                          style={[
                            styles.botaoOpcaoNeo,
                            styles.opcaoReprovei,
                            statusDesfecho === 'reprovei' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoOpcaoNeo}>REPROVEI</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setStatusDesfecho('tranquei')}
                          style={[
                            styles.botaoOpcaoNeo,
                            styles.opcaoTranquei,
                            statusDesfecho === 'tranquei' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoOpcaoNeo}>TRANQUEI</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setStatusDesfecho('passei')}
                          style={[
                            styles.botaoOpcaoNeo,
                            styles.opcaoPassei,
                            statusDesfecho === 'passei' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoOpcaoNeo}>PASSEI</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ETAPA 2: Escolha de Emoji / Vibe (Imagem 2) */}
                  {etapaAtual === 2 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        SE VOCÊ PUDESSE ESCOLHER UM EMOJI PARA DEFINIR A MATÉRIA QUAL VOCÊ ESCOLHERIA?
                      </Text>

                      <View style={styles.gradeEmojis}>
                        {listaEmojis.map((item) => {
                          const selecionado = emojiSelecionado === item.emoji;
                          return (
                            <Pressable
                              key={item.emoji}
                              onPress={() => setEmojiSelecionado(item.emoji)}
                              style={[
                                styles.cardEmojiItem,
                                { backgroundColor: item.fundo },
                                selecionado && styles.cardEmojiItemSelecionado,
                              ]}
                              accessibilityRole="button"
                              accessibilityLabel={`Selecionar emoji ${item.label}`}
                            >
                              <Text style={styles.emojiItemGlifo}>{item.emoji}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* ETAPA 3: Prova Justa (Imagem 3) */}
                  {etapaAtual === 3 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        A COBRANÇA NAS PROVAS E/OU TRABALHOS FOI CONDIZENTE COM O QUE FOI ENSINADO EM AULA?
                      </Text>

                      <View style={styles.duplaBotoes}>
                        <Pressable
                          onPress={() => setCobrancaJusta(false)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoNao,
                            cobrancaJusta === false && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>NÃO</Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setCobrancaJusta(true)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoSim,
                            cobrancaJusta === true && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>SIM</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ETAPA 4: Material Online (Imagem 4) */}
                  {etapaAtual === 4 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        O PROFESSOR DISPONIBILIZA MATERIAL ONLINE SEJA NO APRENDER3 OU NO SIGAA?
                      </Text>

                      <View style={styles.duplaBotoes}>
                        <Pressable
                          onPress={() => setDisponibilizaMaterial(false)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoNao,
                            disponibilizaMaterial === false && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>
                            NÃO, ELE NÃO DISPONIBILIZA
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setDisponibilizaMaterial(true)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoSim,
                            disponibilizaMaterial === true && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>
                            SIM, ELE DISPONIBILIZA
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ETAPA 5: Chamada Obrigatória (Imagem 5) */}
                  {etapaAtual === 5 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        O PROFESSOR REALIZA CHAMADA OBRIGATÓRIA DENTRO DA SALA DE AULA?
                      </Text>

                      <View style={styles.grupoTresBotoes}>
                        <Pressable
                          onPress={() => setChamadaObrigatoria('nao')}
                          style={[
                            styles.botaoTres,
                            styles.botaoNao,
                            chamadaObrigatoria === 'nao' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoTres}>
                            NÃO, ELE NÃO PASSA
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setChamadaObrigatoria('desconsidera')}
                          style={[
                            styles.botaoTres,
                            styles.botaoDesconsidera,
                            chamadaObrigatoria === 'desconsidera' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoTres}>
                            ELE DESCONSIDERA
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setChamadaObrigatoria('sim')}
                          style={[
                            styles.botaoTres,
                            styles.botaoSim,
                            chamadaObrigatoria === 'sim' && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoTres}>
                            SIM, ELE PASSA
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ETAPA 6: Monitoria Ativa (Solicitada pelo usuário) */}
                  {etapaAtual === 6 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        TEM MONITORIA ATIVA EM SALA DE AULA OU ATENDIMENTO EXTRACLASSE?
                      </Text>

                      <View style={styles.duplaBotoes}>
                        <Pressable
                          onPress={() => setMonitoriaAtiva(false)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoNao,
                            monitoriaAtiva === false && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>
                            NÃO TEM MONITORIA
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => setMonitoriaAtiva(true)}
                          style={[
                            styles.botaoDuplo,
                            styles.botaoSim,
                            monitoriaAtiva === true && styles.botaoOpcaoSelecionado,
                          ]}
                        >
                          <Text style={styles.textoBotaoDuplo}>
                            SIM, TEM MONITORIA ATIVA
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}

                  {/* ETAPA 7: Nota Geral & Comentário Anônimo Opcional */}
                  {etapaAtual === 7 && (
                    <View style={styles.etapaConteudo}>
                      <Text style={styles.perguntaEtapa}>
                        QUER DEIXAR UM RELATO ANÔNIMO SOBRE SUA EXPERIÊNCIA?
                      </Text>

                      {/* Seletor de Nota 1 a 5 estrelas */}
                      <Text style={styles.rotuloPequeno}>Nota geral do docente:</Text>
                      <View style={styles.linhaEstrelas}>
                        {[1, 2, 3, 4, 5].map((estrela) => (
                          <Pressable
                            key={estrela}
                            onPress={() => setNotaEstrelas(estrela)}
                            style={[
                              styles.botaoEstrelaItem,
                              notaEstrelas === estrela && styles.botaoEstrelaSelecionado,
                            ]}
                          >
                            <Text style={styles.textoEstrela}>★ {estrela}</Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Campo de Texto */}
                      <Text style={styles.rotuloPequeno}>Comentário anônimo (opcional):</Text>
                      <TextInput
                        placeholder="Conte como são as provas, ritmo das aulas e se recomenda o docente..."
                        placeholderTextColor="#888"
                        value={comentarioTexto}
                        onChangeText={setComentarioTexto}
                        multiline
                        numberOfLines={3}
                        style={styles.inputComentarioWizard}
                      />
                    </View>
                  )}

                  {/* Linha Divisória */}
                  <View style={styles.divisorEtapa} />

                  {/* Barra de Navegação Inferior: < VOLTAR | PROSSEGUIR > */}
                  <View style={styles.barraBotoesNavegacao}>
                    {etapaAtual > 1 && (
                      <Pressable
                        onPress={() => setEtapaAtual((prev) => prev - 1)}
                        style={styles.botaoVoltarWizard}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoBotaoVoltarWizard}>‹ VOLTAR</Text>
                      </Pressable>
                    )}

                    {etapaAtual < 7 ? (
                      <Pressable
                        onPress={() => setEtapaAtual((prev) => prev + 1)}
                        style={[
                          styles.botaoProsseguirWizard,
                          etapaAtual === 1 && styles.botaoProsseguirLargo,
                        ]}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoBotaoProsseguirWizard}>PROSSEGUIR ›</Text>
                      </Pressable>
                    ) : (
                      <Pressable
                        onPress={handleFinalizar}
                        style={[styles.botaoProsseguirWizard, styles.botaoFinalizarWizard]}
                        accessibilityRole="button"
                      >
                        <Text style={styles.textoBotaoProsseguirWizard}>
                          FINALIZAR AVALIAÇÃO
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Ajuda / Informações */}
      <Modal
        visible={modalAjudaAberto}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAjudaAberto(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.janelaAjuda}>
            <Text style={styles.tituloAjuda}>Como funciona a avaliação?</Text>
            <Text style={styles.textoAjuda}>
              • Todas as respostas são <Text style={{ fontWeight: '900' }}>100% anônimas</Text> e protegidas por criptografia Zero-Knowledge.
            </Text>
            <Text style={styles.textoAjuda}>
              • Seu relato ajuda a calcular as métricas comunitárias de presença, prova e vibe para os próximos semestres.
            </Text>
            <CartoonButton
              variant="primary"
              size="sm"
              onPress={() => setModalAjudaAberto(false)}
              style={{ marginTop: 16 }}
            >
              Entendido!
            </CartoonButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    ...sombra(4),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: coresProfessor.borda,
  },
  cardHeaderEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quadradoVerde: {
    width: 14,
    height: 14,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    backgroundColor: coresProfessor.verde,
  },
  cardHeaderTitulo: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  cardHeaderDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quadradoVerdePequeno: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    backgroundColor: coresProfessor.verde,
  },
  quadradoEscuroPequeno: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    backgroundColor: coresProfessor.borda,
  },
  cardCorpo: {
    flexDirection: 'row',
    padding: 16,
    gap: 20,
    alignItems: 'stretch',
  },
  cardCorpoCompacto: {
    flexDirection: 'column',
  },
  blocoVibe: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    backgroundColor: '#F6F3EB',
    minHeight: 110,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  emojiCard: {
    width: 90,
    backgroundColor: coresProfessor.amarelo,
    borderRightWidth: 2,
    borderRightColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiGrande: {
    fontSize: 48,
  },
  blocoVibeTexto: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  vibeDescricao: {
    fontSize: 11.5,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
    lineHeight: 16,
  },
  seloPadge: {
    backgroundColor: coresProfessor.amarelo,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  textoSeloPadge: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  cliqueParaVotar: {
    fontSize: 10,
    fontWeight: '800',
    color: coresProfessor.verde,
    marginTop: 4,
  },
  blocoBarras: {
    flex: 1.3,
    justifyContent: 'space-around',
    gap: 12,
  },
  metricaItem: {
    gap: 4,
  },
  metricaRotuloLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricaRotulo: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  metricaPlacar: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.darkCharcoal,
  },
  barraProporcional: {
    height: 28,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  barraSim: {
    backgroundColor: coresProfessor.verde,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: coresProfessor.borda,
  },
  barraNao: {
    backgroundColor: coresProfessor.vermelho,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBarra: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  cardAcao: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  botaoAvaliar: {
    width: '100%',
    backgroundColor: coresProfessor.primaria,
    paddingVertical: 14,
  },
  textoBotaoAvaliar: {
    fontSize: 16,
    letterSpacing: 1,
  },

  // ==========================================
  // ESTILOS DO WIZARD MODAL (Imagens 1 a 5)
  // ==========================================
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  janelaModal: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#FAF8F0',
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    overflow: 'hidden',
    ...sombra(8),
  },
  barraJanelaAzul: {
    backgroundColor: coresProfessor.primaria,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: coresProfessor.borda,
  },
  espacoEsquerda: {
    width: 60,
  },
  tituloJanela: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  iconesJanelaDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  botaoIconeJanela: {
    width: 28,
    height: 28,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(1),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoIconeJanela: {
    fontSize: 14,
    fontWeight: '900',
    color: coresProfessor.borda,
  },
  corpoJanela: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  etapaConteudo: {
    alignItems: 'center',
    gap: 16,
  },
  tituloEtapa1: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.dark,
    textAlign: 'center',
  },
  perguntaEtapa: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.dark,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 480,
    letterSpacing: 0.5,
  },

  // Botões de Opção da Etapa 1
  grupoOpcoesLinha: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    marginTop: 8,
  },
  botaoOpcaoNeo: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(3),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as object)
      : {}),
  },
  opcaoReprovei: {
    backgroundColor: '#FCA5A5', // Pastel Red
  },
  opcaoTranquei: {
    backgroundColor: '#FDE047', // Pastel Yellow
  },
  opcaoPassei: {
    backgroundColor: '#86EFAC', // Pastel Mint Green
  },

  // Seleção Ativa com feedback de zoom instantâneo
  botaoOpcaoSelecionado: {
    borderWidth: 3,
    borderColor: '#1F1F1F',
    transform: [{ scale: 1.05 }],
    ...sombra(5),
    zIndex: 10,
  },
  textoOpcaoNeo: {
    fontSize: 13,
    fontWeight: '900',
    color: coresProfessor.borda,
    letterSpacing: 0.5,
  },

  // Emojis da Etapa 2
  gradeEmojis: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  cardEmojiItem: {
    width: 58,
    height: 58,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...sombra(3),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as object)
      : {}),
  },
  cardEmojiItemSelecionado: {
    borderWidth: 3,
    borderColor: '#1F1F1F',
    transform: [{ scale: 1.15 }],
    ...sombra(5),
    zIndex: 10,
  },
  emojiItemGlifo: {
    fontSize: 32,
  },

  // Dupla de Botões (SIM / NÃO com cor viva no NÃO)
  duplaBotoes: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    maxWidth: 440,
    marginTop: 12,
  },
  botaoDuplo: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(3),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as object)
      : {}),
  },
  botaoNao: {
    backgroundColor: '#FCA5A5', // Vermelho/Rosa pastel visível no NÃO
  },
  botaoSim: {
    backgroundColor: '#86EFAC', // Verde pastel no SIM
  },
  textoBotaoDuplo: {
    fontSize: 13,
    fontWeight: '900',
    color: coresProfessor.borda,
    textAlign: 'center',
  },

  // Grupo de 3 Botões (Etapa 5)
  grupoTresBotoes: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 12,
  },
  botaoTres: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(3),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as object)
      : {}),
  },
  botaoDesconsidera: {
    backgroundColor: '#FFFFFF',
  },
  textoBotaoTres: {
    fontSize: 11,
    fontWeight: '900',
    color: coresProfessor.borda,
    textAlign: 'center',
  },

  // Etapa 7: Estrelas e Comentário
  rotuloPequeno: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  linhaEstrelas: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  botaoEstrelaItem: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    alignItems: 'center',
    ...sombra(2),
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as object)
      : {}),
  },
  botaoEstrelaSelecionado: {
    backgroundColor: coresProfessor.amarelo,
    borderWidth: 2.5,
    transform: [{ scale: 1.08 }],
    ...sombra(4),
    zIndex: 5,
  },
  textoEstrela: {
    fontSize: 14,
    fontWeight: '900',
    color: coresProfessor.borda,
  },
  inputComentarioWizard: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 12,
    fontSize: 13,
    color: theme.colors.dark,
    minHeight: 70,
    textAlignVertical: 'top',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },

  // Barra Inferior de Navegação (< VOLTAR / PROSSEGUIR >)
  divisorEtapa: {
    height: 1.5,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 20,
  },
  barraBotoesNavegacao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    width: '100%',
  },
  botaoVoltarWizard: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoBotaoVoltarWizard: {
    fontSize: 13,
    fontWeight: '900',
    color: coresProfessor.borda,
    letterSpacing: 0.5,
  },
  botaoProsseguirWizard: {
    flex: 1,
    backgroundColor: coresProfessor.primaria,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  botaoProsseguirLargo: {
    flex: 1,
    width: '100%',
  },
  botaoFinalizarWizard: {
    backgroundColor: coresProfessor.verde,
  },
  textoBotaoProsseguirWizard: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },

  // Sucesso
  sucessoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  sucessoEmoji: {
    fontSize: 54,
  },
  sucessoTitulo: {
    fontSize: 22,
    fontWeight: '900',
    color: coresProfessor.verde,
  },
  sucessoSubtitulo: {
    fontSize: 13,
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
    maxWidth: 380,
  },

  // Janela Ajuda
  janelaAjuda: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: theme.colors.white,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    padding: 24,
    gap: 12,
    ...sombra(6),
  },
  tituloAjuda: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.dark,
  },
  textoAjuda: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.darkCharcoal,
  },
});

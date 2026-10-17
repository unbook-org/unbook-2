import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CartoonButton } from '../../components/CartoonButton';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { theme } from '../../constants/theme';
import { useConsulta } from '../../hooks/useConsulta';
import { ApiError, getMateria } from '../../services/api';
import type { MateriaDetalhe, Turma } from '../../types/materia';
import { formatarNomeProfessor } from '../../utils/formatadorTexto';
import { formatarHorario } from '../../utils/horario';
import { nivelDaApi, type NivelEnsino } from '../../utils/nivelEnsino';
import { coresMateria, LARGURA_MAXIMA, sombra } from './estilos';
import {
  BarraSuperior,
  CabecalhoMateria,
  EmentaSection,
  RequisitosSection,
  TurmasSection,
} from './sections';

interface MateriaScreenProps {
  codigo: string;
  nivel: NivelEnsino;
  onVoltar: () => void;
  onSelectMateria: (codigo: string, nivel: NivelEnsino) => void;
  onSelectProfessor?: (identifier: string, origemNome?: string) => void;
}

// 404 vira `null` para a tela distinguir "não encontrada" de falhas de rede/servidor.
function buscarMateria(
  codigo: string,
  nivel: NivelEnsino,
  sinal: AbortSignal,
): Promise<MateriaDetalhe | null> {
  return getMateria(codigo, nivel, sinal).catch((erro) => {
    if (erro instanceof ApiError && erro.status === 404) {
      return null;
    }
    throw erro;
  });
}

export function MateriaScreen({
  codigo,
  nivel,
  onVoltar,
  onSelectMateria,
  onSelectProfessor,
}: MateriaScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [copiadoSucesso, setCopiadoSucesso] = useState(false);

  const { dados: materia, carregando, erro } = useConsulta(
    (sinal) => buscarMateria(codigo, nivel, sinal),
    [codigo, nivel],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [codigo]);

  // Os requisitos guardam só o código: abrem no mesmo nível da matéria exibida.
  const nivelAtual = nivelDaApi(materia?.nivel_de_ensino) ?? nivel;
  const naoEncontrada = !carregando && !erro && materia === null;

  const handleRolarParaSecao = (secao: 'ementa' | 'requisitos' | 'turmas') => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const elemento = document.getElementById(`secao-${secao}`);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
  };

  const handleAcessarTurma = (turma: Turma) => {
    setCopiadoSucesso(false);
    setTurmaSelecionada(turma);
  };

  const handleCopiarTurma = (turma: Turma) => {
    const horarioTexto = formatarHorario(turma.horario_bruto);
    const nomeDocente = turma.professor ? formatarNomeProfessor(turma.professor.nome_completo) : 'Docente a definir';
    const nomeMateria = materia ? formatarNomeProfessor(materia.nome) : '';
    const texto = `${materia?.codigo_materia ?? ''} - ${nomeMateria}\nTurma ${turma.codigo_turma} (${turma.semestre})\nDocente: ${nomeDocente}\nHorário: ${horarioTexto}\nLocal: ${turma.local_sala || 'Local a definir'}`;

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(texto).catch(() => {});
    }
    setCopiadoSucesso(true);
  };

  const handleAcessarProfessor = (slugProfessor: string) => {
    if (onSelectProfessor) {
      onSelectProfessor(slugProfessor, materia ? formatarNomeProfessor(materia.nome) : undefined);
    }
  };

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.conteudo}>
        <NewsBanner />
        <Navbar onPressLogo={onVoltar} onPressExplore={onVoltar} onPressAbout={onVoltar} />
        <BarraSuperior onVoltar={onVoltar} />

        {carregando && (
          <ActivityIndicator color={theme.colors.secondary} size="large" style={styles.carregando} />
        )}

        {!carregando && erro && (
          <Aviso
            titulo="Não foi possível carregar a matéria"
            descricao={erro}
            onVoltar={onVoltar}
          />
        )}

        {naoEncontrada && (
          <Aviso
            titulo="Matéria não encontrada"
            descricao={`Não encontramos nenhuma matéria com o código ${codigo.toUpperCase()}. Confira o código ou volte para a busca.`}
            onVoltar={onVoltar}
          />
        )}

        {!carregando && materia && (
          <>
            <CabecalhoMateria
              materia={materia}
              onRolarParaSecao={handleRolarParaSecao}
            />
            <View style={styles.corpo}>
              <View nativeID="secao-ementa">
                <EmentaSection materia={materia} />
              </View>
              <View nativeID="secao-requisitos">
                <RequisitosSection
                  materia={materia}
                  onSelectMateria={(codigoRequisito) => onSelectMateria(codigoRequisito, nivelAtual)}
                />
              </View>
            </View>
            <View nativeID="secao-turmas" style={styles.turmas}>
              <TurmasSection
                turmas={materia.turmas ?? []}
                onAcessarTurma={handleAcessarTurma}
                onAcessarProfessor={handleAcessarProfessor}
              />
            </View>
          </>
        )}

        <View style={styles.espacador} />
        <Footer />
      </ScrollView>

      {/* Modal Neo-Brutalista de Detalhes da Turma */}
      <Modal
        visible={turmaSelecionada !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTurmaSelecionada(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setTurmaSelecionada(null)}
        >
          {turmaSelecionada && (
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleGroup}>
                  <View style={styles.modalCodigoPill}>
                    <Text style={styles.modalCodigoPillText}>
                      TURMA {turmaSelecionada.codigo_turma} • {turmaSelecionada.semestre}
                    </Text>
                  </View>
                  <Text style={styles.modalMateriaTitle}>
                    {materia?.codigo_materia} — {materia ? formatarNomeProfessor(materia.nome) : ''}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setTurmaSelecionada(null)}
                  style={styles.modalCloseBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar detalhes da turma"
                >
                  <Text style={styles.modalCloseBtnText}>✕</Text>
                </Pressable>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoLabel}>DOCENTE RESPONSÁVEL</Text>
                  <Text style={styles.modalInfoValue}>
                    {turmaSelecionada.professor
                      ? formatarNomeProfessor(turmaSelecionada.professor.nome_completo)
                      : 'Docente a definir pelo departamento'}
                  </Text>
                </View>

                <View style={styles.modalInfoBox}>
                  <Text style={styles.modalInfoLabel}>
                    HORÁRIO SEMANAL (SIGAA: {turmaSelecionada.horario_bruto || 'A DEFINIR'})
                  </Text>
                  <Text style={styles.modalInfoValue}>
                    {formatarHorario(turmaSelecionada.horario_bruto)}
                  </Text>
                </View>

                <View style={styles.modalGridRow}>
                  <View style={[styles.modalInfoBox, styles.modalGridCol]}>
                    <Text style={styles.modalInfoLabel}>SALA / LOCAL</Text>
                    <Text style={styles.modalInfoValue}>
                      {turmaSelecionada.local_sala || 'A definir'}
                    </Text>
                  </View>
                  <View style={[styles.modalInfoBox, styles.modalGridCol]}>
                    <Text style={styles.modalInfoLabel}>VAGAS OCUPADAS</Text>
                    <Text style={styles.modalInfoValue}>
                      {turmaSelecionada.vagas_ocupadas} / {turmaSelecionada.vagas_ofertadas} vagas
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => handleCopiarTurma(turmaSelecionada)}
                  style={[
                    styles.modalActionPrimary,
                    copiadoSucesso && styles.modalActionSuccess,
                  ]}
                  accessibilityRole="button"
                >
                  <Text style={styles.modalActionPrimaryText}>
                    {copiadoSucesso ? 'DADOS COPIADOS PARA MATRÍCULA ✓' : 'COPIAR DADOS PARA MATRÍCULA'}
                  </Text>
                </Pressable>

                {turmaSelecionada.professor && onSelectProfessor && (
                  <Pressable
                    onPress={() => {
                      const slug = turmaSelecionada.professor!.slug;
                      setTurmaSelecionada(null);
                      handleAcessarProfessor(slug);
                    }}
                    style={styles.modalActionSecondary}
                    accessibilityRole="button"
                  >
                    <Text style={styles.modalActionSecondaryText}>
                      VER PERFIL DO DOCENTE →
                    </Text>
                  </Pressable>
                )}
              </View>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

interface AvisoProps {
  titulo: string;
  descricao: string;
  onVoltar: () => void;
}

function Aviso({ titulo, descricao, onVoltar }: AvisoProps) {
  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Text style={styles.tituloAviso}>{titulo}</Text>
      <Text style={styles.descricaoAviso}>{descricao}</Text>
      <CartoonButton variant="secondary" onPress={onVoltar} style={styles.botaoAviso}>
        Voltar para a busca
      </CartoonButton>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: coresMateria.fundo,
  },
  conteudo: {
    flexGrow: 1,
    backgroundColor: coresMateria.fundo,
  },
  carregando: {
    marginVertical: 96,
  },
  corpo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  turmas: {
    width: '100%',
    paddingBottom: 48,
  },
  espacador: {
    flexGrow: 1,
  },
  aviso: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 64,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 28,
    ...sombra(6),
  },
  tituloAviso: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.dark,
    textAlign: 'center',
  },
  descricaoAviso: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
  botaoAviso: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 24,
    ...sombra(6),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 14,
    marginBottom: 16,
    gap: 12,
  },
  modalTitleGroup: {
    flex: 1,
    gap: 6,
  },
  modalCodigoPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#009A5E',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  modalCodigoPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  modalMateriaTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 23,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F5',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  modalBody: {
    gap: 12,
    marginBottom: 20,
  },
  modalInfoBox: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    padding: 12,
    gap: 4,
  },
  modalInfoLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 20,
  },
  modalGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalGridCol: {
    flex: 1,
  },
  modalActions: {
    gap: 10,
  },
  modalActionPrimary: {
    backgroundColor: '#009A5E',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    ...sombra(3),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalActionSuccess: {
    backgroundColor: '#1F1F1F',
  },
  modalActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  modalActionSecondary: {
    backgroundColor: '#EEF4FF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 11,
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}),
  },
  modalActionSecondaryText: {
    color: '#1349EB',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});

import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
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
  onSelectProfessor?: (identifier: string) => void;
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

export function MateriaScreen({ codigo, nivel, onVoltar, onSelectMateria }: MateriaScreenProps) {
  const scrollRef = useRef<ScrollView>(null);

  const { dados: materia, carregando, erro } = useConsulta(
    (sinal) => buscarMateria(codigo, nivel, sinal),
    [codigo, nivel],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
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
    const texto = `${materia?.codigo_materia ?? ''} - Turma ${turma.codigo_turma} (${turma.semestre})\nDocente: ${turma.professor?.nome_completo ?? 'A definir'}\nHorário: ${turma.horario_bruto}\nLocal: ${turma.local_sala || 'Local a definir'}`;
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(texto).catch(() => {});
    }
    const mensagem = `Dados da Turma ${turma.codigo_turma} copiados!\n\n${texto}`;
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      Alert.alert('Turma Selecionada', mensagem);
    }
  };

  const handleAcessarProfessor = (slugProfessor: string) => {
    const mensagem = `O perfil detalhado do docente (${slugProfessor}) estará disponível em breve com a integração do módulo de docentes!`;
    if (Platform.OS === 'web') {
      window.alert(mensagem);
    } else {
      Alert.alert('Docente UnB', mensagem);
    }
  };

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.conteudo}>
        <NewsBanner />
        <Navbar onPressLogo={onVoltar} onPressExplore={onVoltar} />
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
});

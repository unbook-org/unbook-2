import React from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartoonButton } from '../../components/CartoonButton';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { theme } from '../../constants/theme';
import { useConsulta } from '../../hooks/useConsulta';
import { ApiError, getMateria } from '../../services/api';
import type { MateriaDetalhe } from '../../types/materia';
import { nivelDaApi, type NivelEnsino } from '../../utils/nivelEnsino';
import { coresMateria, sombra } from './estilos';
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

export function MateriaScreen({
  codigo,
  nivel,
  onVoltar,
  onSelectMateria,
  onSelectProfessor,
}: MateriaScreenProps) {
  const { dados: materia, carregando, erro } = useConsulta(
    (sinal) => buscarMateria(codigo, nivel, sinal),
    [codigo, nivel],
  );
  // Os requisitos guardam só o código: abrem no mesmo nível da matéria exibida.
  const nivelAtual = nivelDaApi(materia?.nivel_de_ensino) ?? nivel;
  const naoEncontrada = !carregando && !erro && materia === null;

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
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
            <CabecalhoMateria materia={materia} />
            <View style={styles.corpo}>
              <EmentaSection materia={materia} />
              <RequisitosSection
                materia={materia}
                onSelectMateria={(codigoRequisito) => onSelectMateria(codigoRequisito, nivelAtual)}
              />
            </View>
            <View style={styles.turmas}>
              <TurmasSection
                turmas={materia.turmas ?? []}
                onAcessarProfessor={onSelectProfessor}
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
  },
  carregando: {
    marginVertical: 96,
  },
  corpo: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  turmas: {
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

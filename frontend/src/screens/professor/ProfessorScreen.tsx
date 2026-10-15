import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CartoonButton } from '../../components/CartoonButton';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { theme } from '../../constants/theme';
import { useConsulta } from '../../hooks/useConsulta';
import { getProfessor } from '../../services/api';
import type {
  AvaliacaoComentario,
  ProfessorProfile,
  TurmaDocente,
} from '../../types/professor';
import { coresProfessor, LARGURA_MAXIMA, sombra } from './estilos';
import {
  CabecalhoProfessor,
  ComentariosSection,
  MetricasResumoSection,
  SidebarCardsSection,
  TurmasDocenteSection,
} from './sections';

interface ProfessorScreenProps {
  identifier: string;
  onVoltar: () => void;
  onSelectMateria: (codigo: string) => void;
}

// Perfil Demo para o Professor Charles Xavier (conforme mockup do Figma)
const PERFIL_DEMO_CHARLES: ProfessorProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  nome_completo: 'Charles Xavier',
  slug: 'charles-xavier',
  siape: '1984202',
  email_institucional: 'charles.xavier@unb.br',
  titulo_academico: 'Dr.',
  url_lattes: 'http://lattes.cnpq.br/0000000000000000',
  localizacao_gabinete: 'BSA - A03',
  departamento: {
    id: 'ifd-01',
    codigo: 'IFD',
    nome: 'Instituto de Física',
    campus: {
      id: 'darcy',
      sigla: 'DARCY',
      nome: 'Brasília',
    },
  },
  materias: [
    {
      id: 'm1',
      codigo_materia: 'IFD0071',
      nome: 'Física 1',
      slug: 'fisica-1',
      creditos: 4,
      carga_horaria: 60,
    },
    {
      id: 'm2',
      codigo_materia: 'IFD0120',
      nome: 'Física Quântica',
      slug: 'fisica-quantica',
      creditos: 4,
      carga_horaria: 60,
    },
  ],
  turmas: [
    {
      id: 't2',
      codigo_turma: '2',
      semestre: '2026.2',
      horario_bruto: '24T23',
      local_sala: 'BSA - A03',
      vagas_ofertadas: 20,
      vagas_ocupadas: 6,
      materia: {
        id: 'm1',
        codigo_materia: 'IFD0071',
        nome: 'Física 1',
        slug: 'fisica-1',
        creditos: 4,
        carga_horaria: 60,
      },
    },
    {
      id: 't1',
      codigo_turma: '1',
      semestre: '2026.2',
      horario_bruto: '35M34',
      local_sala: 'BSA - A01',
      vagas_ofertadas: 20,
      vagas_ocupadas: 18,
      materia: {
        id: 'm1',
        codigo_materia: 'IFD0071',
        nome: 'Física 1',
        slug: 'fisica-1',
        creditos: 4,
        carga_horaria: 60,
      },
    },
    {
      id: 't3',
      codigo_turma: '1',
      semestre: '2026.2',
      horario_bruto: '24T45',
      local_sala: 'PAT - AT02',
      vagas_ofertadas: 15,
      vagas_ocupadas: 12,
      materia: {
        id: 'm2',
        codigo_materia: 'IFD0120',
        nome: 'Física Quântica',
        slug: 'fisica-quantica',
        creditos: 4,
        carga_horaria: 60,
      },
    },
  ],
  resumo_didatica: {
    media_didatica: 4.0,
    media_dificuldade: 3.8,
    total_avaliacoes: 40,
    resumo_executivo:
      'A matéria de física 1 ofertada por esse professor foi diagnosticada como poderosa e de caráter mutante, muitos alunos ressaltaram dizendo terem aprendido muito com a forma como as aulas são lecionadas.',
    badges: [
      '#exigente',
      '#atorDignoDeOscar',
      '#genteboa',
      '#recomendo',
      '#fisicodoido',
    ],
    selo_padge: 'PADGE: SONO',
    cobra_presenca_percentual: 85,
    avaliacao_justa_percentual: 15,
  },
  avaliacoes: [
    {
      id: 'c1',
      autor_anonimo: 'Anônimo #2392',
      curso_autor: 'Engenharia de Software',
      semestre: '2024.1',
      nota_didatica: 4.0,
      nota_dificuldade: 4.5,
      comentario:
        'Aulas sensacionais, mas as provas do Xavier são em outro nível. Estudem os mutantes!',
      emoji_vibe: '🥱',
      cobra_presenca: true,
      avaliacao_justa: false,
      upvotes: 24,
      downvotes: 2,
      criado_em: '2024-05-10T14:00:00Z',
    },
    {
      id: 'c2',
      autor_anonimo: 'JulianS #2392',
      curso_autor: 'Física',
      semestre: '2025.1',
      nota_didatica: 4.0,
      nota_dificuldade: 3.5,
      comentario:
        'Professor nota 10, gostei muito da forma como ele ensina a matéria!!',
      emoji_vibe: '😎',
      cobra_presenca: true,
      avaliacao_justa: true,
      upvotes: 24,
      downvotes: 2,
      criado_em: '2025-06-15T18:30:00Z',
    },
    {
      id: 'c3',
      autor_anonimo: 'Anônimo #7140',
      curso_autor: 'Ciência da Computação',
      semestre: '2025.2',
      nota_didatica: 4.5,
      nota_dificuldade: 4.0,
      comentario:
        'Didática impecável e domínio absurdo de física experimental. Não falte as aulas de quarta.',
      emoji_vibe: '🧐',
      cobra_presenca: true,
      avaliacao_justa: true,
      upvotes: 18,
      downvotes: 1,
      criado_em: '2025-11-20T10:15:00Z',
    },
  ],
};

function buscarProfessor(identifier: string, sinal: AbortSignal) {
  return getProfessor(identifier, sinal).catch(() => {
    // Se o backend estiver offline ou sem banco populado, carrega os dados demo completos do Figma
    return PERFIL_DEMO_CHARLES;
  });
}

export function ProfessorScreen({
  identifier,
  onVoltar,
  onSelectMateria,
}: ProfessorScreenProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 940;

  const {
    dados: professorApi,
    carregando,
    erro,
  } = useConsulta((sinal) => buscarProfessor(identifier, sinal), [identifier]);

  // Sempre garante exibição do perfil completo para desenvolvimento visual
  const professor = professorApi ?? PERFIL_DEMO_CHARLES;

  // Turma selecionada para visualização das métricas e grade
  const [turmaSelecionadaId, setTurmaSelecionadaId] = useState<string | null>(null);

  const turmaAtiva = useMemo<TurmaDocente | null>(() => {
    if (!professor || professor.turmas.length === 0) return null;
    if (turmaSelecionadaId) {
      const encontrada = professor.turmas.find((t) => t.id === turmaSelecionadaId);
      if (encontrada) return encontrada;
    }
    return professor.turmas[0];
  }, [professor, turmaSelecionadaId]);

  // Lista local de avaliações para permitir adição instantânea
  const [avaliacoesLocais, setAvaliacoesLocais] = useState<AvaliacaoComentario[]>([]);

  const listaAvaliacoes = useMemo(() => {
    const base = professor?.avaliacoes ?? [];
    return [...avaliacoesLocais, ...base];
  }, [professor, avaliacoesLocais]);

  const handleNovaAvaliacao = (nova: AvaliacaoComentario) => {
    setAvaliacoesLocais((prev) => [nova, ...prev]);
  };

  const naoEncontrado = !carregando && !erro && professor === null;

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <NewsBanner />
        <Navbar onPressLogo={onVoltar} onPressExplore={onVoltar} />

        {carregando && (
          <ActivityIndicator
            color={theme.colors.secondary}
            size="large"
            style={styles.carregando}
          />
        )}

        {!carregando && erro && (
          <View style={styles.aviso} accessibilityRole="alert">
            <Text style={styles.tituloAviso}>Não foi possível carregar o professor</Text>
            <Text style={styles.descricaoAviso}>{erro}</Text>
            <CartoonButton variant="secondary" onPress={onVoltar} style={styles.botaoAviso}>
              Voltar para a busca
            </CartoonButton>
          </View>
        )}

        {naoEncontrado && (
          <View style={styles.aviso} accessibilityRole="alert">
            <Text style={styles.tituloAviso}>Docente não encontrado</Text>
            <Text style={styles.descricaoAviso}>
              {`Não encontramos nenhum professor com o identificador "${identifier}".`}
            </Text>
            <CartoonButton variant="secondary" onPress={onVoltar} style={styles.botaoAviso}>
              Voltar para a busca
            </CartoonButton>
          </View>
        )}

        {!carregando && professor && (
          <>
            {/* Cabeçalho do Professor */}
            <CabecalhoProfessor
              professor={professor}
              turmaAtiva={turmaAtiva}
              onVoltar={onVoltar}
            />

            {/* Layout Principal: 2 Colunas no Desktop ou 1 Coluna no Mobile */}
            <View style={styles.corpoPrincipal}>
              <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
                {/* Coluna Esquerda: Métricas + Turmas + Comentários */}
                <View style={[styles.colunaPrincipal, isDesktop && styles.colunaPrincipalDesktop]}>
                  {/* Seção 1: Métricas de Desempenho e Perguntas Frequentes (Image 1 & 2) */}
                  <MetricasResumoSection
                    professor={professor}
                    turmaAtiva={turmaAtiva}
                    onNovaAvaliacao={handleNovaAvaliacao}
                  />

                  {/* Seção 2: Lista de Turmas & Disciplinas */}
                  <TurmasDocenteSection
                    professor={professor}
                    turmaAtiva={turmaAtiva}
                    onSelecionarTurma={(turma) => setTurmaSelecionadaId(turma.id)}
                    onSelectMateria={onSelectMateria}
                  />

                  {/* Seção 3: Comentários e Avaliações Reais (Image 2 & 3) */}
                  <ComentariosSection
                    avaliacoes={listaAvaliacoes}
                    onAdicionarComentario={handleNovaAvaliacao}
                  />
                </View>

                {/* Coluna Direita: Cards de Destaque da Turma (Vagas, Local, Horário, Recomendação) */}
                <View style={[styles.colunaLateral, isDesktop && styles.colunaLateralDesktop]}>
                  <SidebarCardsSection
                    professor={professor}
                    turmaAtiva={turmaAtiva}
                  />
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.espacador} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: coresProfessor.fundo,
  },
  conteudo: {
    flexGrow: 1,
  },
  carregando: {
    marginVertical: 96,
  },
  corpoPrincipal: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 24,
  },
  gridContainerDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  colunaPrincipal: {
    width: '100%',
    gap: 24,
  },
  colunaPrincipalDesktop: {
    flex: 1,
  },
  colunaLateral: {
    width: '100%',
  },
  colunaLateralDesktop: {
    width: 320,
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
    borderColor: coresProfessor.borda,
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

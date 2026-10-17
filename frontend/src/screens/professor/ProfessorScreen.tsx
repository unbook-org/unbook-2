import React, { useMemo } from 'react';
import {
  ActivityIndicator,
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
import { getProfessor } from '../../services/api';
import type {
  ProfessorProfile,
  TurmaDocente,
} from '../../types/professor';
import { coresProfessor, sombra } from './estilos';
import {
  CabecalhoProfessor,
  MateriasLecionandoSection,
} from './sections';

interface ProfessorScreenProps {
  identifier: string;
  origemNome?: string;
  onVoltar: () => void;
  onSelectMateria: (codigo: string) => void;
}

// Perfil Demo para o Professor Charles Xavier (fiel ao mockup real do Figma)
const PERFIL_DEMO_CHARLES: ProfessorProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  nome_completo: 'Charles Xavier',
  slug: 'charles-xavier',
  siape: '1984202',
  email_institucional: 'wagnerMoura@unb.br',
  titulo_academico: 'Dr.',
  url_foto:
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
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
      codigo_materia: 'IFD0073',
      nome: 'Física Exp. 1',
      slug: 'fisica-exp-1',
      creditos: 2,
      carga_horaria: 30,
    },
  ],
  turmas: [
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
      id: 't3',
      codigo_turma: '1',
      semestre: '2026.2',
      horario_bruto: '4T45',
      local_sala: 'PAT - AT02',
      vagas_ofertadas: 15,
      vagas_ocupadas: 12,
      materia: {
        id: 'm2',
        codigo_materia: 'IFD0073',
        nome: 'Física Exp. 1',
        slug: 'fisica-exp-1',
        creditos: 2,
        carga_horaria: 30,
      },
    },
  ],
  resumo_didatica: {
    media_didatica: 3.25,
    media_dificuldade: 3.8,
    total_avaliacoes: 128,
    resumo_executivo:
      'Tem experiência na área de Física, com ênfase em Física -Matemática. Atuando principalmente nos seguintes temas:função de Wigner, grupos de Lie, produto de Weyl, operador-estrela.',
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
      emoji_vibe: 'sono',
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
      emoji_vibe: 'top',
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
      emoji_vibe: 'complexo',
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
    // Se o backend estiver offline ou sem dados desse slug, utiliza dados demo
    return PERFIL_DEMO_CHARLES;
  });
}

export function ProfessorScreen({
  identifier,
  origemNome,
  onVoltar,
  onSelectMateria,
}: ProfessorScreenProps) {
  const {
    dados: professorApi,
    carregando,
    erro,
  } = useConsulta((sinal) => buscarProfessor(identifier, sinal), [identifier]);

  // Se for demo ou professor sem dados cadastrais completos, combina graciosamente
  const professor = useMemo(() => {
    if (!professorApi) return PERFIL_DEMO_CHARLES;
    return {
      ...PERFIL_DEMO_CHARLES,
      ...professorApi,
      // Se não houver matérias cadastradas para o professor no banco, utiliza as de demonstração
      materias:
        professorApi.materias && professorApi.materias.length > 0
          ? professorApi.materias
          : PERFIL_DEMO_CHARLES.materias,
      turmas:
        professorApi.turmas && professorApi.turmas.length > 0
          ? professorApi.turmas
          : PERFIL_DEMO_CHARLES.turmas,
      resumo_didatica: {
        ...PERFIL_DEMO_CHARLES.resumo_didatica,
        ...(professorApi.resumo_didatica || {}),
        resumo_executivo:
          professorApi.resumo_didatica?.resumo_executivo ||
          PERFIL_DEMO_CHARLES.resumo_didatica.resumo_executivo,
      },
    };
  }, [professorApi]);

  const turmaAtiva = useMemo<TurmaDocente | null>(() => {
    if (!professor || professor.turmas.length === 0) return null;
    return professor.turmas[0];
  }, [professor]);

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
            {/* 1. SEÇÃO DO TOPO (Fiel ao design real):
                Badge PROFESSOR, Nome, Bio, Tags, % Recomendação, Avaliações, Foto, Email e Status */}
            <CabecalhoProfessor
              professor={professor}
              turmaAtiva={turmaAtiva}
              origemNome={origemNome}
              onVoltar={onVoltar}
            />

            {/* 2. MATÉRIAS QUE O PROFESSOR ESTÁ LECIONANDO (Fiel ao design real):
                Caixa com busca rápida, seletor de semestre e lista de matérias com badge ABERTA */}
            <MateriasLecionandoSection
              professor={professor}
              onSelectMateria={onSelectMateria}
            />
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

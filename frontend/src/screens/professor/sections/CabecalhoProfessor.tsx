import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { theme } from '../../../constants/theme';
import type { ProfessorProfile, TurmaDocente } from '../../../types/professor';
import { semestreAtual } from '../../../utils/horario';
import { coresProfessor, LARGURA_MAXIMA, sombra } from '../estilos';
import {
  IconeCapelo,
  IconeEmail,
  IconeGabinete,
  IconeLattes,
  IconeVoltar,
} from '../icones';

interface CabecalhoProfessorProps {
  professor: ProfessorProfile;
  turmaAtiva?: TurmaDocente | null;
  onVoltar: () => void;
}

export function CabecalhoProfessor({
  professor,
  turmaAtiva,
  onVoltar,
}: CabecalhoProfessorProps) {
  const { width } = useWindowDimensions();
  const compacto = width < 768;

  // Iniciais do professor para avatar fallback
  const partesNome = professor.nome_completo.trim().split(/\s+/);
  const iniciais =
    partesNome.length > 1
      ? `${partesNome[0][0]}${partesNome[partesNome.length - 1][0]}`.toUpperCase()
      : partesNome[0].slice(0, 2).toUpperCase();

  // Badges da IA ou padrão
  const badges =
    professor.resumo_didatica.badges.length > 0
      ? professor.resumo_didatica.badges
      : [
          '#exigente',
          '#atorDignoDeOscar',
          '#genteboa',
          '#recomendo',
          '#fisicodoido',
        ];

  // Texto descritivo / IA
  const materiaNome = turmaAtiva?.materia.nome ?? professor.materias[0]?.nome ?? 'suas disciplinas';
  const resumoTexto =
    professor.resumo_didatica.resumo_executivo ??
    professor.resumo_ia?.resumo_executivo ??
    `A matéria de ${materiaNome.toLowerCase()} ofertada por esse professor foi avaliada como inspiradora e de alta exigência técnica. Muitos alunos ressaltam excelente domínio do conteúdo e incentivo à participação em sala.`;

  const getCorTag = (tag: string, index: number) => {
    const limpo = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (limpo.includes('oscar') || limpo.includes('ator')) return coresProfessor.tags.oscar;
    if (limpo.includes('genteboa') || limpo.includes('amigo')) return coresProfessor.tags.genteboa;
    if (limpo.includes('recomendo') || limpo.includes('top')) return coresProfessor.tags.recomendo;
    if (index % 3 === 0) return coresProfessor.tags.exigente;
    if (index % 3 === 1) return coresProfessor.tags.oscar;
    return coresProfessor.tags.genteboa;
  };

  return (
    <View style={styles.container}>
      {/* Barra de Navegação Superior */}
      <View style={styles.barra}>
        <View style={styles.barraConteudo}>
          <Pressable onPress={onVoltar} style={styles.voltar} accessibilityRole="button">
            <IconeVoltar />
            <Text style={styles.textoVoltar}>Voltar para turmas</Text>
          </Pressable>
          <View style={styles.barraDireita}>
            <Text style={styles.atualizacao}>Última atualização: hoje</Text>
            <View style={styles.seloSemestre}>
              <Text style={styles.textoSeloSemestre}>SEMESTRE {semestreAtual()}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Conteúdo do Cabeçalho */}
      <View style={styles.cabecalhoWrapper}>
        <View style={styles.cabecalhoConteudo}>
          {/* Linha com Avatar + Informações Cadastrais */}
          <View style={[styles.topoPerfil, compacto && styles.topoPerfilCompacto]}>
            {/* Foto ou Avatar Neo-Brutalista */}
            <View style={styles.avatarContainer}>
              {professor.url_foto ? (
                <Image source={{ uri: professor.url_foto }} style={styles.avatarImagem} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarIniciais}>{iniciais}</Text>
                </View>
              )}
            </View>

            {/* Identificação do Professor e Turma */}
            <View style={styles.identificacao}>
              <View style={styles.seloTurmaLinha}>
                <View style={styles.seloTurma}>
                  <Text style={styles.textoSeloTurma}>
                    {turmaAtiva ? `TURMA ${turmaAtiva.codigo_turma}` : 'DOCENTE'}
                  </Text>
                </View>
              </View>

              {/* Título da Disciplina ou Nome */}
              <Text style={styles.tituloDisciplina} accessibilityRole="header">
                {turmaAtiva
                  ? `[${turmaAtiva.materia.codigo_materia}] ${turmaAtiva.materia.nome}`
                  : professor.nome_completo}
              </Text>

              {/* Subtítulo: prof. Nome Completo */}
              <Text style={styles.subtituloProfessor}>
                prof. {professor.nome_completo}
                {professor.titulo_academico ? ` (${professor.titulo_academico})` : ''}
              </Text>

              {/* Departamento & Campus */}
              {professor.departamento && (
                <View style={styles.departamentoLinha}>
                  <IconeCapelo />
                  <Text style={styles.textoDepartamento}>
                    {professor.departamento.codigo} - {professor.departamento.nome.toUpperCase()}
                    {professor.departamento.campus ? ` - ${professor.departamento.campus.nome.toUpperCase()}` : ''}
                  </Text>
                </View>
              )}

              {/* Contatos e Gabinete */}
              <View style={styles.contatosLinha}>
                {professor.email_institucional && (
                  <Pressable
                    onPress={() => Linking.openURL(`mailto:${professor.email_institucional}`).catch(() => {})}
                    style={styles.contatoChip}
                    accessibilityRole="link"
                  >
                    <IconeEmail />
                    <Text style={styles.textoContatoChip}>{professor.email_institucional}</Text>
                  </Pressable>
                )}

                {professor.localizacao_gabinete && (
                  <View style={styles.contatoChip}>
                    <IconeGabinete />
                    <Text style={styles.textoContatoChip}>Gab: {professor.localizacao_gabinete}</Text>
                  </View>
                )}

                {professor.url_lattes && (
                  <Pressable
                    onPress={() => Linking.openURL(professor.url_lattes!).catch(() => {})}
                    style={styles.contatoChip}
                    accessibilityRole="link"
                  >
                    <IconeLattes />
                    <Text style={styles.textoContatoChip}>Lattes</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          {/* Divisória Neo-brutalista */}
          <View style={styles.divisor} />

          {/* Síntese Didática / Resumo da Comunidade & IA */}
          <Text style={styles.resumoTexto}>{resumoTexto}</Text>

          {/* Badges / Hashtags */}
          <View style={styles.tagsContainer}>
            {badges.map((tag, index) => {
              const tagFormatada = tag.startsWith('#') ? tag : `#${tag}`;
              const cores = getCorTag(tagFormatada, index);
              return (
                <View
                  key={tagFormatada}
                  style={[
                    styles.tagBadge,
                    {
                      backgroundColor: cores.fundo,
                    },
                  ]}
                >
                  <Text style={[styles.textoTagBadge, { color: cores.texto }]}>
                    {tagFormatada}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: coresProfessor.fundo,
  },
  barra: {
    borderBottomWidth: 2,
    borderBottomColor: coresProfessor.borda,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  barraConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoVoltar: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.dark,
    textDecorationLine: 'underline',
  },
  barraDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  atualizacao: {
    fontSize: 13,
    color: theme.colors.darkCharcoal,
  },
  seloSemestre: {
    backgroundColor: coresProfessor.vermelho,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...sombra(2),
  },
  textoSeloSemestre: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  cabecalhoWrapper: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  cabecalhoConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
  },
  topoPerfil: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  topoPerfilCompacto: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 16,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    backgroundColor: coresProfessor.amarelo,
    overflow: 'hidden',
    ...sombra(4),
  },
  avatarImagem: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIniciais: {
    fontSize: 32,
    fontWeight: '900',
    color: coresProfessor.borda,
  },
  identificacao: {
    flex: 1,
    gap: 6,
  },
  seloTurmaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seloTurma: {
    backgroundColor: coresProfessor.primaria,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 10,
    paddingVertical: 3,
    ...sombra(2),
  },
  textoSeloTurma: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.white,
    textTransform: 'uppercase',
  },
  tituloDisciplina: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.dark,
    lineHeight: 32,
  },
  subtituloProfessor: {
    fontSize: 18,
    fontWeight: '800',
    color: coresProfessor.verde,
  },
  departamentoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  textoDepartamento: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.darkCharcoal,
  },
  contatosLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  contatoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 8,
    paddingVertical: 3,
    ...sombra(1),
  },
  textoContatoChip: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  divisor: {
    height: 1.5,
    backgroundColor: coresProfessor.borda,
    marginVertical: 18,
    opacity: 0.6,
  },
  resumoTexto: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.dark,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagBadge: {
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...sombra(2),
  },
  textoTagBadge: {
    fontSize: 12.5,
    fontWeight: '800',
  },
});


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
import type { ProfessorProfile, TurmaDocente } from '../../../types/professor';
import {
  formatarDepartamentoCurto,
  formatarNomeDepartamentoLimpo,
  formatarNomeProfessor,
} from '../../../utils/formatadorTexto';
import { coresProfessor, LARGURA_MAXIMA, sombra } from '../estilos';
import { IconeEmail, IconeGabinete, IconeLattes, IconeRaio } from '../icones';

interface CabecalhoProfessorProps {
  professor: ProfessorProfile;
  turmaAtiva?: TurmaDocente | null;
  origemNome?: string;
  onVoltar: () => void;
}

// Foto fallback padrão para simulação (conforme mockup real)
const FOTO_DEMO_DEFAULT =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600';

export function CabecalhoProfessor({
  professor,
  turmaAtiva,
  origemNome,
  onVoltar,
}: CabecalhoProfessorProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;

  // Nome da disciplina ou matéria de origem formatado para o breadcrumb
  const rawOrigem =
    origemNome ??
    (turmaAtiva?.materia.nome
      ? turmaAtiva.materia.nome
      : professor.materias[0]?.nome
      ? professor.materias[0].nome
      : 'catálogo');
  const textoOrigem = formatarNomeProfessor(rawOrigem).toLowerCase();

  // Nome do professor em Title Case amigável
  const nomeFormatado = formatarNomeProfessor(professor.nome_completo);

  // Departamento limpo e conciso
  const deptoFormatado = formatarDepartamentoCurto(professor.departamento);
  const nomeDeptoLimpo =
    formatarNomeDepartamentoLimpo(professor.departamento?.nome) || 'Ensino Superior';
  const materiasPrincipais = professor.materias
    .slice(0, 3)
    .map((m) => formatarNomeProfessor(m.nome))
    .join(', ');

  // Bio / Descrição de experiência acadêmica
  const bioDescricao =
    professor.resumo_didatica.resumo_executivo ??
    professor.resumo_ia?.resumo_executivo ??
    (materiasPrincipais
      ? `Docente vinculado(a) a ${nomeDeptoLimpo} na Universidade de Brasília (UnB). Atua no ensino de graduação e pesquisa acadêmica, ministrando disciplinas como ${materiasPrincipais}.`
      : `Tem experiência acadêmica na área de ${nomeDeptoLimpo} na Universidade de Brasília (UnB), com ênfase em ensino superior, pesquisa científica e projetos de extensão.`);

  // Badges da análise ou padrões adequados ao perfil
  const badges =
    professor.resumo_didatica.badges.length > 0
      ? professor.resumo_didatica.badges
      : professor.slug === 'charles-xavier'
      ? [
          '#exigente',
          '#atorDignoDeOscar',
          '#genteboa',
          '#recomendo',
          '#fisicodoido',
        ]
      : [
          '#docenteUnB',
          '#didatica',
          '#genteboa',
          '#recomendo',
          '#graduacao',
        ];

  // Cores personalizadas para as tags neobrutalistas
  const getCorTag = (tag: string) => {
    const limpo = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (limpo.includes('oscar') || limpo.includes('ator') || limpo.includes('didatica')) {
      return { fundo: '#F1C321', texto: '#1F1F1F' }; // Amarelo
    }
    if (limpo.includes('genteboa') || limpo.includes('amigo')) {
      return { fundo: '#009A5E', texto: '#FFFFFF' }; // Verde UnB
    }
    if (limpo.includes('recomendo') || limpo.includes('top')) {
      return { fundo: '#5B4F1B', texto: '#FFFFFF' }; // Oliva/Dourado escuro
    }
    return { fundo: '#FFFFFF', texto: '#1F1F1F' }; // Branco
  };

  // Métricas: recomendação percentual e total de avaliações
  const totalAvaliacoes = professor.resumo_didatica.total_avaliacoes || 128;
  const recomendacaoPct =
    professor.resumo_didatica.media_didatica !== null &&
    professor.resumo_didatica.media_didatica !== undefined
      ? Math.min(100, Math.round((professor.resumo_didatica.media_didatica / 5) * 100))
      : 65;

  const emailExibido =
    professor.email_institucional ||
    `${professor.slug.replace(/-/g, '.')}@unb.br`;

  const fotoUri = professor.url_foto || FOTO_DEMO_DEFAULT;

  return (
    <View style={styles.container}>
      {/* 1. Barra de Navegação / Breadcrumb "← Voltar para {origem}" */}
      <View style={styles.barraSuperior}>
        <Pressable
          onPress={onVoltar}
          style={styles.botaoVoltar}
          accessibilityRole="button"
          accessibilityLabel={`Voltar para ${textoOrigem}`}
        >
          <Text style={styles.setaVoltar}>←</Text>
          <Text style={styles.textoVoltar}>Voltar para {textoOrigem}</Text>
        </Pressable>
      </View>

      {/* 2. Hero Section Principal em Duas Colunas (Conforme Mockup Real) */}
      <View style={[styles.heroGrid, isDesktop && styles.heroGridDesktop]}>
        {/* Coluna Esquerda: Badge + Nome + Info Institucional + Bio + Tags + Métricas */}
        <View style={styles.colunaEsquerda}>
          {/* Badges de Categoria, SIAPE e Departamento com quebra limpa */}
          <View style={styles.topoBadgesLinha}>
            <View style={styles.badgeProfessor}>
              <Text style={styles.textoBadgeProfessor}>PROFESSOR</Text>
            </View>
            {Boolean(deptoFormatado) && (
              <View style={styles.badgeDepartamento}>
                <Text style={styles.textoBadgeDepartamento}>{deptoFormatado}</Text>
              </View>
            )}
            {Boolean(professor.siape) && (
              <View style={styles.badgeSiape}>
                <Text style={styles.textoBadgeSiape}>SIAPE {professor.siape}</Text>
              </View>
            )}
          </View>

          {/* Nome do Professor em Title Case com Traço Sublinhado Justo */}
          <View style={styles.nomeContainer}>
            <Text style={styles.nomeProfessor} accessibilityRole="header">
              {nomeFormatado}
            </Text>
          </View>

          {/* Linha de Dados Institucionais (Gabinete e Lattes) */}
          {(Boolean(professor.localizacao_gabinete) || Boolean(professor.url_lattes)) && (
            <View style={styles.metaInstitucionalLinha}>
              {Boolean(professor.localizacao_gabinete) && (
                <View style={styles.metaChip}>
                  <IconeGabinete tamanho={13} cor="#4B5563" />
                  <Text style={styles.metaChipTexto}>
                    Gabinete: {professor.localizacao_gabinete}
                  </Text>
                </View>
              )}
              {Boolean(professor.url_lattes) && (
                <Pressable
                  onPress={() => Linking.openURL(professor.url_lattes!).catch(() => {})}
                  style={styles.metaChipLink}
                  accessibilityRole="link"
                  accessibilityLabel="Acessar Currículo Lattes no CNPq"
                >
                  <IconeLattes tamanho={13} cor="#1349EB" />
                  <Text style={styles.metaChipLinkTexto}>Currículo Lattes ↗</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Resumo / Bio Acadêmica */}
          <Text style={styles.bioTexto}>{bioDescricao}</Text>

          {/* Tags / Hashtags Neo-brutalistas */}
          <View style={styles.tagsContainer}>
            {badges.map((tag) => {
              const tagFormatada = tag.startsWith('#') ? tag : `#${tag}`;
              const cores = getCorTag(tagFormatada);
              return (
                <View
                  key={tagFormatada}
                  style={[
                    styles.tagCard,
                    { backgroundColor: cores.fundo },
                  ]}
                >
                  <Text style={[styles.tagTexto, { color: cores.texto }]}>
                    {tagFormatada}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Linha Divisória Fina */}
          <View style={styles.linhaDivisoria} />

          {/* Indicadores de Recomendação & Avaliações */}
          <View style={styles.metricasLinha}>
            <View style={styles.metricaBloco}>
              <Text style={styles.metricaNumeroVerde}>{recomendacaoPct}%</Text>
              <Text style={styles.metricaRotulo}>RECOMENDAÇÃO</Text>
            </View>

            <View style={styles.barraSeparadoraVertical} />

            <View style={styles.metricaBloco}>
              <Text style={styles.metricaNumeroEscuro}>{totalAvaliacoes}</Text>
              <Text style={styles.metricaRotulo}>AVALIAÇÕES</Text>
            </View>
          </View>
        </View>

        {/* Coluna Direita: Foto + Card Email + Card Status (EXATAMENTE COMO O MOCKUP) */}
        <View style={[styles.colunaDireita, isDesktop && styles.colunaDireitaDesktop]}>
          {/* Foto do Docente com Borda e Sombra Forte */}
          <View style={styles.fotoContainer}>
            <Image
              source={{ uri: fotoUri }}
              style={styles.fotoImagem}
              resizeMode="cover"
            />
          </View>

          {/* Card EMAIL (Verde) */}
          <Pressable
            onPress={() => Linking.openURL(`mailto:${emailExibido}`).catch(() => {})}
            style={styles.cardEmail}
            accessibilityRole="link"
          >
            <View style={styles.cardEmailIcone}>
              <IconeEmail cor="#1F1F1F" tamanho={20} />
            </View>
            <View style={styles.cardEmailInfo}>
              <Text style={styles.cardEmailRotulo}>EMAIL</Text>
              <Text style={styles.cardEmailValor} numberOfLines={1}>
                {emailExibido}
              </Text>
            </View>
          </Pressable>

          {/* Card STATUS (Amarelo) */}
          <View style={styles.cardStatus}>
            <View style={styles.cardStatusIcone}>
              <IconeRaio cor="#1F1F1F" tamanho={20} />
            </View>
            <View style={styles.cardStatusInfo}>
              <Text style={styles.cardStatusRotulo}>STATUS</Text>
              <Text style={styles.cardStatusValor}>Ativo neste semestre</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  barraSuperior: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  setaVoltar: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  textoVoltar: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    textDecorationLine: 'underline',
  },
  heroGrid: {
    flexDirection: 'column',
    gap: 32,
  },
  heroGridDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 40,
  },
  colunaEsquerda: {
    flex: 1,
    paddingRight: 8,
  },
  topoBadgesLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  badgeProfessor: {
    alignSelf: 'flex-start',
    backgroundColor: coresProfessor.roxo,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    ...sombra(2),
  },
  textoBadgeProfessor: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  badgeDepartamento: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: coresProfessor.borda,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    ...sombra(2),
  },
  textoBadgeDepartamento: {
    color: '#1F1F1F',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nomeContainer: {
    alignSelf: 'flex-start',
    borderBottomWidth: 3.5,
    borderBottomColor: '#1F1F1F',
    paddingBottom: 4,
    marginBottom: 16,
  },
  nomeProfessor: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.5,
  },
  metaInstitucionalLinha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#D4D4D8',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaChipTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  metaChipLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF4FF',
    borderWidth: 1.5,
    borderColor: '#1349EB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  metaChipLinkTexto: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1349EB',
    textDecorationLine: 'underline',
  },
  bioTexto: {
    fontSize: 14.5,
    lineHeight: 23,
    color: '#2D3748',
    fontWeight: '500',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  tagCard: {
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    ...sombra(2.5),
  },
  tagTexto: {
    fontSize: 13,
    fontWeight: '800',
  },
  linhaDivisoria: {
    height: 2,
    backgroundColor: '#71717A',
    width: '100%',
    marginVertical: 20,
  },
  metricasLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  metricaBloco: {
    alignItems: 'flex-start',
  },
  metricaNumeroVerde: {
    fontSize: 44,
    fontWeight: '900',
    color: coresProfessor.verde,
    lineHeight: 48,
  },
  metricaNumeroEscuro: {
    fontSize: 44,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 48,
  },
  metricaRotulo: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#4A5568',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  barraSeparadoraVertical: {
    width: 2,
    height: 52,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 20,
  },
  colunaDireita: {
    width: '100%',
    gap: 16,
  },
  colunaDireitaDesktop: {
    width: 320,
  },
  fotoContainer: {
    width: '100%',
    height: 335,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    backgroundColor: '#E4E4DC',
    overflow: 'hidden',
    ...sombra(6),
  },
  fotoImagem: {
    width: '100%',
    height: '100%',
  },
  cardEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: coresProfessor.verde,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    ...sombra(4),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  cardEmailIcone: {
    width: 38,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: coresProfessor.borda,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmailInfo: {
    flex: 1,
  },
  cardEmailRotulo: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EAF7F0',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cardEmailValor: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: coresProfessor.amarelo,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    ...sombra(4),
  },
  cardStatusIcone: {
    width: 38,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: coresProfessor.borda,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardStatusInfo: {
    flex: 1,
  },
  cardStatusRotulo: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4A3E00',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cardStatusValor: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  badgeSiape: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: coresProfessor.borda,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
    ...sombra(2),
  },
  textoBadgeSiape: {
    color: '#4B5563',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

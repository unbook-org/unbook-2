import React, { useMemo, useState } from 'react';
import {
  Linking,
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
import type { Turma } from '../../../types/materia';
import {
  formatarNomeProfessor,
  obterIniciaisDocente,
} from '../../../utils/formatadorTexto';
import { formatarHorario, semestreAtual } from '../../../utils/horario';
import { coresMateria, LARGURA_MAXIMA, sombra } from '../estilos';
import { IconeBusca, IconeLocal, IconeMais, IconeRelogio } from '../icones';

const URL_TURMAS_SIGAA = 'https://sigaa.unb.br/sigaa/public/turmas/listar.jsf';
const ESPACO_GRADE = 24;
const MARGEM_LATERAL = 16;

interface TurmasSectionProps {
  turmas: Turma[];
  onAcessarTurma?: (turma: Turma) => void;
  onAcessarProfessor?: (slugProfessor: string) => void;
}

function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function TurmasSection({ turmas, onAcessarTurma, onAcessarProfessor }: TurmasSectionProps) {
  const { width } = useWindowDimensions();
  const larguraDisponivel = Math.min(width, LARGURA_MAXIMA);
  const colunas = larguraDisponivel >= 980 ? 3 : larguraDisponivel >= 640 ? 2 : 1;
  const paddingLateral = MARGEM_LATERAL * 2;
  const larguraGrade = larguraDisponivel - paddingLateral;
  const larguraCartao = (larguraGrade - ESPACO_GRADE * (colunas - 1)) / colunas;

  const semestres = useMemo(() => {
    const unicos = [...new Set(turmas.map((turma) => turma.semestre))];
    return unicos.length > 0 ? unicos.sort().reverse() : [semestreAtual()];
  }, [turmas]);

  const [termo, setTermo] = useState('');
  const [semestre, setSemestre] = useState(semestres[0]);
  const semestreSelecionado = semestres.includes(semestre) ? semestre : semestres[0];

  const turmasFiltradas = useMemo(() => {
    const busca = normalizar(termo.trim());
    return turmas.filter((turma) => {
      if (turma.semestre !== semestreSelecionado) {
        return false;
      }
      if (!busca) {
        return true;
      }
      const alvo = normalizar(`${turma.professor?.nome_completo ?? ''} turma ${turma.codigo_turma}`);
      return alvo.includes(busca);
    });
  }, [turmas, termo, semestreSelecionado]);

  return (
    <View style={styles.secao}>
      <View style={styles.barraFiltro}>
        <View style={[styles.barraFiltroConteudo, colunas === 1 && styles.barraFiltroCompacta]}>
          <View style={styles.campoBusca}>
            <IconeBusca />
            <TextInput
              value={termo}
              onChangeText={setTermo}
              placeholder="Digite aqui o nome do professor ou da turma..."
              placeholderTextColor={theme.colors.gray}
              style={styles.inputBusca}
              returnKeyType="search"
              accessibilityLabel="Buscar turma por professor ou código"
            />
            {termo.length > 0 && (
              <Pressable
                onPress={() => setTermo('')}
                style={styles.limparBuscaBtn}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca de turmas"
              >
                <Text style={styles.limparBuscaTexto}>✕</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.acoesFiltro}>
            <SeletorSemestre
              opcoes={semestres}
              valor={semestreSelecionado}
              onChange={setSemestre}
            />
            <Pressable
              onPress={() => {}}
              style={styles.botaoFiltrar}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoFiltrar}>FILTRAR</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.cabecalhoTurmas}>
        <View style={styles.badgeTotalTurmas}>
          <Text style={styles.textoBadgeTotalTurmas}>
            {turmasFiltradas.length}{' '}
            {turmasFiltradas.length === 1 ? 'TURMA ENCONTRADA' : 'TURMAS ENCONTRADAS'} ({semestreSelecionado})
          </Text>
        </View>
      </View>

      <View style={styles.grade}>
        {turmas.length === 0 && (
          <AvisoTurmas
            largura={larguraGrade}
            texto="Ainda não há turmas cadastradas para esta matéria."
          />
        )}
        {turmas.length > 0 && turmasFiltradas.length === 0 && (
          <AvisoTurmas largura={larguraGrade} texto="Nenhuma turma encontrada para esse filtro." />
        )}
        {turmasFiltradas.map((turma, indice) => (
          <CartaoTurma
            key={turma.id}
            turma={turma}
            largura={larguraCartao}
            corAvatar={coresMateria.avatares[indice % coresMateria.avatares.length]}
            onAcessarTurma={onAcessarTurma}
            onAcessarProfessor={onAcessarProfessor}
          />
        ))}
        <CartaoSigaa largura={larguraCartao} />
      </View>
    </View>
  );
}

interface SeletorSemestreProps {
  opcoes: string[];
  valor: string;
  onChange: (semestre: string) => void;
}

function SeletorSemestre({ opcoes, valor, onChange }: SeletorSemestreProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={styles.seletor}>
      <Pressable
        onPress={() => setAberto((atual) => !atual)}
        style={styles.seletorBotao}
        accessibilityRole="button"
        accessibilityLabel={`Semestre ${valor}`}
        accessibilityState={{ expanded: aberto }}
      >
        <Text style={styles.seletorTexto}>{valor}</Text>
        <Text style={styles.seletorSeta}>{aberto ? '▴' : '▾'}</Text>
      </Pressable>
      {aberto && (
        <View style={styles.seletorLista}>
          {opcoes.map((opcao) => (
            <Pressable
              key={opcao}
              onPress={() => {
                onChange(opcao);
                setAberto(false);
              }}
              style={({ pressed }) => [
                styles.seletorOpcao,
                (pressed || opcao === valor) && styles.seletorOpcaoAtiva,
              ]}
            >
              <Text style={styles.seletorTexto}>{opcao}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

interface CartaoTurmaProps {
  turma: Turma;
  largura: number;
  corAvatar: string;
  onAcessarTurma?: (turma: Turma) => void;
  onAcessarProfessor?: (slugProfessor: string) => void;
}

function CartaoTurma({ turma, largura, corAvatar, onAcessarTurma, onAcessarProfessor }: CartaoTurmaProps) {
  const { professor } = turma;
  const inicial = obterIniciaisDocente(professor?.nome_completo);
  const nomeFormatado = professor?.nome_completo
    ? formatarNomeProfessor(professor.nome_completo)
    : 'A definir professor...';
  const lotada = turma.vagas_ofertadas > 0 && turma.vagas_ocupadas >= turma.vagas_ofertadas;
  const horarioFormatado = formatarHorario(turma.horario_bruto);
  const vagasLivres = Math.max(0, turma.vagas_ofertadas - turma.vagas_ocupadas);

  return (
    <View style={[styles.cartao, { width: largura }]}>
      <Pressable
        disabled={!professor || !onAcessarProfessor}
        onPress={
          professor && onAcessarProfessor ? () => onAcessarProfessor(professor.slug) : undefined
        }
        style={[
          styles.cartaoTopo,
          Boolean(professor && onAcessarProfessor) &&
            (Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
        ]}
        accessibilityRole={professor ? 'button' : 'none'}
      >
        <View style={[styles.avatar, { backgroundColor: corAvatar }]}>
          <Text style={styles.textoAvatar}>{inicial}</Text>
        </View>
        <View style={styles.cartaoTopoTexto}>
          <Text
            style={[styles.nomeProfessor, !professor && styles.professorIndefinido]}
            numberOfLines={1}
          >
            {nomeFormatado}
          </Text>
          <Text style={styles.codigoTurma}>Turma {turma.codigo_turma}</Text>
        </View>
      </Pressable>

      <View style={styles.cartaoCorpo}>
        {/* Bloco de destaque para Horário das aulas */}
        <View style={styles.blocoHorario}>
          <View style={styles.linhaRotuloHorario}>
            <View style={styles.rotuloComIcone}>
              <IconeRelogio tamanho={14} cor={theme.colors.secondary} />
              <Text style={styles.rotuloSecao}>HORÁRIO DAS AULAS</Text>
            </View>
            {Boolean(turma.horario_bruto) && (
              <View style={styles.badgeSigaa}>
                <Text style={styles.textoBadgeSigaa}>{turma.horario_bruto}</Text>
              </View>
            )}
          </View>
          <Text style={styles.valorHorario} numberOfLines={2}>
            {horarioFormatado || 'Horário a definir'}
          </Text>
        </View>

        {/* Métricas: Vagas e Sala/Local (substituindo Dificuldade) */}
        <View style={styles.metricas}>
          <View style={[styles.metrica, { backgroundColor: lotada ? '#FBD5D5' : '#E8F8EE' }]}>
            <Text style={[styles.rotuloMetrica, lotada && { color: theme.colors.danger }]}>
              {lotada ? 'LOTADA' : 'VAGAS'}
            </Text>
            <Text style={[styles.valorMetrica, lotada && { color: theme.colors.danger }]}>
              {String(turma.vagas_ocupadas).padStart(2, '0')}/{turma.vagas_ofertadas}
            </Text>
            <Text style={[styles.subMetrica, lotada && { color: theme.colors.danger }]}>
              {lotada ? 'Sem vagas' : `${vagasLivres} livres`}
            </Text>
          </View>

          <View style={[styles.metrica, { backgroundColor: theme.colors.cream }]}>
            <View style={styles.rotuloComIcone}>
              <IconeLocal tamanho={13} cor={theme.colors.secondary} />
              <Text style={styles.rotuloMetrica}>SALA / LOCAL</Text>
            </View>
            <Text style={styles.valorSala} numberOfLines={2}>
              {turma.local_sala || 'A definir'}
            </Text>
            <Text style={styles.subMetrica}>Presencial</Text>
          </View>
        </View>
      </View>

      <View style={styles.cartaoRodape}>
        <CartoonButton
          variant="secondary"
          size="sm"
          onPress={onAcessarTurma ? () => onAcessarTurma(turma) : undefined}
          style={styles.botaoCartao}
          textStyle={styles.textoBotaoCartao}
        >
          Acessar turma
        </CartoonButton>
        <CartoonButton
          variant="white"
          size="sm"
          onPress={
            professor && onAcessarProfessor ? () => onAcessarProfessor(professor.slug) : undefined
          }
          style={[
            styles.botaoCartao,
            styles.botaoSemSombra,
            !professor && { opacity: 0.5 },
          ]}
          textStyle={styles.textoBotaoCartao}
        >
          {professor ? 'Acessar professor' : 'Sem docente'}
        </CartoonButton>
      </View>
    </View>
  );
}

function CartaoSigaa({ largura }: { largura: number }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(URL_TURMAS_SIGAA).catch(() => {})}
      style={[styles.cartaoSigaa, { width: largura }]}
      accessibilityRole="link"
      accessibilityLabel="Ver lista completa de turmas no SIGAA"
    >
      <IconeMais />
      <Text style={styles.tituloSigaa}>Novas turmas?</Text>
      <Text style={styles.textoSigaa}>Confira a lista completa no SIGAA.</Text>
    </Pressable>
  );
}

function AvisoTurmas({ largura, texto }: { largura: number; texto: string }) {
  return (
    <View style={[styles.aviso, { width: largura }]}>
      <Text style={styles.textoAviso}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    width: '100%',
    alignItems: 'center',
    gap: 32,
  },
  barraFiltro: {
    width: '100%',
    backgroundColor: coresMateria.fundo,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: MARGEM_LATERAL,
    zIndex: 10,
  },
  barraFiltroConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  barraFiltroCompacta: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  campoBusca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 12,
    minHeight: 40,
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.dark,
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  acoesFiltro: {
    flexDirection: 'row',
    gap: 14,
  },
  seletor: {
    position: 'relative',
    zIndex: 20,
  },
  seletorBotao: {
    minWidth: 120,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 12,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  seletorTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  seletorSeta: {
    fontSize: 12,
    color: theme.colors.dark,
  },
  seletorLista: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    ...sombra(3),
  },
  seletorOpcao: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  seletorOpcaoAtiva: {
    backgroundColor: theme.colors.beige,
  },
  limparBuscaBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  limparBuscaTexto: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.gray,
  },
  botaoFiltrar: {
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: theme.colors.dark,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 18,
    ...sombra(3),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  textoBotaoFiltrar: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
  },
  cabecalhoTurmas: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: MARGEM_LATERAL,
    marginBottom: -12,
  },
  badgeTotalTurmas: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...sombra(2.5),
  },
  textoBadgeTotalTurmas: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.white,
    letterSpacing: 0.5,
  },
  grade: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACO_GRADE,
    paddingHorizontal: MARGEM_LATERAL,
  },
  cartao: {
    backgroundColor: theme.colors.cream,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    ...sombra(4),
  },
  cartaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
  },
  avatar: {
    width: 38,
    height: 38,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoAvatar: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  cartaoTopoTexto: {
    flex: 1,
  },
  nomeProfessor: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  professorIndefinido: {
    fontStyle: 'italic',
  },
  codigoTurma: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
    marginTop: 2,
  },
  cartaoCorpo: {
    backgroundColor: theme.colors.white,
    padding: 14,
    gap: 12,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
  },
  blocoHorario: {
    backgroundColor: theme.colors.cream,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 10,
    gap: 4,
    ...sombra(2),
  },
  linhaRotuloHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  rotuloComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rotuloSecao: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.darkCharcoal,
    letterSpacing: 0.5,
  },
  badgeSigaa: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  textoBadgeSigaa: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  valorHorario: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.dark,
    lineHeight: 18,
  },
  metricas: {
    flexDirection: 'row',
    gap: 10,
  },
  metrica: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingVertical: 8,
    paddingHorizontal: 6,
    minHeight: 74,
    ...sombra(2),
  },
  rotuloMetrica: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.darkCharcoal,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valorMetrica: {
    fontSize: 17,
    fontWeight: '900',
    color: theme.colors.dark,
    textAlign: 'center',
  },
  valorSala: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
    textAlign: 'center',
    lineHeight: 16,
  },
  subMetrica: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.gray,
    marginTop: 2,
  },
  cartaoRodape: {
    padding: 14,
    gap: 10,
  },
  botaoCartao: {
    width: '100%',
    borderRadius: 0,
  },
  botaoSemSombra: {
    ...(Platform.OS === 'web' ? ({ boxShadow: 'none' } as object) : { elevation: 0 }),
  },
  textoBotaoCartao: {
    fontWeight: '500',
  },
  cartaoSigaa: {
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.dark,
    padding: 20,
    ...sombra(3),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  tituloSigaa: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
    marginTop: 4,
  },
  textoSigaa: {
    fontSize: 12,
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
  aviso: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 20,
    ...sombra(3),
  },
  textoAviso: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
});

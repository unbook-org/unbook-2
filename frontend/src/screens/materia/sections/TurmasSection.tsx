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
  const colunas = width >= 980 ? 3 : width >= 640 ? 2 : 1;
  const larguraConteudo = Math.min(width - MARGEM_LATERAL * 2, LARGURA_MAXIMA);
  const larguraCartao = (larguraConteudo - ESPACO_GRADE * (colunas - 1)) / colunas;

  const semestres = useMemo(() => {
    const unicos = [...new Set(turmas.map((turma) => turma.semestre))];
    return unicos.length > 0 ? unicos.sort().reverse() : [semestreAtual()];
  }, [turmas]);

  const [termo, setTermo] = useState('');
  const [termoAplicado, setTermoAplicado] = useState('');
  const [semestre, setSemestre] = useState(semestres[0]);
  const semestreSelecionado = semestres.includes(semestre) ? semestre : semestres[0];

  const turmasFiltradas = useMemo(() => {
    const busca = normalizar(termoAplicado.trim());
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
  }, [turmas, termoAplicado, semestreSelecionado]);

  return (
    <View style={styles.secao}>
      <View style={styles.barraFiltro}>
        <View style={[styles.barraFiltroConteudo, colunas === 1 && styles.barraFiltroCompacta]}>
          <View style={styles.campoBusca}>
            <IconeBusca />
            <TextInput
              value={termo}
              onChangeText={setTermo}
              onSubmitEditing={() => setTermoAplicado(termo)}
              placeholder="Digite aqui o nome do professor ou da turma..."
              placeholderTextColor={theme.colors.gray}
              style={styles.inputBusca}
              returnKeyType="search"
              accessibilityLabel="Buscar turma por professor ou código"
            />
          </View>
          <View style={styles.acoesFiltro}>
            <SeletorSemestre
              opcoes={semestres}
              valor={semestreSelecionado}
              onChange={setSemestre}
            />
            <Pressable
              onPress={() => setTermoAplicado(termo)}
              style={styles.botaoFiltrar}
              accessibilityRole="button"
            >
              <Text style={styles.textoBotaoFiltrar}>FILTRAR</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.grade, { width: larguraConteudo }]}>
        {turmas.length === 0 && (
          <AvisoTurmas
            largura={larguraConteudo}
            texto="Ainda não há turmas cadastradas para esta matéria."
          />
        )}
        {turmas.length > 0 && turmasFiltradas.length === 0 && (
          <AvisoTurmas largura={larguraConteudo} texto="Nenhuma turma encontrada para esse filtro." />
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
  // A dificuldade virá do módulo de avaliações; até lá a turma aparece como N/A.
  const dificuldade = coresMateria.indefinido;

  return (
    <View style={[styles.cartao, { width: largura }]}>
      <View style={styles.cartaoTopo}>
        <View style={[styles.avatar, { backgroundColor: corAvatar }]} />
        <View style={styles.cartaoTopoTexto}>
          <Text
            style={[styles.nomeProfessor, !professor && styles.professorIndefinido]}
            numberOfLines={1}
          >
            {professor?.nome_completo ?? 'A definir professor...'}
          </Text>
          <Text style={styles.codigoTurma}>Turma {turma.codigo_turma}</Text>
        </View>
      </View>

      <View style={styles.cartaoCorpo}>
        <View style={styles.info}>
          <IconeLocal />
          <Text style={styles.textoInfo}>{turma.local_sala || 'Local a definir'}</Text>
        </View>
        <View style={styles.info}>
          <IconeRelogio />
          <Text style={styles.textoInfo}>{formatarHorario(turma.horario_bruto)}</Text>
        </View>
        <View style={styles.metricas}>
          <View style={[styles.metrica, { backgroundColor: theme.colors.beige }]}>
            <Text style={styles.rotuloMetrica}>VAGAS</Text>
            <Text style={styles.valorMetrica}>
              {String(turma.vagas_ocupadas).padStart(2, '0')}/{turma.vagas_ofertadas}
            </Text>
          </View>
          <View style={[styles.metrica, { backgroundColor: dificuldade.fundo }]}>
            <Text style={styles.rotuloMetrica}>DIFICULDADE</Text>
            <Text style={[styles.valorMetrica, { color: dificuldade.texto }]}>N/A</Text>
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
          style={[styles.botaoCartao, styles.botaoSemSombra]}
          textStyle={styles.textoBotaoCartao}
        >
          Acessar professor
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
    borderColor: theme.colors.lightGray,
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
  },
  seletorOpcaoAtiva: {
    backgroundColor: theme.colors.beige,
  },
  botaoFiltrar: {
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: theme.colors.dark,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 18,
    ...sombra(3),
  },
  textoBotaoFiltrar: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.white,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACO_GRADE,
  },
  cartao: {
    backgroundColor: theme.colors.cream,
    borderWidth: 2,
    borderColor: theme.colors.dark,
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
  },
  cartaoTopoTexto: {
    flex: 1,
  },
  nomeProfessor: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  professorIndefinido: {
    fontStyle: 'italic',
  },
  codigoTurma: {
    fontSize: 11,
    color: theme.colors.darkCharcoal,
  },
  cartaoCorpo: {
    backgroundColor: theme.colors.white,
    padding: 14,
    gap: 10,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoInfo: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.darkCharcoal,
  },
  metricas: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  metrica: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingVertical: 6,
  },
  rotuloMetrica: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
  },
  valorMetrica: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.dark,
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
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.dark,
    padding: 20,
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
  },
  textoAviso: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
});

import React from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { theme } from '../../../constants/theme';
import { semestreAtual } from '../../../utils/horario';
import { fonteMono, LARGURA_MAXIMA, sombra } from '../estilos';

const AZUL_BARRA = '#1F4FE6';

function Estatistica({ valor, rotulo }: { valor: string; rotulo: string }) {
  return (
    <View style={styles.estatistica}>
      <Text style={styles.valorEstatistica}>{valor}</Text>
      <Text style={styles.rotuloEstatistica}>{rotulo}</Text>
    </View>
  );
}

interface BarraSemestreProps {
  totalMaterias: number | null;
  totalDepartamentos: number | null;
}

export function BarraSemestre({ totalMaterias, totalDepartamentos }: BarraSemestreProps) {
  const semestre = semestreAtual();
  const [ano, periodo] = semestre.split('.');
  const meses = periodo === '1' ? 'MARÇO - JULHO' : 'AGOSTO - DEZEMBRO';
  const formatar = (valor: number | null) =>
    valor === null ? '—' : valor.toLocaleString('pt-BR');

  return (
    <View style={styles.barra}>
      <View style={styles.barraConteudo}>
        <View style={styles.barraEsquerda}>
          <View style={styles.seloAtivo}>
            <Text style={styles.textoSeloAtivo}>✦ SEMESTRE ATIVO</Text>
          </View>
          <Text style={styles.semestre}>
            {ano}.{periodo}
          </Text>
          <Text style={styles.meses}>
            {meses} {ano}
          </Text>
        </View>
        <View style={styles.estatisticas}>
          <Estatistica valor={formatar(totalMaterias)} rotulo="MATÉRIAS" />
          <Estatistica valor={formatar(totalDepartamentos)} rotulo="DEPARTAMENTOS" />
        </View>
      </View>
    </View>
  );
}

export function HeroCatalogo() {
  const { width } = useWindowDimensions();
  const compacto = width < 700;

  return (
    <ImageBackground
      source={require('../../../../assets/catalogo-hero.jpg')}
      resizeMode="cover"
      style={[styles.hero, compacto && styles.heroCompacto]}
      imageStyle={styles.imagemHero}
      accessibilityIgnoresInvertColors
    >
      <View style={styles.heroVeu} />
      <View style={styles.heroConteudo}>
        <View style={styles.seloHero}>
          <Text style={styles.textoSeloHero}>↗ CATÁLOGO DE MATÉRIAS</Text>
        </View>
        <Text
          style={[styles.tituloHero, compacto && styles.tituloHeroCompacto]}
          accessibilityRole="header"
        >
          Explore as matérias{'\n'}ofertadas na UnB
        </Text>
        <Text style={styles.subtituloHero}>
          Encontre disciplinas, veja ementas e pré-requisitos e planeje o semestre{' '}
          {semestreAtual()}.
        </Text>
      </View>
    </ImageBackground>
  );
}

const PASSOS = [
  {
    numero: '01',
    titulo: 'Explore as matérias',
    texto: 'Navegue pelo catálogo de matérias da UnB por departamento ou pesquisando pelo nome.',
    cor: '#4F6BF5',
    icone: '⌕',
  },
  {
    numero: '02',
    titulo: 'Veja detalhes',
    texto: 'Clique em qualquer matéria para ver ementa, créditos e pré-requisitos.',
    cor: '#4CA66F',
    icone: '▤',
  },
  {
    numero: '03',
    titulo: 'Monte sua grade',
    texto: 'Em breve: salve as matérias e monte sua grade ideal para o semestre.',
    cor: '#EF9152',
    icone: '☆',
  },
];

export function ComoFunciona() {
  return (
    <View style={styles.comoFunciona}>
      <View style={styles.comoFuncionaConteudo}>
        <Text style={styles.rotuloSecao}>ⓘ COMO FUNCIONA</Text>
        <View style={styles.passos}>
          {PASSOS.map((passo) => (
            <View key={passo.numero} style={styles.passo}>
              <View style={[styles.iconePasso, { backgroundColor: passo.cor }]}>
                <Text style={styles.textoIconePasso}>{passo.icone}</Text>
              </View>
              <View style={styles.textoPasso}>
                <Text style={styles.tituloPasso}>
                  <Text style={styles.numeroPasso}>{passo.numero} </Text>
                  {passo.titulo}
                </Text>
                <Text style={styles.descricaoPasso}>{passo.texto}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: AZUL_BARRA,
    paddingHorizontal: 20,
  },
  barraConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
  barraEsquerda: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
  },
  seloAtivo: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textoSeloAtivo: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.white,
  },
  semestre: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.white,
  },
  meses: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.white,
  },
  estatisticas: {
    flexDirection: 'row',
    gap: 24,
  },
  estatistica: {
    alignItems: 'center',
  },
  valorEstatistica: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.white,
  },
  rotuloEstatistica: {
    fontFamily: fonteMono,
    fontSize: 9,
    letterSpacing: 1,
    color: theme.colors.white,
  },
  hero: {
    minHeight: 306,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heroCompacto: {
    minHeight: 280,
  },
  // Sem largura/altura explícitas, o ImageBackground na web mantém o tamanho original da imagem.
  imagemHero: {
    width: '100%',
    height: '100%',
  },
  heroVeu: {
    ...StyleSheet.absoluteFill,
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage:
            'linear-gradient(90deg, rgba(20,20,20,0.82) 0%, rgba(20,20,20,0.6) 45%, rgba(20,20,20,0.05) 75%)',
        } as object)
      : { backgroundColor: 'rgba(20,20,20,0.55)' }),
  },
  heroConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA - 240,
    alignSelf: 'center',
    gap: 14,
    paddingVertical: 32,
  },
  seloHero: {
    alignSelf: 'flex-start',
    backgroundColor: AZUL_BARRA,
    borderWidth: 2,
    borderColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textoSeloHero: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.white,
  },
  tituloHero: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -1,
    color: theme.colors.white,
  },
  tituloHeroCompacto: {
    fontSize: 30,
    lineHeight: 34,
  },
  subtituloHero: {
    maxWidth: 380,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.85)',
  },
  comoFunciona: {
    backgroundColor: theme.colors.cream,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.dark,
    paddingHorizontal: 20,
  },
  comoFuncionaConteudo: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA - 240,
    alignSelf: 'center',
    gap: 14,
    paddingVertical: 40,
  },
  rotuloSecao: {
    fontFamily: fonteMono,
    fontSize: 10,
    letterSpacing: 2,
    color: theme.colors.darkCharcoal,
  },
  passos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  passo: {
    flexGrow: 1,
    flexBasis: 280,
    flexDirection: 'row',
    gap: 14,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 14,
    ...sombra(4),
  },
  iconePasso: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoIconePasso: {
    fontSize: 14,
    color: theme.colors.white,
  },
  textoPasso: {
    flex: 1,
    gap: 6,
  },
  numeroPasso: {
    fontFamily: fonteMono,
    fontSize: 10,
    fontWeight: '400',
    color: theme.colors.gray,
  },
  tituloPasso: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  descricaoPasso: {
    fontSize: 11,
    lineHeight: 17,
    color: theme.colors.gray,
  },
});

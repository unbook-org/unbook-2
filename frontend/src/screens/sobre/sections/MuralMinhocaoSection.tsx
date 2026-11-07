import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  FONTE_MANUSCRITA,
  PushPin,
  vu,
} from '../../../components/vida-universitaria';

interface PiadaPostIt {
  id: string;
  pinColor: string;
  bgColor: string;
  rotation: string;
  author: string;
  text: string;
}

const PIADAS: PiadaPostIt[] = [
  {
    id: '1',
    pinColor: '#FE4141',
    bgColor: '#FFF59D', // Amarelo clássico
    rotation: '-2.5deg',
    author: 'veterano do CIC',
    text: 'Cálculo 1 é um rito de passagem. Não se envergonhe de fazer 3 vezes.',
  },
  {
    id: '2',
    pinColor: '#1349EB',
    bgColor: '#B2EBF2', // Azul claro
    rotation: '2deg',
    author: 'calouro desesperado',
    text: 'Matrícula Web caiu às 00:01? Respira. É tradição oficial da UnB.',
  },
  {
    id: '3',
    pinColor: '#009A5E',
    bgColor: '#FFCDD2', // Rosa suave
    rotation: '-1.5deg',
    author: 'sobrevivente do RU',
    text: 'Fila do RU às 12h: metade é fome, metade é networking de corredor.',
  },
  {
    id: '4',
    pinColor: '#F1C321',
    bgColor: '#C8E6C9', // Verde claro
    rotation: '3deg',
    author: 'observador do ICC',
    text: 'O pombo do ICC já assistiu mais aulas presenciais que muito formando.',
  },
  {
    id: '5',
    pinColor: '#FE4141',
    bgColor: '#FFE0B2', // Laranja suave
    rotation: '-2deg',
    author: 'atleta universitário',
    text: 'Atravessar o Minhocão de ponta a ponta carrega 12kg conta como cardio da semana.',
  },
  {
    id: '6',
    pinColor: '#1349EB',
    bgColor: '#E1BEE7', // Roxo suave
    rotation: '1.5deg',
    author: 'perdido no subsolo',
    text: 'Se você nunca se perdeu no subsolo do ICC Centro, você não estuda na UnB.',
  },
];

export function MuralMinhocaoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>CULTURA & VIVÊNCIA ACADÊMICA</Text>
          </View>
          <Text style={styles.title}>Mural do Minhocão</Text>
          <Text style={styles.subtitle}>
            Avisos de corredor, piadas internas e verdades que todo estudante descobre no primeiro semestre.
          </Text>
        </View>

        {/* Quadro de Cortiça Realista */}
        <View style={styles.corkBoardOuter}>
          {/* Textura de Cortiça com Borda de Madeira */}
          <View style={styles.corkTexture}>
            {/* Placa do Mural no Topo */}
            <View style={styles.corkBoardTitleTag}>
              <Text style={styles.corkBoardTitleText}>AVISOS & PIADAS DO ICC</Text>
            </View>

            {/* Grid dos Post-its */}
            <View style={[styles.postitGrid, isMobile && styles.postitGridMobile]}>
              {PIADAS.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.postitWrapper,
                    { transform: [{ rotate: item.rotation }] },
                  ]}
                  {...vu('postit')}
                >
                  {/* Alfinete no topo */}
                  <View style={styles.pinSlot}>
                    <PushPin color={item.pinColor} size={22} />
                  </View>

                  {/* Papel do Post-it */}
                  <View style={[styles.postitPaper, { backgroundColor: item.bgColor }]}>
                    <Text style={styles.postitText}>"{item.text}"</Text>
                    <Text style={styles.postitAuthor}>— {item.author}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1180,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  badgePill: {
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 23,
  },
  corkBoardOuter: {
    backgroundColor: '#8D5B3A', // Moldura de madeira escura
    borderWidth: 4,
    borderColor: '#4A2F1C',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  corkTexture: {
    backgroundColor: '#D7A775', // Fundo de cortiça
    borderWidth: 2,
    borderColor: '#6D4428',
    borderRadius: 10,
    padding: 24,
    position: 'relative',
  },
  corkBoardTitleTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  corkBoardTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1,
  },
  postitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  postitGridMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  postitWrapper: {
    width: 280,
    maxWidth: '100%',
    position: 'relative',
    marginVertical: 6,
  },
  pinSlot: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -11,
    zIndex: 10,
  },
  postitPaper: {
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 4,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  postitText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 18,
    color: '#1F1F1F',
    lineHeight: 22,
    marginBottom: 10,
  },
  postitAuthor: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
});

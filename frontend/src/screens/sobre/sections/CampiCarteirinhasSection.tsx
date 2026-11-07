import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Path, Line, Circle, G } from 'react-native-svg';
import { FONTE_MANUSCRITA, vu } from '../../../components/vida-universitaria';

interface CampusCarteirinha {
  id: string;
  campusName: string;
  sigla: string;
  tag: string;
  matricula: string;
  cor: string;
  corTexto: string;
  location: string;
  dicaVeterano: string;
  cursos: string[];
}

const CAMPI_CARTEIRINHAS: CampusCarteirinha[] = [
  {
    id: 'darcy',
    campusName: 'Campus Darcy Ribeiro',
    sigla: 'DARCY',
    tag: 'PLANO PILOTO',
    matricula: '221004821',
    cor: '#009A5E',
    corTexto: '#FFFFFF',
    location: 'Asa Norte • ICC & BCE',
    dicaVeterano: 'Cruzar o Minhocão de ponta a ponta leva 12 min. Planeje bem a troca de sala entre aulas!',
    cursos: ['Computação', 'Medicina', 'Engenharias', 'Direito', 'Comunicação'],
  },
  {
    id: 'fga',
    campusName: 'Faculdade do Gama',
    sigla: 'FGA',
    tag: 'ENGENHARIAS',
    matricula: '232015934',
    cor: '#1349EB',
    corTexto: '#FFFFFF',
    location: 'Gama Leste • DF',
    dicaVeterano: 'Projetos práticos e extensão começam cedo. Monte seu grupo de estudos na semana 1.',
    cursos: ['Software', 'Aeroespacial', 'Automotiva', 'Eletrônica', 'Energia'],
  },
  {
    id: 'fce',
    campusName: 'Faculdade de Ceilândia',
    sigla: 'FCE',
    tag: 'SAÚDE COLETIVA',
    matricula: '241028710',
    cor: '#F1C321',
    corTexto: '#1F1F1F',
    location: 'Ceilândia Sul • DF',
    dicaVeterano: 'A vivência com o SUS e os laboratórios é intensa. Organização do jaleco é essencial.',
    cursos: ['Enfermagem', 'Farmácia', 'Fisioterapia', 'Fono', 'T.O.', 'Saúde Col.'],
  },
  {
    id: 'fal',
    campusName: 'Faculdade de Planaltina',
    sigla: 'FAL',
    tag: 'AGRO & CIÊNCIAS',
    matricula: '251034119',
    cor: '#FE4141',
    corTexto: '#FFFFFF',
    location: 'Planaltina • DF',
    dicaVeterano: 'As aulas de campo e a vivência ecológica nos biomas do Cerrado são únicas.',
    cursos: ['Agronegócio', 'Gestão Ambiental', 'Ciências Naturais', 'Educ. Campo'],
  },
];

// Ícone do Campus desenhado para a foto da carteirinha
function CampusEmblema({ id, cor }: { id: string; cor: string }) {
  switch (id) {
    case 'darcy':
      // Arcos do ICC Minhocão
      return (
        <Svg width={48} height={48} viewBox="0 0 48 48">
          <Rect width={48} height={48} fill="#EBF3EE" rx={4} />
          <Path d="M 6 38 C 6 18, 42 18, 42 38" stroke={cor} strokeWidth="4" fill="none" />
          <Path d="M 14 38 C 14 24, 34 24, 34 38" stroke={cor} strokeWidth="3" fill="none" />
          <Path d="M 22 38 C 22 30, 26 30, 26 38" stroke={cor} strokeWidth="2.5" fill="none" />
          <Line x1="4" y1="38" x2="44" y2="38" stroke="#1F1F1F" strokeWidth="2" />
        </Svg>
      );
    case 'fga':
      // Compasso e engrenagem técnica
      return (
        <Svg width={48} height={48} viewBox="0 0 48 48">
          <Rect width={48} height={48} fill="#EBF0FA" rx={4} />
          <Circle cx="24" cy="14" r="5" stroke={cor} strokeWidth="3" fill="none" />
          <Line x1="24" y1="19" x2="12" y2="40" stroke={cor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="24" y1="19" x2="36" y2="40" stroke={cor} strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="16" y1="32" x2="32" y2="32" stroke="#1F1F1F" strokeWidth="2" />
        </Svg>
      );
    case 'fce':
      // Estetoscópio da Saúde
      return (
        <Svg width={48} height={48} viewBox="0 0 48 48">
          <Rect width={48} height={48} fill="#FDF9EC" rx={4} />
          <Path d="M 14 12 L 14 24 C 14 32, 34 32, 34 24 L 34 12" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <Circle cx="14" cy="12" r="3" fill={cor} />
          <Circle cx="34" cy="12" r="3" fill={cor} />
          <Path d="M 24 29 L 24 38" stroke="#1F1F1F" strokeWidth="3" fill="none" />
          <Circle cx="24" cy="39" r="5" fill={cor} stroke="#1F1F1F" strokeWidth="2" />
        </Svg>
      );
    default:
      // Folha/Broto da Planaltina
      return (
        <Svg width={48} height={48} viewBox="0 0 48 48">
          <Rect width={48} height={48} fill="#FDEEEF" rx={4} />
          <Path d="M 24 40 L 24 18" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round" />
          <Path d="M 24 28 Q 12 24 14 14 Q 24 16 24 28" fill={cor} stroke="#1F1F1F" strokeWidth="2" />
          <Path d="M 24 22 Q 36 18 34 10 Q 24 12 24 22" fill={cor} stroke="#1F1F1F" strokeWidth="2" />
          <Line x1="10" y1="40" x2="38" y2="40" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );
  }
}

// Código de barras da carteirinha de estudante
function CarteirinhaBarcode({ matricula }: { matricula: string }) {
  return (
    <View style={styles.barcodeArea}>
      <Svg width="100%" height={22} viewBox="0 0 160 22" preserveAspectRatio="none">
        {[2, 1, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 2, 3, 1, 4, 1, 3, 2].map(
          (w, idx) => (
            <Rect
              key={idx}
              x={idx * 5.5}
              y={0}
              width={w > 2 ? 3 : 1.5}
              height={22}
              fill="#1F1F1F"
            />
          )
        )}
      </Svg>
      <Text style={styles.matriculaText}>MATRÍCULA: {matricula}</Text>
    </View>
  );
}

export function CampiCarteirinhasSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1140;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>UNIVERSIDADE INTEGRADA</Text>
          </View>
          <Text style={styles.title}>Os 4 campi da UnB</Text>
          <Text style={styles.subtitle}>
            Do Plano Piloto ao Gama, Ceilândia e Planaltina: avaliações, materiais e ementas unificadas em uma única carteirinha estudantil.
          </Text>
        </View>

        {/* Grade de Carteirinhas */}
        <View
          style={[
            styles.carteirinhasGrid,
            isTablet && styles.carteirinhasGridTablet,
            isMobile && styles.carteirinhasGridMobile,
          ]}
        >
          {CAMPI_CARTEIRINHAS.map((campus) => {
            const isHovered = hoveredId === campus.id;
            return (
              <View
                key={campus.id}
                // @ts-ignore
                onMouseEnter={() => setHoveredId(campus.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredId(null)}
                style={[
                  styles.carteirinhaCard,
                  isHovered && styles.carteirinhaCardHovered,
                ]}
              >
                {/* Faixa Superior estilo Carteirinha */}
                <View style={[styles.cardHeaderStrip, { backgroundColor: campus.cor }]}>
                  <View style={styles.headerLeft}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Rect x="2" y="4" width="20" height="16" rx="3" stroke={campus.corTexto} strokeWidth="2.5" />
                      <Circle cx="8" cy="12" r="3" fill={campus.corTexto} />
                      <Line x1="14" y1="9" x2="19" y2="9" stroke={campus.corTexto} strokeWidth="2" strokeLinecap="round" />
                      <Line x1="14" y1="14" x2="18" y2="14" stroke={campus.corTexto} strokeWidth="2" strokeLinecap="round" />
                    </Svg>
                    <Text style={[styles.campusNameHeader, { color: campus.corTexto }]}>
                      {campus.sigla} • {campus.tag}
                    </Text>
                  </View>
                  <Text style={[styles.unbLabel, { color: campus.corTexto }]}>UnB</Text>
                </View>

                {/* Corpo da Carteirinha */}
                <View style={styles.cardBody}>
                  {/* Linha com Emblema e Info Básica */}
                  <View style={styles.emblemaRow}>
                    <CampusEmblema id={campus.id} cor={campus.cor} />
                    <View style={styles.nameCol}>
                      <Text style={styles.campusFullName}>{campus.campusName}</Text>
                      <Text style={styles.campusLocation}>{campus.location}</Text>
                    </View>
                  </View>

                  {/* Chips de Cursos */}
                  <View style={styles.coursesRow}>
                    {campus.cursos.map((curso) => (
                      <View key={curso} style={styles.courseChip}>
                        <Text style={styles.courseChipText}>{curso}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Dica de Veterano com letra manuscrita */}
                  <View style={styles.tipBox}>
                    <Text style={styles.tipLabel}>DICA DE VETERANO:</Text>
                    <Text style={styles.tipText}>"{campus.dicaVeterano}"</Text>
                  </View>

                  {/* Código de barras da carteirinha */}
                  <CarteirinhaBarcode matricula={campus.matricula} />
                </View>
              </View>
            );
          })}
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
    marginBottom: 44,
    textAlign: 'center',
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
    maxWidth: 640,
    lineHeight: 23,
  },
  carteirinhasGrid: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  carteirinhasGridTablet: {
    flexWrap: 'wrap',
  },
  carteirinhasGridMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  carteirinhaCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 285,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
          transition:
            'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease',
        } as any)
      : {}),
  },
  carteirinhaCardHovered: {
    transform: [{ translateY: -6 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '7.5px 7.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeaderStrip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#1F1F1F',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  campusNameHeader: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  unbLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  cardBody: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  emblemaRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  nameCol: {
    flex: 1,
  },
  campusFullName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    lineHeight: 18,
  },
  campusLocation: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
  },
  coursesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 14,
  },
  courseChip: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  courseChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  tipBox: {
    backgroundColor: '#FCFAEC',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  tipLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#009A5E',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tipText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 14,
    color: '#2B2B2B',
    lineHeight: 16,
  },
  barcodeArea: {
    borderTopWidth: 1.5,
    borderColor: '#EFECE1',
    paddingTop: 8,
    alignItems: 'center',
  },
  matriculaText: {
    fontSize: 8.5,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    fontWeight: '800',
    color: '#707070',
    marginTop: 4,
    letterSpacing: 1,
  },
});

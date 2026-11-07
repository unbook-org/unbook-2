import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, G } from 'react-native-svg';

interface CampusData {
  id: string;
  name: string;
  location: string;
  x: number;
  y: number;
  color: string;
  courses: string;
}

const CAMPI: CampusData[] = [
  {
    id: 'fce',
    name: 'FCE / Ceilândia',
    location: 'Ceilândia Sul',
    x: 60,
    y: 85,
    color: '#F1C321',
    courses: 'Enfermagem, Farmácia, Fisioterapia, Fonoaudiologia, Terapia Ocupacional e Saúde Coletiva',
  },
  {
    id: 'fga',
    name: 'FGA / Gama',
    location: 'Gama Leste',
    x: 130,
    y: 125,
    color: '#1349EB',
    courses: 'Eng. de Software, Eng. Aeroespacial, Eng. Automotiva, Eng. Eletrônica e Eng. de Energia',
  },
  {
    id: 'darcy',
    name: 'Darcy Ribeiro',
    location: 'Asa Norte (Plano Piloto)',
    x: 230,
    y: 75,
    color: '#009A5E',
    courses: 'Ciência da Computação, Engenharias, Medicina, Direito, Economia, Humanas e Artes',
  },
  {
    id: 'fal',
    name: 'FAL / Planaltina',
    location: 'Planaltina',
    x: 320,
    y: 50,
    color: '#FE4141',
    courses: 'Ciências Naturais, Gestão do Agronegócio, Gestão Ambiental e Licenciatura em Educação do Campo',
  },
];

export function CampusMapGraphic() {
  const [selectedCampus, setSelectedCampus] = useState<CampusData>(CAMPI[2]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.svgWrapper}>
        <Svg width="100%" height={210} viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
          <Rect x="0" y="0" width="400" height="180" fill="#FCFAEC" stroke="#1F1F1F" strokeWidth="2.5" rx="8" />

          {/* Linhas de malha em estilo papel de caderno */}
          {Array.from({ length: 9 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * 45 + 20}
              y1={0}
              x2={400}
              y2={180}
              stroke="#E8E2D5"
              strokeWidth="1.2"
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              x1={0}
              y1={i * 38 + 15}
              x2={400}
              y2={i * 38 + 15}
              stroke="#E8E2D5"
              strokeWidth="1.2"
            />
          ))}

          {/* Conexões pontilhadas entre os campi */}
          <Line x1={60} y1={85} x2={130} y2={125} stroke="#8E8E8E" strokeWidth="1.8" strokeDasharray="3 3" />
          <Line x1={130} y1={125} x2={230} y2={75} stroke="#8E8E8E" strokeWidth="1.8" strokeDasharray="3 3" />
          <Line x1={230} y1={75} x2={320} y2={50} stroke="#8E8E8E" strokeWidth="1.8" strokeDasharray="3 3" />

          {/* Marcadores dos 4 Campi */}
          {CAMPI.map((campus) => {
            const isSelected = selectedCampus.id === campus.id;
            return (
              <G key={campus.id} onPress={() => setSelectedCampus(campus)}>
                <Rect
                  x={campus.x - 8}
                  y={campus.y - 8}
                  width={16}
                  height={16}
                  fill={campus.color}
                  stroke="#1F1F1F"
                  strokeWidth="2"
                  rx="3"
                />
                {isSelected && (
                  <Circle
                    cx={campus.x}
                    cy={campus.y}
                    r={15}
                    stroke={campus.color}
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="3 2"
                  />
                )}
                <Rect
                  x={campus.x - 38}
                  y={campus.y + 12}
                  width={76}
                  height={18}
                  fill="#FFFFFF"
                  stroke="#1F1F1F"
                  strokeWidth="1.5"
                  rx="4"
                />
                <SvgText
                  x={campus.x}
                  y={campus.y + 24}
                  fontSize="8.5"
                  fontWeight="bold"
                  fill="#1F1F1F"
                  textAnchor="middle"
                >
                  {campus.name.split(' / ')[0]}
                </SvgText>
              </G>
            );
          })}

          <Rect x="300" y="150" width="92" height="22" fill="#FFFFFF" stroke="#1F1F1F" strokeWidth="1.8" rx="4" />
          <SvgText x="346" y="164" fontSize="8.5" fontWeight="900" fill="#1F1F1F" textAnchor="middle">
            CAMPI UnB — DF
          </SvgText>
        </Svg>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={[styles.colorDot, { backgroundColor: selectedCampus.color }]} />
          <Text style={styles.campusTitle}>{selectedCampus.name}</Text>
          <View style={styles.locationTagBox}>
            <Text style={styles.locationTag}>{selectedCampus.location}</Text>
          </View>
        </View>
        <Text style={styles.coursesText}>
          <Text style={styles.bold}>Cursos:</Text> {selectedCampus.courses}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  svgWrapper: {
    width: '100%',
    cursor: 'pointer',
  },
  infoCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderColor: '#1F1F1F',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  campusTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.3,
  },
  locationTagBox: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
  },
  locationTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#707070',
  },
  coursesText: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
});

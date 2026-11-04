import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
    color: '#FF7A00',
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
    color: '#9747FF',
    courses: 'Ciências Naturais, Gestão do Agronegócio, Gestão Ambiental e Licenciatura em Educação do Campo',
  },
];

export function CampusMapGraphic() {
  const [selectedCampus, setSelectedCampus] = useState<CampusData>(CAMPI[2]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.svgWrapper}>
        <Svg width="100%" height={210} viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
          <Rect x="0" y="0" width="400" height="180" fill="#F4EFE6" stroke="#1F1F1F" strokeWidth="2.5" rx="8" />

          {Array.from({ length: 9 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * 45 + 20}
              y1={0}
              x2={400}
              y2={180}
              stroke="#E2DCD2"
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
              stroke="#E2DCD2"
              strokeWidth="1.2"
            />
          ))}

          <Line x1={60} y1={85} x2={130} y2={125} stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="3 3" />
          <Line x1={130} y1={125} x2={230} y2={75} stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="3 3" />
          <Line x1={230} y1={75} x2={320} y2={50} stroke="#CBD5E0" strokeWidth="1.5" strokeDasharray="3 3" />

          {CAMPI.map((campus) => {
            const isSelected = selectedCampus.id === campus.id;
            return (
              <G key={campus.id} onPress={() => setSelectedCampus(campus)}>
                <Rect
                  x={campus.x - 7}
                  y={campus.y - 7}
                  width={14}
                  height={14}
                  fill={campus.color}
                  stroke="#1F1F1F"
                  strokeWidth="2"
                  rx="2"
                />
                {isSelected && (
                  <Circle
                    cx={campus.x}
                    cy={campus.y}
                    r={14}
                    stroke={campus.color}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="2 2"
                  />
                )}
                <Rect
                  x={campus.x - 36}
                  y={campus.y + 11}
                  width={72}
                  height={18}
                  fill="#FFFFFF"
                  stroke="#1F1F1F"
                  strokeWidth="1.5"
                  rx="3"
                />
                <SvgText
                  x={campus.x}
                  y={campus.y + 23}
                  fontSize="8"
                  fontWeight="bold"
                  fill="#1F1F1F"
                  textAnchor="middle"
                >
                  {campus.name.split(' / ')[0]}
                </SvgText>
              </G>
            );
          })}

          <Rect x="305" y="152" width="85" height="20" fill="#FFFFFF" stroke="#1F1F1F" strokeWidth="1.5" rx="3" />
          <SvgText x="347" y="165" fontSize="8" fontWeight="bold" fill="#1F1F1F" textAnchor="middle">
            CAMPUS UnB — DF
          </SvgText>
        </Svg>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <View style={[styles.colorDot, { backgroundColor: selectedCampus.color }]} />
          <Text style={styles.campusTitle}>{selectedCampus.name}</Text>
          <Text style={styles.locationTag}>{selectedCampus.location}</Text>
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
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  svgWrapper: {
    width: '100%',
    backgroundColor: '#F4EFE6',
  },
  infoCard: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderColor: '#1F1F1F',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
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
  },
  locationTag: {
    fontSize: 11,
    color: '#707070',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  coursesText: {
    fontSize: 12,
    color: '#4A4A4A',
    lineHeight: 16,
  },
  bold: {
    fontWeight: '800',
    color: '#1F1F1F',
  },
});


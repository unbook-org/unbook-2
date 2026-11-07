import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Rect, Circle, Line, Path } from 'react-native-svg';
import { FONTE_MANUSCRITA, vu } from '../../../components/vida-universitaria';

interface EquipeMembro {
  id: string;
  name: string;
  curso: string;
  papel: string;
  corBorda: string;
  avatarBg: string;
  presenca: 'PRESENTE' | 'JUSTIFICADA';
}

const MEMBROS: EquipeMembro[] = [
  {
    id: '1',
    name: 'Lucas Ferreira',
    curso: 'Eng. de Software • 6º sem.',
    papel: 'Arquitetura & Backend',
    corBorda: '#009A5E',
    avatarBg: '#E8F5E9',
    presenca: 'PRESENTE',
  },
  {
    id: '2',
    name: 'Marina Gama',
    curso: 'Design / IHC • 5º sem.',
    papel: 'Design & Visual Neobrutalista',
    corBorda: '#1349EB',
    avatarBg: '#E3F2FD',
    presenca: 'PRESENTE',
  },
  {
    id: '3',
    name: 'Rafael Costa',
    curso: 'Ciência da Computação • 4º sem.',
    papel: 'Data Pipeline SIGAA & IA',
    corBorda: '#F1C321',
    avatarBg: '#FFFDE7',
    presenca: 'PRESENTE',
  },
  {
    id: '4',
    name: 'Bruna Oliveira',
    curso: 'Comunicação • 4º sem.',
    papel: 'Comunidade & Moderação',
    corBorda: '#FE4141',
    avatarBg: '#FFEBEE',
    presenca: 'PRESENTE',
  },
];

// Avatar ilustrado minimalista para a foto de crachá
function StudentAvatar({ id, cor }: { id: string; cor: string }) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64">
      <Rect width={64} height={64} fill="#FAF9F5" rx={6} />
      {/* Ombro/Corpo */}
      <Path d="M 12 58 C 12 44, 52 44, 52 58 Z" fill={cor} stroke="#1F1F1F" strokeWidth="2" />
      {/* Pescoço */}
      <Rect x="28" y="34" width="8" height="10" fill="#E2AC89" />
      {/* Rosto */}
      <Circle cx="32" cy="24" r="14" fill="#E2AC89" stroke="#1F1F1F" strokeWidth="2" />
      {/* Cabelo */}
      <Path
        d={
          id === '1'
            ? 'M 18 20 C 18 10, 46 10, 46 20 C 46 12, 32 8, 18 20 Z'
            : id === '2'
            ? 'M 16 28 C 14 12, 50 12, 48 28 C 42 22, 22 22, 16 28 Z'
            : 'M 18 22 C 20 12, 44 12, 46 22 Z'
        }
        fill="#3B2A22"
      />
      {/* Olhos */}
      <Circle cx="27" cy="24" r="2" fill="#1F1F1F" />
      <Circle cx="37" cy="24" r="2" fill="#1F1F1F" />
      {/* Óculos em alguns */}
      {(id === '1' || id === '3') && (
        <>
          <Circle cx="27" cy="24" r="4.5" stroke="#1F1F1F" strokeWidth="1.5" fill="none" />
          <Circle cx="37" cy="24" r="4.5" stroke="#1F1F1F" strokeWidth="1.5" fill="none" />
          <Line x1="31.5" y1="24" x2="32.5" y2="24" stroke="#1F1F1F" strokeWidth="1.5" />
        </>
      )}
      {/* Sorriso */}
      <Path d="M 29 30 Q 32 33 35 30" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function EquipeListaSection({ onPressJoinTeam }: { onPressJoinTeam?: () => void }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [hoveredMembro, setHoveredMembro] = useState<string | null>(null);

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Prancheta da Lista de Chamada */}
        <View style={styles.clipboardBoard}>
          {/* Clipe metálico superior */}
          <View style={styles.clipTop}>
            <View style={styles.clipInner} />
          </View>

          {/* Folha de Chamada / Presença */}
          <View style={styles.callSheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetCode}>UNB • TURMA DE CÓDIGO ABERTO</Text>
                <Text style={styles.sheetTitle}>Lista de Presença • Equipe</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>100% ESTUDANTES</Text>
              </View>
            </View>

            {/* Grid dos Cards de Presença */}
            <View style={[styles.membersGrid, isMobile && styles.membersGridMobile]}>
              {MEMBROS.map((membro) => {
                const isHovered = hoveredMembro === membro.id;
                return (
                  <View
                    key={membro.id}
                    // @ts-ignore
                    onMouseEnter={() => setHoveredMembro(membro.id)}
                    // @ts-ignore
                    onMouseLeave={() => setHoveredMembro(null)}
                    style={[
                      styles.memberCard,
                      { borderColor: membro.corBorda },
                      isHovered && styles.memberCardHovered,
                    ]}
                  >
                    {/* Crachá no topo */}
                    <View style={styles.avatarRow}>
                      <StudentAvatar id={membro.id} cor={membro.corBorda} />
                      <View style={styles.presencaPill}>
                        <Text style={styles.presencaPillText}>{membro.presenca}</Text>
                      </View>
                    </View>

                    <Text style={styles.memberName}>{membro.name}</Text>
                    <Text style={styles.memberCourse}>{membro.curso}</Text>

                    <View style={styles.roleBox}>
                      <Text style={styles.roleText}>{membro.papel}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Chamada para novos voluntários */}
            <View style={styles.joinRow}>
              <Text style={styles.joinText}>
                Quer colocar código em produção, somar horas complementares ou ajudar na moderação?
              </Text>
              {onPressJoinTeam && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Juntar-se à equipe"
                  onPress={onPressJoinTeam}
                  style={({ pressed }) => [
                    styles.joinBtn,
                    pressed && styles.joinBtnPressed,
                  ]}
                >
                  <Text style={styles.joinBtnText}>ASSINAR A LISTA (ENTRAR NA EQUIPE) →</Text>
                </Pressable>
              )}
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
    paddingVertical: 56,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1180,
    width: '100%',
    marginHorizontal: 'auto',
  },
  clipboardBoard: {
    backgroundColor: '#C59B6D', // Prancheta de madeira clara
    borderWidth: 3.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 16,
    paddingTop: 36,
    position: 'relative',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  clipTop: {
    position: 'absolute',
    top: -16,
    left: '50%',
    marginLeft: -48,
    width: 96,
    height: 32,
    backgroundColor: '#8C929D',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  clipInner: {
    width: 48,
    height: 8,
    backgroundColor: '#606670',
    borderRadius: 4,
  },
  callSheet: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    padding: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderColor: '#EFECE1',
    paddingBottom: 14,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 8,
  },
  sheetCode: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#707070',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.4,
  },
  statusBadge: {
    backgroundColor: '#009A5E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  membersGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  membersGridMobile: {
    flexDirection: 'column',
  },
  memberCard: {
    flex: 1,
    minWidth: 210,
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  memberCardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  presencaPill: {
    backgroundColor: '#EBF8F2',
    borderWidth: 1,
    borderColor: '#009A5E',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  presencaPillText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#009A5E',
  },
  memberName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  memberCourse: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 10,
  },
  roleBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  joinRow: {
    borderTopWidth: 1.5,
    borderColor: '#EFECE1',
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
  },
  joinText: {
    fontSize: 12.5,
    color: '#555555',
    flex: 1,
    minWidth: 260,
  },
  joinBtn: {
    backgroundColor: '#1349EB',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  joinBtnPressed: {
    transform: [{ translateY: 2 }],
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useInView } from '../../../hooks/useInView';

function AlertTriangleIcon({ size = 18, color = '#FE4141' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 18, color = '#009A5E' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M22 4L12 14.01l-3-3" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export interface SimulatorSubject {
  id: string;
  code: string;
  name: string;
  credits: number;
  color: string;
  borderColor: string;
  textColor: string;
  scheduleCode: string; // Notação UnB: ex "24M12"
  slots: {
    day: number; // 0 = Seg, 1 = Ter, 2 = Qua, 3 = Qui, 4 = Sex
    timeIndex: number; // 0 = 08h-10h, 1 = 10h-12h, 2 = 14h-16h, 3 = 16h-18h
  }[];
}

const AVAILABLE_SUBJECTS: SimulatorSubject[] = [
  {
    id: 'mat0025',
    code: 'MAT0025',
    name: 'Cálculo 1',
    credits: 6,
    color: '#E9D5FF', // Lilás Pastel
    borderColor: '#7E22CE',
    textColor: '#581C87',
    scheduleCode: '24M12',
    slots: [
      { day: 0, timeIndex: 0 }, // Seg 08h-10h
      { day: 2, timeIndex: 0 }, // Qua 08h-10h
    ],
  },
  {
    id: 'cic0004',
    code: 'CIC0004',
    name: 'Algoritmos (APC)',
    credits: 6,
    color: '#BFDBFE', // Azul Pastel
    borderColor: '#1D4ED8',
    textColor: '#1E3A8A',
    scheduleCode: '35M34',
    slots: [
      { day: 1, timeIndex: 1 }, // Ter 10h-12h
      { day: 3, timeIndex: 1 }, // Qui 10h-12h
    ],
  },
  {
    id: 'ifd0171',
    code: 'IFD0171',
    name: 'Física 1 Exp',
    credits: 2,
    color: '#BBF7D0', // Verde Pastel
    borderColor: '#15803D',
    textColor: '#14532D',
    scheduleCode: '4T23',
    slots: [
      { day: 2, timeIndex: 2 }, // Qua 14h-16h
    ],
  },
  {
    id: 'cic0090',
    code: 'CIC0090',
    name: 'Estruturas de Dados',
    credits: 4,
    color: '#FED7AA', // Laranja Pastel
    borderColor: '#C2410C',
    textColor: '#7C2D12',
    scheduleCode: '35M12',
    slots: [
      { day: 1, timeIndex: 0 }, // Ter 08h-10h
      { day: 3, timeIndex: 0 }, // Qui 08h-10h
    ],
  },
  {
    id: 'mat0026_conflito',
    code: 'MAT0026',
    name: 'Cálculo 2 (Turma B)',
    credits: 6,
    color: '#FECDD3', // Rosa Pastel
    borderColor: '#BE123C',
    textColor: '#881337',
    scheduleCode: '24M12 (Choque c/ Calc 1)',
    slots: [
      { day: 0, timeIndex: 0 }, // Seg 08h-10h (CONFLITO COM CÁLCULO 1!)
      { day: 2, timeIndex: 0 }, // Qua 08h-10h
    ],
  },
];

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const TIME_SLOTS = [
  { label: '08:00 - 09:50', code: 'M1/M2' },
  { label: '10:00 - 11:50', code: 'M3/M4' },
  { label: '14:00 - 15:50', code: 'T2/T3' },
  { label: '16:00 - 17:50', code: 'T4/T5' },
];

export function ScheduleSimulatorSection() {
  const { width } = useWindowDimensions();
  const [sectionRef] = useInView<View>({ threshold: 0.1 });
  const isMobile = width < 640;

  // Matérias ativas selecionadas pelo estudante (por padrão, 3 sem conflito)
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'mat0025',
    'cic0004',
    'ifd0171',
    'cic0090',
  ]);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const toggleSubject = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSubjects = useMemo(() => {
    return AVAILABLE_SUBJECTS.filter((s) => selectedIds.includes(s.id));
  }, [selectedIds]);

  const totalCredits = useMemo(() => {
    return selectedSubjects.reduce((acc, curr) => acc + curr.credits, 0);
  }, [selectedSubjects]);

  // Montagem da matriz da grade horária e detecção de conflitos
  const { grid, conflicts } = useMemo(() => {
    // Matriz [timeIndex][day] com lista de matérias naquele slot
    const g: SimulatorSubject[][][] = Array.from({ length: TIME_SLOTS.length }, () =>
      Array.from({ length: DAYS.length }, () => [])
    );

    const conflictList: { day: string; time: string; subjects: string[] }[] = [];

    selectedSubjects.forEach((subject) => {
      subject.slots.forEach(({ day, timeIndex }) => {
        g[timeIndex][day].push(subject);
      });
    });

    g.forEach((row, timeIndex) => {
      row.forEach((cell, dayIndex) => {
        if (cell.length > 1) {
          conflictList.push({
            day: DAYS[dayIndex],
            time: TIME_SLOTS[timeIndex].label,
            subjects: cell.map((s) => s.name),
          });
        }
      });
    });

    return { grid: g, conflicts: conflictList };
  }, [selectedSubjects]);

  const handleCopySummary = () => {
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2000);
  };

  return (
    <View
      ref={sectionRef}
      nativeID="schedule-section"
      // @ts-ignore - ID para ancoragem suave na web
      id="schedule-section"
      style={styles.sectionWrapper}
    >
      <View style={styles.container}>
        {/* Tag do Topo */}
        <View style={styles.tagWrapper}>
          <View style={styles.tagPill}>
            <Text style={styles.tagPillText}>SIMULADOR DE GRADE • MATRÍCULA WEB</Text>
          </View>
        </View>

        {/* Título Principal */}
        <Text style={[styles.title, isMobile && styles.titleMobile]}>
          Monte sua Grade Semestral sem Conflitos.
        </Text>

        <Text style={styles.subtitle}>
          Experimente nossa ferramenta interativa de horários no padrão oficial da UnB. Adicione ou remova disciplinas e veja a grade se ajustar instantaneamente.
        </Text>

        {/* ========================================================================= */}
        {/* BANNER DE DETECÇÃO DE CONFLITO EM TEMPO REAL */}
        {/* ========================================================================= */}
        {conflicts.length > 0 ? (
          <View style={styles.conflictBanner}>
            <View style={styles.conflictBannerIcon}>
              <AlertTriangleIcon size={22} color="#FE4141" />
            </View>
            <View style={styles.conflictBannerText}>
              <Text style={styles.conflictTitle}>
                ⚠️ Choque de Horário Detectado ({conflicts.length})!
              </Text>
              <Text style={styles.conflictDesc}>
                {conflicts[0].subjects.join(' e ')} ocupam o mesmo horário na{' '}
                {conflicts[0].day} ({conflicts[0].time}). Desative uma das matérias para equilibrar a grade!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.successBanner}>
            <View style={styles.successBannerIcon}>
              <CheckCircleIcon size={22} color="#009A5E" />
            </View>
            <View style={styles.conflictBannerText}>
              <Text style={styles.successTitle}>
                ✓ Grade Perfeita e Sem Conflitos!
              </Text>
              <Text style={styles.successDesc}>
                Todos os horários das turmas selecionadas estão livres de choques no SIGAA.
              </Text>
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* CONTROLES INTERATIVOS: MATÉRIAS SELECIONÁVEIS */}
        {/* ========================================================================= */}
        <View style={styles.toolbarRow}>
          <Text style={styles.toolbarHeading}>CLIQUE NAS MATÉRIAS PARA SIMULAR:</Text>

          <View style={styles.subjectChipsRow}>
            {AVAILABLE_SUBJECTS.map((subject) => {
              const isSelected = selectedIds.includes(subject.id);
              return (
                <Pressable
                  key={subject.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Alternar ${subject.name}`}
                  onPress={() => toggleSubject(subject.id)}
                  style={({ pressed }) => [
                    styles.subjectToggleChip,
                    isSelected && {
                      backgroundColor: subject.color,
                      borderColor: '#1F1F1F',
                    },
                    pressed && { transform: [{ translateY: 2 }] },
                  ]}
                >
                  <Text style={[styles.subjectToggleDot, { color: subject.borderColor }]}>
                    {isSelected ? '●' : '○'}
                  </Text>
                  <Text
                    style={[
                      styles.subjectToggleText,
                      isSelected && { color: '#1F1F1F', fontWeight: '900' },
                    ]}
                  >
                    {subject.code} • {subject.name} ({subject.credits} cr)
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ========================================================================= */}
        {/* PAINEL DE ESTATÍSTICAS DA GRADE */}
        {/* ========================================================================= */}
        <View style={[styles.statsCard, isMobile && styles.statsCardMobile]}>
          <View style={styles.statMetric}>
            <Text style={styles.statMetricNumber}>{selectedSubjects.length}</Text>
            <Text style={styles.statMetricLabel}>Disciplinas</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statMetric}>
            <Text style={styles.statMetricNumber}>{totalCredits}</Text>
            <Text style={styles.statMetricLabel}>Créditos Totais</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statMetric}>
            <Text style={styles.statMetricNumber}>{totalCredits * 15}h</Text>
            <Text style={styles.statMetricLabel}>Carga Horária Semestral</Text>
          </View>

          <View style={styles.statDivider} />

          <Pressable
            accessibilityRole="button"
            onPress={handleCopySummary}
            style={styles.exportBtn}
          >
            <Text style={styles.exportBtnText}>
              {copiedSuccess ? '✓ COPIADO!' : 'COPIAR RESUMO'}
            </Text>
          </Pressable>
        </View>

        {/* ========================================================================= */}
        {/* GRADE HORÁRIA VISUAL NEO-BRUTALISTA */}
        {/* ========================================================================= */}
        <View style={styles.timetableCard}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.timeColHeader}>
              <Text style={styles.headerCellText}>HORÁRIO</Text>
            </View>
            {DAYS.map((day) => (
              <View key={day} style={styles.dayColHeader}>
                <Text style={styles.headerCellText}>{day.toUpperCase()}</Text>
              </View>
            ))}
          </View>

          {/* Linhas de Horário */}
          {TIME_SLOTS.map((slot, timeIdx) => (
            <View key={slot.label} style={styles.tableRow}>
              {/* Coluna de Horário */}
              <View style={styles.timeCell}>
                <Text style={styles.timeCellLabel}>{slot.label}</Text>
                <Text style={styles.timeCellCode}>{slot.code}</Text>
              </View>

              {/* Células de Cada Dia */}
              {DAYS.map((day, dayIdx) => {
                const subjectsInCell = grid[timeIdx][dayIdx];
                const hasConflict = subjectsInCell.length > 1;

                return (
                  <View
                    key={day}
                    style={[
                      styles.dayCell,
                      hasConflict && styles.conflictDayCell,
                    ]}
                  >
                    {subjectsInCell.map((sub) => (
                      <View
                        key={sub.id}
                        style={[
                          styles.subjectBlock,
                          {
                            backgroundColor: hasConflict ? '#FEE2E2' : sub.color,
                            borderColor: hasConflict ? '#FE4141' : '#1F1F1F',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.subjectBlockCode,
                            { color: hasConflict ? '#991B1B' : '#1F1F1F' },
                          ]}
                          numberOfLines={1}
                        >
                          {sub.code}
                        </Text>
                        <Text
                          style={[
                            styles.subjectBlockName,
                            { color: hasConflict ? '#7F1D1D' : '#1F1F1F' },
                          ]}
                          numberOfLines={1}
                        >
                          {sub.name}
                        </Text>
                      </View>
                    ))}

                    {subjectsInCell.length === 0 && (
                      <Text style={styles.emptyCellDash}>—</Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Rodapé explicativo do simulador */}
        <View style={styles.simFooterNotice}>
          <Text style={styles.simFooterNoticeText}>
            💡 Notação da UnB: Dias 2 = Seg, 3 = Ter, 4 = Qua, 5 = Qui, 6 = Sex. Turnos: M = Manhã, T = Tarde, N = Noite.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F6',
    paddingVertical: 76,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    ...(Platform.OS === 'web'
      ? ({
          scrollMarginTop: '40px',
        } as any)
      : {}),
  },
  container: {
    width: '100%',
    maxWidth: 1360,
    alignItems: 'center',
  },
  tagWrapper: {
    marginBottom: 14,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 14,
    paddingVertical: 5,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  tagPillText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  titleMobile: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    maxWidth: 720,
    lineHeight: 24,
    marginBottom: 28,
  },

  // Banners de Alerta / Sucesso
  conflictBanner: {
    width: '100%',
    maxWidth: 1120,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FE4141',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
    shadowColor: '#FE4141',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #FE4141',
          animation: 'cartoonWiggle 0.5s ease',
        } as any)
      : {}),
  },
  conflictBannerIcon: {
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
  },
  conflictBannerText: {
    flex: 1,
  },
  conflictTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#991B1B',
    marginBottom: 2,
  },
  conflictDesc: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
  },

  successBanner: {
    width: '100%',
    maxWidth: 1120,
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#009A5E',
    borderRadius: 4,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
    shadowColor: '#009A5E',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #009A5E',
        } as any)
      : {}),
  },
  successBannerIcon: {
    padding: 6,
    backgroundColor: '#DCFCE7',
    borderRadius: 4,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
    marginBottom: 2,
  },
  successDesc: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },

  // Barra de Disciplinas Alternáveis
  toolbarRow: {
    width: '100%',
    maxWidth: 1120,
    marginBottom: 22,
  },
  toolbarHeading: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  subjectChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectToggleChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  subjectToggleDot: {
    fontSize: 12,
    fontWeight: '900',
  },
  subjectToggleText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4B5563',
  },

  // Painel de Estatísticas da Grade
  statsCard: {
    width: '100%',
    maxWidth: 1120,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  statsCardMobile: {
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
  },
  statMetric: {
    alignItems: 'center',
  },
  statMetricNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1349EB',
  },
  statMetricLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
  exportBtn: {
    backgroundColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 9,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  exportBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11.5,
    letterSpacing: 0.8,
  },

  // Grade da Tabela de Horários
  timetableCard: {
    width: '100%',
    maxWidth: 1120,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 4,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
  },
  timeColHeader: {
    width: '16%',
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  dayColHeader: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  headerCellText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    minHeight: 74,
  },
  timeCell: {
    width: '16%',
    minWidth: 100,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F5',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  timeCellLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F1F1F',
    textAlign: 'center',
  },
  timeCellCode: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#6B7280',
    marginTop: 2,
  },
  dayCell: {
    flex: 1,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    gap: 4,
  },
  conflictDayCell: {
    backgroundColor: '#FFF1F2',
  },
  subjectBlock: {
    width: '96%',
    borderWidth: 1.5,
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  subjectBlockCode: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  subjectBlockName: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  emptyCellDash: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  simFooterNotice: {
    marginTop: 18,
    alignItems: 'center',
  },
  simFooterNoticeText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
});

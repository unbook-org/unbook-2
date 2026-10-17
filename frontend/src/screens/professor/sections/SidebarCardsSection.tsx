import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CartoonButton } from '../../../components/CartoonButton';
import { theme } from '../../../constants/theme';
import type { ProfessorProfile, TurmaDocente } from '../../../types/professor';
import { formatarHorario } from '../../../utils/horario';
import { coresProfessor, sombra } from '../estilos';
import { IconeGrade } from '../icones';

interface SidebarCardsSectionProps {
  professor: ProfessorProfile;
  turmaAtiva?: TurmaDocente | null;
  onAdicionarNaGrade?: (turma: TurmaDocente) => void;
}

export function SidebarCardsSection({
  professor,
  turmaAtiva,
  onAdicionarNaGrade,
}: SidebarCardsSectionProps) {
  const [adicionado, setAdicionado] = useState(false);

  // Vagas da turma ativa ou total
  const vagasOcupadas = turmaAtiva?.vagas_ocupadas ?? 6;
  const vagasOfertadas = turmaAtiva?.vagas_ofertadas ?? 20;

  // Local
  const localAula =
    turmaAtiva?.local_sala ??
    professor.localizacao_gabinete ??
    'BSA - A03';

  // Horário
  const horarioTexto = turmaAtiva ? formatarHorario(turmaAtiva.horario_bruto) : 'Segunda e Quarta, 14h - 16h';
  const partesHorario = horarioTexto.split(',');
  const diasTexto = partesHorario[0]?.trim() || 'SEGUNDA E QUARTA';
  const faixaHoras = partesHorario[1]?.trim() || '14 - 16h';

  // Taxa de recomendação calculada
  const mediaDidatica = professor.resumo_didatica.media_didatica ?? 4.0;
  const totalAvaliacoes = professor.resumo_didatica.total_avaliacoes || 40;
  const recomendacaoPct = Math.min(100, Math.round((mediaDidatica / 5) * 100)) || 70;

  const handleToggleGrade = () => {
    setAdicionado((atual) => !atual);
    if (turmaAtiva && onAdicionarNaGrade) {
      onAdicionarNaGrade(turmaAtiva);
    }
  };

  return (
    <View style={styles.container}>
      {/* CARD 1: QUANTIDADE DE VAGAS (Amarelo) */}
      <View style={[styles.card, styles.cardVagas]}>
        <Text style={styles.rotuloCard}>QUANTIDADE DE VAGAS</Text>
        <Text style={styles.valorCardVagas}>
          {String(vagasOcupadas).padStart(2, '0')} / {String(vagasOfertadas).padStart(2, '0')} VAGAS
        </Text>
      </View>

      {/* CARD 2: LOCAL DE AULA (Salmão/Pêssego) */}
      <View style={[styles.card, styles.cardLocal]}>
        <Text style={styles.rotuloCard}>LOCAL DE AULA</Text>
        <Text style={styles.valorCardLocal}>{localAula.toUpperCase()}</Text>
      </View>

      {/* CARD 3: HORÁRIO DE AULA + MINI GRADE (Verde) */}
      <View style={[styles.card, styles.cardHorario]}>
        <View style={styles.horarioHeader}>
          <Text style={styles.rotuloCardClaro}>HORÁRIO DE AULA</Text>
          <View style={styles.badgeFaixa}>
            <Text style={styles.textoBadgeFaixa}>{faixaHoras}</Text>
          </View>
        </View>

        <Text style={styles.diasTexto}>{diasTexto.toUpperCase()}</Text>

        {/* Tabela / Grade Visual Miniatura */}
        <View style={styles.miniGradeWrapper}>
          <MiniGradeHorario horarioBruto={turmaAtiva?.horario_bruto ?? '24T23'} />
        </View>

        {/* Botão Adicionar na Grade */}
        <CartoonButton
          variant={adicionado ? 'warning' : 'white'}
          size="md"
          onPress={handleToggleGrade}
          icon={<IconeGrade cor={theme.colors.dark} tamanho={16} />}
          style={styles.botaoGrade}
          textStyle={styles.textoBotaoGrade}
        >
          {adicionado ? 'ADICIONADO NA GRADE ✓' : 'ADICIONAR NA GRADE'}
        </CartoonButton>
      </View>

      {/* CARD 4: TAXA DE RECOMENDAÇÃO (Branco) */}
      <View style={[styles.card, styles.cardRecomendacao]}>
        <View style={styles.recHeader}>
          <Text style={styles.rotuloCard}>TAXA DE RECOMENDAÇÃO</Text>
          <View style={styles.marcadorQuadrado} />
        </View>

        <View style={styles.recLinhaDestaque}>
          <Text style={styles.recEmoji}>🤝</Text>
          <Text style={styles.recTextoDestaque}>{recomendacaoPct}% RECOMENDAÇÃO</Text>
        </View>

        {/* Barra de Progresso Neo-Brutalista */}
        <View style={styles.progressoTrilha}>
          <View style={[styles.progressoPreenchimento, { width: `${recomendacaoPct}%` }]} />
        </View>

        <Text style={styles.recLegenda}>{totalAvaliacoes} pessoas avaliaram essa turma</Text>
      </View>
    </View>
  );
}

// Miniatura da Grade Horária (Seg a Sab)
function MiniGradeHorario({ horarioBruto }: { horarioBruto: string }) {
  const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
  const linhas = [8, 10, 12, 14, 16, 18, 20];

  // Identifica se a turma é segunda e quarta (2 e 4) à tarde (T)
  const isSegundaQuartaTarde =
    horarioBruto.includes('2') || horarioBruto.includes('4') || horarioBruto.includes('T');

  return (
    <View style={styles.gradeTabela}>
      {/* Linha de Cabeçalho dos Dias */}
      <View style={styles.gradeLinhaDias}>
        <View style={styles.gradeColunaHoraVazia} />
        {dias.map((dia) => (
          <Text key={dia} style={styles.gradeTextoDia}>
            {dia}
          </Text>
        ))}
      </View>

      {/* Linhas de Horário com Slots */}
      {linhas.map((hora) => (
        <View key={hora} style={styles.gradeLinha}>
          <Text style={styles.gradeTextoHora}>{hora}</Text>
          {dias.map((dia, diaIndex) => {
            // Destaque nos slots de aula (ex: Seg(0) e Qua(2) às 14h)
            const slotAtivo =
              isSegundaQuartaTarde && (diaIndex === 0 || diaIndex === 2) && hora === 14;
            return (
              <View
                key={dia}
                style={[styles.gradeCelula, slotAtivo && styles.gradeCelulaAtiva]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  card: {
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 16,
    ...sombra(4),
  },

  // Card Vagas
  cardVagas: {
    backgroundColor: coresProfessor.cartaoVagas,
  },
  rotuloCard: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.colors.dark,
    letterSpacing: 0.6,
  },
  valorCardVagas: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.dark,
    marginTop: 6,
  },

  // Card Local
  cardLocal: {
    backgroundColor: coresProfessor.cartaoLocal,
  },
  valorCardLocal: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.dark,
    marginTop: 6,
  },

  // Card Horário
  cardHorario: {
    backgroundColor: coresProfessor.cartaoHorario,
  },
  horarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rotuloCardClaro: {
    fontSize: 11,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 0.6,
  },
  badgeFaixa: {
    backgroundColor: coresProfessor.borda,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
  },
  textoBadgeFaixa: {
    color: theme.colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  diasTexto: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.white,
    marginTop: 8,
    marginBottom: 12,
  },
  miniGradeWrapper: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    padding: 8,
    marginBottom: 14,
  },
  botaoGrade: {
    width: '100%',
    backgroundColor: theme.colors.white,
  },
  textoBotaoGrade: {
    fontSize: 12,
    letterSpacing: 0.5,
  },

  // Card Recomendação
  cardRecomendacao: {
    backgroundColor: coresProfessor.cartaoRecomendacao,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marcadorQuadrado: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    backgroundColor: coresProfessor.verde,
  },
  recLinhaDestaque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  recEmoji: {
    fontSize: 26,
  },
  recTextoDestaque: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.dark,
  },
  progressoTrilha: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    overflow: 'hidden',
  },
  progressoPreenchimento: {
    height: '100%',
    backgroundColor: coresProfessor.verde,
  },
  recLegenda: {
    fontSize: 11,
    color: theme.colors.darkCharcoal,
    marginTop: 8,
    fontWeight: '600',
  },

  // Mini Grade
  gradeTabela: {
    width: '100%',
  },
  gradeLinhaDias: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 2,
    marginBottom: 2,
  },
  gradeColunaHoraVazia: {
    width: 16,
  },
  gradeTextoDia: {
    flex: 1,
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.colors.darkCharcoal,
  },
  gradeLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
  },
  gradeTextoHora: {
    width: 16,
    fontSize: 7,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  gradeCelula: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 0.5,
    borderLeftColor: '#E5E7EB',
  },
  gradeCelulaAtiva: {
    backgroundColor: '#9CA3AF',
    borderWidth: 1,
    borderColor: coresProfessor.borda,
  },
});


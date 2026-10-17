import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CartoonButton } from '../../../components/CartoonButton';
import { theme } from '../../../constants/theme';
import type { ProfessorProfile, TurmaDocente } from '../../../types/professor';
import { formatarHorario, semestreAtual } from '../../../utils/horario';
import { coresProfessor, LARGURA_MAXIMA, sombra } from '../estilos';
import { IconeLocal, IconeRelogio } from '../icones';

interface TurmasDocenteSectionProps {
  professor: ProfessorProfile;
  turmaAtiva?: TurmaDocente | null;
  onSelecionarTurma: (turma: TurmaDocente) => void;
  onSelectMateria: (codigo: string) => void;
}

export function TurmasDocenteSection({
  professor,
  turmaAtiva,
  onSelecionarTurma,
  onSelectMateria,
}: TurmasDocenteSectionProps) {
  const { width } = useWindowDimensions();
  const compacto = width < 768;

  const semestres = useMemo(() => {
    const unicos = [...new Set(professor.turmas.map((t) => t.semestre))];
    return unicos.length > 0 ? unicos.sort().reverse() : [semestreAtual()];
  }, [professor.turmas]);

  const [semestreSelecionado, setSemestreSelecionado] = useState(
    semestres[0] ?? semestreAtual(),
  );

  const turmasFiltradas = useMemo(() => {
    return professor.turmas.filter((t) => t.semestre === semestreSelecionado);
  }, [professor.turmas, semestreSelecionado]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho da Seção */}
      <View style={styles.secaoHeader}>
        <View>
          <Text style={styles.secaoTitulo}>TURMAS & DISCIPLINAS</Text>
          <Text style={styles.secaoSubtitulo}>
            Disciplinas ofertadas por {professor.nome_completo}
          </Text>
        </View>

        {/* Seletor de Semestre */}
        <View style={styles.seletorSemestre}>
          {semestres.map((sem) => (
            <Pressable
              key={sem}
              onPress={() => setSemestreSelecionado(sem)}
              style={[
                styles.abaSemestre,
                semestreSelecionado === sem && styles.abaSemestreAtiva,
              ]}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.textoAbaSemestre,
                  semestreSelecionado === sem && styles.textoAbaSemestreAtiva,
                ]}
              >
                {sem}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Lista de Cards de Turmas */}
      {turmasFiltradas.length === 0 ? (
        <View style={styles.cartaoVazio}>
          <Text style={styles.textoVazio}>
            Nenhuma turma cadastrada para o semestre {semestreSelecionado}.
          </Text>
        </View>
      ) : (
        <View style={[styles.gridTurmas, compacto && styles.gridTurmasCompacto]}>
          {turmasFiltradas.map((turma) => {
            const isAtiva = turmaAtiva?.id === turma.id;
            return (
              <View
                key={turma.id}
                style={[styles.cartaoTurma, isAtiva && styles.cartaoTurmaAtiva]}
              >
                <View style={styles.cartaoTopo}>
                  <View style={styles.badgeTurma}>
                    <Text style={styles.textoBadgeTurma}>TURMA {turma.codigo_turma}</Text>
                  </View>
                  <Text style={styles.codigoMateria}>{turma.materia.codigo_materia}</Text>
                </View>

                <Text style={styles.nomeMateria} numberOfLines={2}>
                  {turma.materia.nome}
                </Text>

                <View style={styles.infoLinha}>
                  <IconeLocal />
                  <Text style={styles.infoTexto}>{turma.local_sala || 'Local a definir'}</Text>
                </View>

                <View style={styles.infoLinha}>
                  <IconeRelogio />
                  <Text style={styles.infoTexto}>{formatarHorario(turma.horario_bruto)}</Text>
                </View>

                <View style={styles.vagasLinha}>
                  <Text style={styles.vagasRotulo}>Vagas:</Text>
                  <Text style={styles.vagasValor}>
                    {turma.vagas_ocupadas} / {turma.vagas_ofertadas}
                  </Text>
                </View>

                <View style={styles.botoesAcao}>
                  <CartoonButton
                    variant={isAtiva ? 'warning' : 'white'}
                    size="sm"
                    onPress={() => onSelecionarTurma(turma)}
                    style={styles.botaoAcao}
                  >
                    {isAtiva ? 'Visualizando' : 'Ver nesta turma'}
                  </CartoonButton>
                  <CartoonButton
                    variant="secondary"
                    size="sm"
                    onPress={() => onSelectMateria(turma.materia.codigo_materia)}
                    style={styles.botaoAcao}
                  >
                    Ver matéria
                  </CartoonButton>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    paddingVertical: 16,
  },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.dark,
    letterSpacing: 0.5,
  },
  secaoSubtitulo: {
    fontSize: 13,
    color: theme.colors.darkCharcoal,
    marginTop: 2,
  },
  seletorSemestre: {
    flexDirection: 'row',
    gap: 8,
  },
  abaSemestre: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...sombra(2),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  abaSemestreAtiva: {
    backgroundColor: coresProfessor.amarelo,
  },
  textoAbaSemestre: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  textoAbaSemestreAtiva: {
    color: theme.colors.dark,
  },
  gridTurmas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridTurmasCompacto: {
    flexDirection: 'column',
  },
  cartaoTurma: {
    flex: 1,
    minWidth: 260,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 16,
    gap: 8,
    ...sombra(3),
  },
  cartaoTurmaAtiva: {
    borderColor: coresProfessor.primaria,
    borderWidth: 2.5,
    backgroundColor: '#F8FAFF',
  },
  cartaoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeTurma: {
    backgroundColor: coresProfessor.primaria,
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoBadgeTurma: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  codigoMateria: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.darkCharcoal,
  },
  nomeMateria: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.dark,
    minHeight: 40,
  },
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoTexto: {
    fontSize: 12,
    color: theme.colors.darkCharcoal,
  },
  vagasLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  vagasRotulo: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  vagasValor: {
    fontSize: 12,
    fontWeight: '900',
    color: theme.colors.dark,
  },
  botoesAcao: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  botaoAcao: {
    flex: 1,
  },
  cartaoVazio: {
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    padding: 24,
    alignItems: 'center',
    ...sombra(2),
  },
  textoVazio: {
    fontSize: 14,
    color: theme.colors.darkCharcoal,
    fontWeight: '600',
  },
});


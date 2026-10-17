import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { MateriaDocente, ProfessorProfile } from '../../../types/professor';
import {
  formatarNomeCurto,
  formatarNomeProfessor,
} from '../../../utils/formatadorTexto';
import { formatarHorario, semestreAtual } from '../../../utils/horario';
import { coresProfessor, LARGURA_MAXIMA, sombra } from '../estilos';
import { IconeBusca, IconeCamadas } from '../icones';

interface MateriasLecionandoSectionProps {
  professor: ProfessorProfile;
  onSelectMateria: (codigo: string) => void;
}

export function MateriasLecionandoSection({
  professor,
  onSelectMateria,
}: MateriasLecionandoSectionProps) {
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('');

  // Semestres disponíveis nas turmas do professor ou padrão atual
  const semestresDisponiveis = useMemo(() => {
    const setSem = new Set<string>();
    professor.turmas.forEach((t) => {
      if (t.semestre) setSem.add(t.semestre);
    });
    const lista = Array.from(setSem);
    if (lista.length === 0) return [semestreAtual(), '2026.1', '2025.2'];
    return lista.sort().reverse();
  }, [professor.turmas]);

  const [semestreSelecionado, setSemestreSelecionado] = useState(
    semestresDisponiveis[0] ?? semestreAtual(),
  );
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Lista de matérias do professor para o semestre selecionado
  const materiasDoSemestre = useMemo<MateriaDocente[]>(() => {
    // Se o professor tiver turmas vinculadas ao semestre
    const turmasSemestre = professor.turmas.filter(
      (t) => t.semestre === semestreSelecionado,
    );

    if (turmasSemestre.length > 0) {
      const mapa = new Map<string, MateriaDocente>();
      turmasSemestre.forEach((t) => {
        if (t.materia && !mapa.has(t.materia.codigo_materia)) {
          mapa.set(t.materia.codigo_materia, t.materia);
        }
      });
      return Array.from(mapa.values());
    }

    // Fallback: se não tiver turmas cadastradas para o semestre, exibe as matérias cadastradas do professor
    return professor.materias;
  }, [professor.turmas, professor.materias, semestreSelecionado]);

  // Filtro de texto por código ou nome da matéria
  const materiasFiltradas = useMemo(() => {
    const termo = (filtroAtivo || busca).trim().toLowerCase();
    if (!termo) return materiasDoSemestre;

    return materiasDoSemestre.filter(
      (m) =>
        m.nome.toLowerCase().includes(termo) ||
        m.codigo_materia.toLowerCase().includes(termo),
    );
  }, [materiasDoSemestre, filtroAtivo, busca]);

  const handleFiltrar = () => {
    setFiltroAtivo(busca.trim());
  };

  const nomeExibido = formatarNomeCurto(professor.nome_completo).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Título com Ícone em Losango/Camadas */}
        <View style={styles.topoTitulo}>
          <IconeCamadas tamanho={20} cor="#1F1F1F" />
          <Text style={styles.textoTitulo}>
            MATÉRIAS QUE “{nomeExibido}” ESTÁ LECIONANDO ESSE SEMESTRE ({semestreSelecionado})
          </Text>
        </View>

        {/* Barra de Filtros: Input de Busca + Dropdown Semestre + Botão FILTRAR */}
        <View style={styles.barraFiltros}>
          {/* Campo de Busca */}
          <View style={styles.campoBusca}>
            <IconeBusca tamanho={18} cor="#71717A" />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={handleFiltrar}
              placeholder="Digite aqui a matéria que o professor leciona..."
              placeholderTextColor="#8C8C85"
              style={styles.inputBusca}
              returnKeyType="search"
            />
            {busca.length > 0 && (
              <Pressable
                onPress={() => {
                  setBusca('');
                  setFiltroAtivo('');
                }}
                style={styles.limparBusca}
                accessibilityRole="button"
                accessibilityLabel="Limpar busca"
              >
                <Text style={styles.limparBuscaTexto}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Seletor Dropdown de Semestre */}
          <View style={styles.dropdownContainer}>
            <Pressable
              onPress={() => setDropdownAberto((prev) => !prev)}
              style={styles.dropdownBotao}
              accessibilityRole="button"
              accessibilityLabel={`Selecionar semestre: ${semestreSelecionado}`}
            >
              <Text style={styles.dropdownTexto}>{semestreSelecionado}</Text>
              <Text style={styles.dropdownSeta}>{dropdownAberto ? '▴' : '▾'}</Text>
            </Pressable>

            {dropdownAberto && (
              <View style={styles.dropdownMenu}>
                {semestresDisponiveis.map((sem) => (
                  <Pressable
                    key={sem}
                    onPress={() => {
                      setSemestreSelecionado(sem);
                      setDropdownAberto(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      semestreSelecionado === sem && styles.dropdownItemAtivo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dropdownItemTexto,
                        semestreSelecionado === sem && styles.dropdownItemTextoAtivo,
                      ]}
                    >
                      {sem}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Botão Filtrar Neo-brutalista */}
          <Pressable
            onPress={handleFiltrar}
            style={({ pressed }) => [
              styles.botaoFiltrar,
              pressed && styles.botaoFiltrarPressionado,
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.botaoFiltrarTexto}>FILTRAR</Text>
          </Pressable>
        </View>

        {/* Lista de Matérias Ofertadas */}
        <View style={styles.listaMaterias}>
          {materiasFiltradas.length === 0 ? (
            <View style={styles.vazioBox}>
              <Text style={styles.vazioTexto}>
                Nenhuma matéria encontrada para {semestreSelecionado}
                {filtroAtivo ? ` com o termo "${filtroAtivo}".` : '.'}
              </Text>
            </View>
          ) : (
            materiasFiltradas.map((materia) => {
              const turmasDestaMateria = professor.turmas.filter(
                (t) =>
                  t.materia.codigo_materia === materia.codigo_materia &&
                  (!semestreSelecionado || t.semestre === semestreSelecionado),
              );

              const nomeFormatado = formatarNomeProfessor(materia.nome);
              const turma = turmasDestaMateria[0];
              const subInfoPartes: string[] = [
                materia.codigo_materia,
                `${materia.creditos} Créditos`,
              ];
              if (turma?.local_sala) {
                subInfoPartes.push(`Sala ${turma.local_sala}`);
              } else if (turma?.horario_bruto) {
                const h = formatarHorario(turma.horario_bruto);
                if (h) subInfoPartes.push(h);
              }
              const subInfoTexto = subInfoPartes.join(' • ');

              return (
                <Pressable
                  key={materia.id || materia.codigo_materia}
                  onPress={() => onSelectMateria(materia.codigo_materia)}
                  style={({ pressed }) => [
                    styles.itemMateria,
                    pressed && styles.itemMateriaPressionado,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Acessar disciplina ${nomeFormatado}`}
                >
                  <View style={styles.itemMateriaInfo}>
                    <Text style={styles.itemMateriaNome}>{nomeFormatado}</Text>
                    <Text style={styles.materiaSubInfoTexto}>{subInfoTexto}</Text>
                  </View>

                  {/* Badge ABERTA conforme o design real */}
                  <View style={styles.badgeAberta}>
                    <Text style={styles.badgeAbertaTexto}>ABERTA</Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  cardContainer: {
    backgroundColor: coresProfessor.cardFundo,
    borderWidth: 2.5,
    borderColor: coresProfessor.borda,
    padding: 24,
    ...sombra(5),
  },
  topoTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  textoTitulo: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flexShrink: 1,
  },
  barraFiltros: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  campoBusca: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 8 : 4,
    gap: 8,
  },
  inputBusca: {
    flex: 1,
    fontSize: 13,
    color: '#1F1F1F',
    fontWeight: '500',
    paddingVertical: 4,
    outlineStyle: 'none',
  } as any,
  limparBusca: {
    padding: 4,
  },
  limparBuscaTexto: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '700',
  },
  dropdownContainer: {
    position: 'relative',
    minWidth: 120,
  },
  dropdownBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  dropdownTexto: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  dropdownSeta: {
    fontSize: 12,
    color: '#1F1F1F',
    fontWeight: '900',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    zIndex: 9999,
    ...sombra(3),
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  dropdownItemAtivo: {
    backgroundColor: '#F1C321',
  },
  dropdownItemTexto: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  dropdownItemTextoAtivo: {
    fontWeight: '900',
  },
  botaoFiltrar: {
    backgroundColor: '#1F1F1F',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 22,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    ...sombra(2.5),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  botaoFiltrarPressionado: {
    transform: [{ translateY: 2 }],
  },
  botaoFiltrarTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  listaMaterias: {
    gap: 14,
  },
  itemMateria: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: coresProfessor.borda,
    paddingHorizontal: 20,
    paddingVertical: 18,
    ...sombra(4),
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
  },
  itemMateriaPressionado: {
    transform: [{ translateY: 2 }],
  },
  itemMateriaInfo: {
    flex: 1,
    paddingRight: 16,
  },
  itemMateriaNome: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  materiaSubInfoTexto: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  badgeAberta: {
    backgroundColor: '#F1C321',
    borderWidth: 1.8,
    borderColor: coresProfessor.borda,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 5,
    ...sombra(2),
  },
  badgeAbertaTexto: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.6,
  },
  vazioBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: coresProfessor.borda,
    padding: 24,
    alignItems: 'center',
  },
  vazioTexto: {
    fontSize: 14,
    color: '#71717A',
    fontWeight: '600',
    textAlign: 'center',
  },
});

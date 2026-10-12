import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Footer } from '../../components/Footer';
import { Navbar } from '../../components/Navbar';
import { NewsBanner } from '../../components/NewsBanner';
import { theme } from '../../constants/theme';
import { useConsulta } from '../../hooks/useConsulta';
import { listarDepartamentos } from '../../services/api';
import { BarraFiltros, type TipoCatalogo } from './sections/BarraFiltros';
import { Prateleira } from './sections/Prateleira';
import { ResultadosMaterias, ResultadosProfessores } from './sections/Resultados';
import { BarraSemestre, ComoFunciona, HeroCatalogo } from './sections/TopoCatalogo';

// Sem categorias definidas ainda, a visão geral mostra os maiores departamentos.
const TOTAL_PRATELEIRAS = 6;

export interface FiltrosCatalogo {
  tipo: TipoCatalogo;
  termo: string;
  departamentoId: string | null;
  pagina: number;
}

interface CatalogoScreenProps {
  filtros: FiltrosCatalogo;
  onFiltros: (filtros: Partial<FiltrosCatalogo>) => void;
  onSelectMateria: (codigo: string) => void;
  onInicio: () => void;
}

export function CatalogoScreen({
  filtros,
  onFiltros,
  onSelectMateria,
  onInicio,
}: CatalogoScreenProps) {
  const { tipo, departamentoId, pagina } = filtros;
  // O campo tem estado próprio para digitar sem esperar a URL; a busca usa o termo sem espaços.
  const [termo, setTermo] = useState(filtros.termo);
  const termoLimpo = termo.trim();

  const departamentos = useConsulta((sinal) => listarDepartamentos(sinal), []);
  const maioresDepartamentos = useMemo(
    () =>
      [...(departamentos.dados ?? [])]
        .sort((a, b) => b.total_materias - a.total_materias)
        .slice(0, TOTAL_PRATELEIRAS),
    [departamentos.dados],
  );
  const totalMaterias = departamentos.dados
    ? departamentos.dados.reduce((soma, departamento) => soma + departamento.total_materias, 0)
    : null;
  const departamentoCodigo =
    departamentos.dados?.find((departamento) => departamento.id === departamentoId)?.codigo ??
    null;
  const visaoGeral = tipo === 'materias' && !termoLimpo && departamentoId === null;

  const alterarTermo = (novoTermo: string) => {
    setTermo(novoTermo);
    onFiltros({ termo: novoTermo.trim(), pagina: 1 });
  };

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <NewsBanner />
        <Navbar onPressLogo={onInicio} />
        <BarraSemestre
          totalMaterias={totalMaterias}
          totalDepartamentos={departamentos.dados?.length ?? null}
        />
        <HeroCatalogo />
        <ComoFunciona />
        <BarraFiltros
          tipo={tipo}
          onTipo={(novoTipo) => onFiltros({ tipo: novoTipo, pagina: 1 })}
          termo={termo}
          onTermo={alterarTermo}
          departamentos={departamentos.dados}
          carregandoDepartamentos={departamentos.carregando}
          erroDepartamentos={departamentos.erro}
          departamentoId={departamentoId}
          onDepartamento={(novoDepartamento) =>
            onFiltros({ departamentoId: novoDepartamento, pagina: 1 })
          }
          atalhos={maioresDepartamentos}
        />

        <View style={styles.resultados}>
          {visaoGeral &&
            maioresDepartamentos.map((departamento) => (
              <Prateleira
                key={departamento.id}
                departamento={departamento}
                onSelectMateria={onSelectMateria}
                onVerTodas={() => onFiltros({ departamentoId: departamento.id, pagina: 1 })}
              />
            ))}
          {!visaoGeral && tipo === 'materias' && (
            <ResultadosMaterias
              termo={termoLimpo}
              departamentoId={departamentoId}
              pagina={pagina}
              onPagina={(novaPagina) => onFiltros({ pagina: novaPagina })}
              onSelectMateria={onSelectMateria}
            />
          )}
          {tipo === 'professores' && (
            <ResultadosProfessores
              termo={termoLimpo}
              departamentoCodigo={departamentoCodigo}
              pagina={pagina}
              onPagina={(novaPagina) => onFiltros({ pagina: novaPagina })}
            />
          )}
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.colors.beige,
  },
  conteudo: {
    flexGrow: 1,
  },
  resultados: {
    flexGrow: 1,
    gap: 48,
    paddingVertical: 40,
    paddingHorizontal: 0,
  },
});

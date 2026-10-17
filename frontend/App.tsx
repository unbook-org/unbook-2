import { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/home/HomeScreen";
import { MateriaScreen } from "./src/screens/materia/MateriaScreen";
import { ProfessorScreen } from "./src/screens/professor/ProfessorScreen";
import { nivelDaApi, NIVEL_PADRAO, type NivelEnsino } from "./src/utils/nivelEnsino";

interface MateriaSelecionada {
  codigo: string;
  nivel: NivelEnsino;
}

interface EstadoRota {
  materia: MateriaSelecionada | null;
  professorIdentifier: string | null;
}

function lerRotaAtual(): EstadoRota {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return { materia: null, professorIdentifier: null };
  }

  const pathname = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const nivelParam = nivelDaApi(params.get("nivel")) ?? NIVEL_PADRAO;

  // Rota de matéria: /materias/MAT123 ou /materia/MAT123 (e suporte opcional a /materias/:nivel/:codigo)
  const matchMateriaNivel = pathname.match(/^\/materias?\/([^/?#]+)\/([^/?#]+)\/?$/i);
  if (matchMateriaNivel) {
    const seg1 = decodeURIComponent(matchMateriaNivel[1]);
    const seg2 = decodeURIComponent(matchMateriaNivel[2]);
    const nivelExtraido = nivelDaApi(seg1);
    if (nivelExtraido) {
      return {
        materia: { codigo: seg2.toUpperCase(), nivel: nivelExtraido },
        professorIdentifier: null,
      };
    }
  }

  const matchMateria = pathname.match(/^\/materias?\/([^/?#]+)\/?$/i);
  if (matchMateria) {
    const codigo = decodeURIComponent(matchMateria[1]).toUpperCase();
    return {
      materia: { codigo, nivel: nivelParam },
      professorIdentifier: null,
    };
  }

  // Rota de professor: /professores/slug-do-docente ou /professor/slug-do-docente
  const matchProfessor = pathname.match(/^\/professore?s?\/([^/?#]+)\/?$/i);
  if (matchProfessor) {
    const identifier = decodeURIComponent(matchProfessor[1]);
    return {
      materia: null,
      professorIdentifier: identifier,
    };
  }

  // Fallback para query params legados (?materia=MAT123 ou ?prof=slug)
  const matQuery = params.get("materia");
  if (matQuery) {
    return {
      materia: { codigo: matQuery.toUpperCase(), nivel: nivelParam },
      professorIdentifier: null,
    };
  }

  const profQuery = params.get("prof") || params.get("professor");
  if (profQuery) {
    return {
      materia: null,
      professorIdentifier: profQuery,
    };
  }

  return { materia: null, professorIdentifier: null };
}

function construirUrlMateria(codigo: string, nivel: NivelEnsino): string {
  const codigoLimpo = encodeURIComponent(codigo.trim().toUpperCase());
  if (nivel && nivel !== NIVEL_PADRAO) {
    return `/materias/${codigoLimpo}?nivel=${encodeURIComponent(nivel)}`;
  }
  return `/materias/${codigoLimpo}`;
}

function construirUrlProfessor(identifier: string): string {
  return `/professores/${encodeURIComponent(identifier.trim())}`;
}

function atualizarUrlNavegador(novaUrl: string, substituir = false) {
  if (Platform.OS !== "web" || typeof window === "undefined") return;
  const urlAtual = `${window.location.pathname}${window.location.search}`;
  if (urlAtual === novaUrl) return;
  if (substituir) {
    window.history.replaceState({}, "", novaUrl);
  } else {
    window.history.pushState({}, "", novaUrl);
  }
}

export default function App() {
  const rotaInicial = lerRotaAtual();

  const [materia, setMateria] = useState<MateriaSelecionada | null>(rotaInicial.materia);
  const [professorIdentifier, setProfessorIdentifier] = useState<string | null>(
    rotaInicial.professorIdentifier,
  );
  const [origemProfessorNome, setOrigemProfessorNome] = useState<string | undefined>(undefined);

  // Sincroniza estado ao clicar em Voltar/Avançar do navegador (popstate)
  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    // Normaliza query params legados na primeira carga para URLs limpas (/materias/... ou /professores/...)
    if (rotaInicial.professorIdentifier) {
      atualizarUrlNavegador(construirUrlProfessor(rotaInicial.professorIdentifier), true);
    } else if (rotaInicial.materia) {
      atualizarUrlNavegador(
        construirUrlMateria(rotaInicial.materia.codigo, rotaInicial.materia.nivel),
        true,
      );
    }

    const aoMudarHistorico = () => {
      const novaRota = lerRotaAtual();
      setMateria(novaRota.materia);
      setProfessorIdentifier(novaRota.professorIdentifier);
      if (!novaRota.professorIdentifier) {
        setOrigemProfessorNome(undefined);
      }
    };

    window.addEventListener("popstate", aoMudarHistorico);
    return () => window.removeEventListener("popstate", aoMudarHistorico);
  }, []);

  const selecionarMateria = useCallback((codigo: string, nivel: NivelEnsino = NIVEL_PADRAO) => {
    const codigoFormatado = codigo.trim().toUpperCase();
    setProfessorIdentifier(null);
    setOrigemProfessorNome(undefined);
    setMateria({ codigo: codigoFormatado, nivel });
    atualizarUrlNavegador(construirUrlMateria(codigoFormatado, nivel));
  }, []);

  const selecionarProfessor = useCallback((identifier: string, origemNome?: string) => {
    setProfessorIdentifier(identifier);
    setOrigemProfessorNome(origemNome);
    atualizarUrlNavegador(construirUrlProfessor(identifier));
  }, []);

  const voltarParaHome = useCallback(() => {
    setProfessorIdentifier(null);
    setOrigemProfessorNome(undefined);
    setMateria(null);
    atualizarUrlNavegador("/");
  }, []);

  const voltarDoProfessor = useCallback(() => {
    setProfessorIdentifier(null);
    setOrigemProfessorNome(undefined);
    if (materia) {
      atualizarUrlNavegador(construirUrlMateria(materia.codigo, materia.nivel));
    } else {
      atualizarUrlNavegador("/");
    }
  }, [materia]);

  const telaAtiva =
    professorIdentifier !== null ? "professor" : materia !== null ? "materia" : "home";

  return (
    <>
      <View style={[styles.tela, telaAtiva !== "home" && styles.oculta]}>
        <HomeScreen
          onSelectMateria={selecionarMateria}
          onSelectProfessor={selecionarProfessor}
        />
      </View>

      {telaAtiva === "materia" && materia !== null && (
        <MateriaScreen
          codigo={materia.codigo}
          nivel={materia.nivel}
          onVoltar={voltarParaHome}
          onSelectMateria={selecionarMateria}
          onSelectProfessor={selecionarProfessor}
        />
      )}

      {telaAtiva === "professor" && professorIdentifier !== null && (
        <ProfessorScreen
          identifier={professorIdentifier}
          origemNome={origemProfessorNome}
          onVoltar={voltarDoProfessor}
          onSelectMateria={(codigo) => selecionarMateria(codigo)}
        />
      )}

      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  oculta: {
    display: "none",
  },
});


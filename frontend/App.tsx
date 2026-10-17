import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/home/HomeScreen";
import { MateriaScreen } from "./src/screens/materia/MateriaScreen";
import { ProfessorScreen } from "./src/screens/professor/ProfessorScreen";
import { NIVEL_PADRAO, type NivelEnsino } from "./src/utils/nivelEnsino";

interface MateriaSelecionada {
  codigo: string;
  nivel: NivelEnsino;
}

function obterParametroUrl(chave: string): string | null {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get(chave);
  }
  return null;
}

export default function App() {
  const [materia, setMateria] = useState<MateriaSelecionada | null>(() => {
    const matParam = obterParametroUrl("materia");
    return matParam ? { codigo: matParam, nivel: NIVEL_PADRAO } : null;
  });

  const [professorIdentifier, setProfessorIdentifier] = useState<string | null>(() => {
    const profParam = obterParametroUrl("prof") || obterParametroUrl("professor");
    return profParam ?? null;
  });

  const [origemProfessorNome, setOrigemProfessorNome] = useState<string | undefined>(undefined);

  const selecionarMateria = (codigo: string, nivel: NivelEnsino = NIVEL_PADRAO) => {
    setProfessorIdentifier(null);
    setMateria({ codigo, nivel });
  };

  const selecionarProfessor = (identifier: string, origemNome?: string) => {
    setProfessorIdentifier(identifier);
    setOrigemProfessorNome(origemNome);
  };

  const telaAtiva = professorIdentifier !== null ? "professor" : materia !== null ? "materia" : "home";

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
          onVoltar={() => setMateria(null)}
          onSelectMateria={selecionarMateria}
          onSelectProfessor={selecionarProfessor}
        />
      )}

      {telaAtiva === "professor" && professorIdentifier !== null && (
        <ProfessorScreen
          identifier={professorIdentifier}
          origemNome={origemProfessorNome}
          onVoltar={() => {
            setProfessorIdentifier(null);
            setOrigemProfessorNome(undefined);
          }}
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


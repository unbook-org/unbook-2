import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
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

  const selecionarMateria = (codigo: string, nivel: NivelEnsino = NIVEL_PADRAO) => {
    setProfessorIdentifier(null);
    setMateria({ codigo, nivel });
  };

  const selecionarProfessor = (identifier: string) => {
    setProfessorIdentifier(identifier);
  };

  const telaAtiva = professorIdentifier !== null ? "professor" : materia !== null ? "materia" : "home";

  return (
    <>
      <View style={[styles.tela, telaAtiva !== "home" && styles.oculta]}>
        <HomeScreen onSelectMateria={selecionarMateria} />
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
          onVoltar={() => setProfessorIdentifier(null)}
          onSelectMateria={(codigo) => selecionarMateria(codigo)}
        />
      )}

      {/* Barra Flutuante de Desenvolvimento para Alternar Telas Facilmente */}
      <View style={styles.devBarra}>
        <Text style={styles.devBarraTitulo}>Modo Dev:</Text>
        <Pressable
          onPress={() => setProfessorIdentifier("charles-xavier")}
          style={[styles.devBotao, telaAtiva === "professor" && styles.devBotaoAtivo]}
        >
          <Text style={styles.devBotaoTexto}>👨‍🏫 Professor</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setProfessorIdentifier(null);
            setMateria({ codigo: "IFD0071", nivel: "graduacao" });
          }}
          style={[styles.devBotao, telaAtiva === "materia" && styles.devBotaoAtivo]}
        >
          <Text style={styles.devBotaoTexto}>📚 Matéria</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setProfessorIdentifier(null);
            setMateria(null);
          }}
          style={[styles.devBotao, telaAtiva === "home" && styles.devBotaoAtivo]}
        >
          <Text style={styles.devBotaoTexto}>🏠 Home</Text>
        </Pressable>
      </View>

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
  devBarra: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1F1F1F",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 9999,
    ...(Platform.OS === "web"
      ? ({
          boxShadow: "0px 4px 12px rgba(0,0,0,0.35)",
        } as object)
      : {}),
  },
  devBarraTitulo: {
    color: "#F1C321",
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  devBotao: {
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    ...(Platform.OS === "web" ? ({ cursor: "pointer" } as object) : {}),
  },
  devBotaoAtivo: {
    backgroundColor: "#009A5E",
    borderColor: "#00FF9D",
  },
  devBotaoTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
});


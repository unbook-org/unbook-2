import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/home/HomeScreen";
import { MateriaScreen } from "./src/screens/materia/MateriaScreen";
import { NIVEL_PADRAO, type NivelEnsino } from "./src/utils/nivelEnsino";

interface MateriaSelecionada {
  codigo: string;
  nivel: NivelEnsino;
}

export default function App() {
  const [materia, setMateria] = useState<MateriaSelecionada | null>(null);
  const selecionarMateria = (codigo: string, nivel: NivelEnsino = NIVEL_PADRAO) =>
    setMateria({ codigo, nivel });

  return (
    <>
      <View style={[styles.tela, materia !== null && styles.oculta]}>
        <HomeScreen onSelectMateria={selecionarMateria} />
      </View>
      {materia !== null && (
        <MateriaScreen
          codigo={materia.codigo}
          nivel={materia.nivel}
          onVoltar={() => setMateria(null)}
          onSelectMateria={selecionarMateria}
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

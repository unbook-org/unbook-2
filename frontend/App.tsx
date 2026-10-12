import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HomeScreen } from "./src/screens/home/HomeScreen";
import { MateriaScreen } from "./src/screens/materia/MateriaScreen";

export default function App() {
  const [codigoMateria, setCodigoMateria] = useState<string | null>(null);

  return (
    <>
      <View style={[styles.tela, codigoMateria !== null && styles.oculta]}>
        <HomeScreen onSelectMateria={setCodigoMateria} />
      </View>
      {codigoMateria !== null && (
        <MateriaScreen
          codigo={codigoMateria}
          onVoltar={() => setCodigoMateria(null)}
          onSelectMateria={setCodigoMateria}
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

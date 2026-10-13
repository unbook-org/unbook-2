import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartoonButton } from '../components/CartoonButton';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { NewsBanner } from '../components/NewsBanner';
import { theme } from '../constants/theme';

export function NaoEncontradaScreen() {
  const router = useRouter();
  const irParaInicio = () => router.replace('/');

  return (
    <SafeAreaView style={styles.tela}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <NewsBanner />
        <Navbar onPressLogo={irParaInicio} onPressExplore={() => router.push('/catalogo')} />
        <View style={styles.aviso} accessibilityRole="alert">
          <Text style={styles.titulo}>Página não encontrada</Text>
          <Text style={styles.descricao}>
            O endereço que você acessou não existe ou foi digitado errado.
          </Text>
          <CartoonButton variant="secondary" onPress={irParaInicio} style={styles.botao}>
            Voltar para o início
          </CartoonButton>
        </View>
        <View style={styles.espacador} />
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
  aviso: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 64,
    marginHorizontal: 16,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 28,
    ...(Platform.OS === 'web'
      ? ({ boxShadow: `6px 6px 0px ${theme.colors.dark}` } as object)
      : { elevation: 6 }),
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.dark,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.darkCharcoal,
    textAlign: 'center',
  },
  botao: {
    marginTop: 8,
  },
  espacador: {
    flexGrow: 1,
  },
});

import { useRouter } from 'expo-router';
import React from 'react';
import { HomeScreen } from '../screens/home/HomeScreen';
import { hrefMateria } from '../utils/rotas';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onSelectMateria={(codigo, nivel) => router.push(hrefMateria(codigo, nivel))}
      onExplorar={() => router.push('/catalogo')}
    />
  );
}

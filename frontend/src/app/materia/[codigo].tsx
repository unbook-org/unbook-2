import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { MateriaScreen } from '../../screens/materia/MateriaScreen';
import { NaoEncontradaScreen } from '../../screens/NaoEncontradaScreen';
import { nivelDaUrl } from '../../utils/nivelEnsino';
import { hrefMateria } from '../../utils/rotas';

export default function MateriaRoute() {
  const router = useRouter();
  const { codigo, nivel } = useLocalSearchParams<{ codigo: string; nivel?: string }>();
  const nivelSelecionado = nivelDaUrl(nivel);

  if (!codigo || !nivelSelecionado) {
    return <NaoEncontradaScreen />;
  }

  return (
    <MateriaScreen
      codigo={codigo.toUpperCase()}
      nivel={nivelSelecionado}
      onVoltar={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      onSelectMateria={(codigoRequisito, nivelRequisito) =>
        router.push(hrefMateria(codigoRequisito, nivelRequisito))
      }
    />
  );
}

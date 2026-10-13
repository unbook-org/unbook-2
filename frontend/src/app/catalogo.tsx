import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { CatalogoScreen, type FiltrosCatalogo } from '../screens/catalogo/CatalogoScreen';
import { hrefMateria } from '../utils/rotas';

type ParametrosCatalogo = {
  tipo?: string;
  busca?: string;
  departamento?: string;
  pagina?: string;
};

function lerFiltros(parametros: ParametrosCatalogo): FiltrosCatalogo {
  const pagina = Number(parametros.pagina);
  return {
    tipo: parametros.tipo === 'professores' ? 'professores' : 'materias',
    termo: parametros.busca ?? '',
    departamentoId: parametros.departamento || null,
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

export default function CatalogoRoute() {
  const router = useRouter();
  const parametros = useLocalSearchParams<ParametrosCatalogo>();
  const filtros = lerFiltros(parametros);

  // Os filtros ficam na URL (ex.: /catalogo?departamento=...&busca=calculo) para o link ser compartilhável.
  const alterarFiltros = (novos: Partial<FiltrosCatalogo>) => {
    const proximos = { ...filtros, ...novos };
    router.setParams({
      tipo: proximos.tipo === 'professores' ? 'professores' : undefined,
      busca: proximos.termo || undefined,
      departamento: proximos.departamentoId ?? undefined,
      pagina: proximos.pagina > 1 ? String(proximos.pagina) : undefined,
    });
  };

  return (
    <CatalogoScreen
      filtros={filtros}
      onFiltros={alterarFiltros}
      onSelectMateria={(codigo) => router.push(hrefMateria(codigo))}
      onInicio={() => router.push('/')}
    />
  );
}

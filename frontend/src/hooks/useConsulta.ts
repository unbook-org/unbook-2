import { DependencyList, useEffect, useState } from 'react';

interface EstadoConsulta<Dados> {
  dados: Dados | null;
  carregando: boolean;
  erro: string | null;
}

interface ResultadoConsulta<Dados> {
  chave: string | null;
  dados: Dados | null;
  erro: string | null;
}

const SEM_CONSULTA = { dados: null, carregando: false, erro: null };

export function useConsulta<Dados>(
  executar: ((sinal: AbortSignal) => Promise<Dados>) | null,
  dependencias: DependencyList,
  atrasoMs = 0,
): EstadoConsulta<Dados> {
  const chave = JSON.stringify(dependencias);
  const [resultado, setResultado] = useState<ResultadoConsulta<Dados>>({
    chave: null,
    dados: null,
    erro: null,
  });

  useEffect(() => {
    if (!executar) {
      return;
    }

    const controlador = new AbortController();
    const temporizador = setTimeout(() => {
      executar(controlador.signal)
        .then((dados) => setResultado({ chave, dados, erro: null }))
        .catch((erro: Error) => {
          if (erro.name !== 'AbortError') {
            setResultado({ chave, dados: null, erro: erro.message });
          }
        });
    }, atrasoMs);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, executar === null]);

  if (!executar) {
    return SEM_CONSULTA;
  }
  const atualizado = resultado.chave === chave;
  return {
    dados: atualizado ? resultado.dados : null,
    carregando: !atualizado,
    erro: atualizado ? resultado.erro : null,
  };
}

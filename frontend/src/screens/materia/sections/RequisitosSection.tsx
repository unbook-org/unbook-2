import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { ArvoreRequisito, MateriaDetalhe, Requisito } from '../../../types/materia';
import { LARGURA_MAXIMA } from '../estilos';
import { IconeRequisitos } from '../icones';

interface RequisitosSectionProps {
  materia: MateriaDetalhe;
  onSelectMateria: (codigo: string) => void;
}

export function RequisitosSection({ materia, onSelectMateria }: RequisitosSectionProps) {
  const { width } = useWindowDimensions();
  const emLinha = width >= 980;

  return (
    <View style={styles.cartao}>
      <View style={styles.tituloCartao}>
        <IconeRequisitos />
        <Text style={styles.textoTitulo}>Requisitos</Text>
      </View>
      <View style={[styles.grupos, emLinha && styles.gruposEmLinha]}>
        <GrupoRequisitos
          titulo="Pré-requisitos"
          arvore={materia.pre_requisito_arvore}
          requisitos={materia.pre_requisitos}
          emLinha={emLinha}
          onSelectMateria={onSelectMateria}
        />
        <GrupoRequisitos
          titulo="Co-requisitos"
          arvore={materia.co_requisito_arvore}
          requisitos={materia.co_requisitos}
          emLinha={emLinha}
          onSelectMateria={onSelectMateria}
        />
        <GrupoRequisitos
          titulo="Equivalências"
          arvore={materia.equivalencia_arvore}
          requisitos={materia.equivalencias}
          emLinha={emLinha}
          onSelectMateria={onSelectMateria}
        />
      </View>
    </View>
  );
}

interface GrupoRequisitosProps {
  titulo: string;
  arvore: ArvoreRequisito | ArvoreRequisito[] | null;
  requisitos: Requisito[];
  emLinha: boolean;
  onSelectMateria: (codigo: string) => void;
}

function GrupoRequisitos({ titulo, arvore, requisitos, emLinha, onSelectMateria }: GrupoRequisitosProps) {
  const nomesPorCodigo = new Map(requisitos.map((requisito) => [requisito.codigo, requisito.nome]));

  return (
    <View style={[styles.grupo, emLinha && styles.grupoEmLinha]}>
      <Text style={styles.tituloGrupo}>{titulo.toUpperCase()}</Text>
      {requisitos.length === 0 || !arvore ? (
        <Text style={styles.vazio}>Nenhum.</Text>
      ) : (
        <NoRequisito
          arvore={arvore}
          nomesPorCodigo={nomesPorCodigo}
          onSelectMateria={onSelectMateria}
        />
      )}
    </View>
  );
}

interface NoRequisitoProps {
  arvore: ArvoreRequisito | ArvoreRequisito[];
  nomesPorCodigo: Map<string, string | null>;
  onSelectMateria: (codigo: string) => void;
  aninhado?: boolean;
}

function NoRequisito({ arvore, nomesPorCodigo, onSelectMateria, aninhado = false }: NoRequisitoProps) {
  if (Array.isArray(arvore)) {
    return (
      <NoRequisito
        arvore={{ 'relação': 'AND', condicao: arvore }}
        nomesPorCodigo={nomesPorCodigo}
        onSelectMateria={onSelectMateria}
        aninhado={aninhado}
      />
    );
  }

  if ('codigo' in arvore) {
    const nome = nomesPorCodigo.get(arvore.codigo);
    return (
      <Pressable
        onPress={nome ? () => onSelectMateria(arvore.codigo) : undefined}
        disabled={!nome}
        style={({ pressed }) => [styles.requisito, pressed && styles.requisitoPressionado]}
        accessibilityRole={nome ? 'link' : 'text'}
      >
        <Text style={styles.requisitoCodigo}>{arvore.codigo}</Text>
        <Text style={styles.requisitoNome}>{nome ?? 'Matéria não cadastrada'}</Text>
      </Pressable>
    );
  }

  const conector = arvore['relação'] === 'OR' ? 'OU' : 'E';
  return (
    <View style={[styles.arvore, aninhado && styles.arvoreAninhada]}>
      {!aninhado && (
        <Text style={styles.legendaArvore}>
          {conector === 'OU' ? 'Cumpra uma das opções:' : 'Cumpra todas:'}
        </Text>
      )}
      {(arvore.condicao ?? []).map((condicao, indice) => (
        <React.Fragment key={indice}>
          {indice > 0 && <Text style={styles.conector}>{conector}</Text>}
          <NoRequisito
            arvore={condicao}
            nomesPorCodigo={nomesPorCodigo}
            onSelectMateria={onSelectMateria}
            aninhado
          />
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    width: '100%',
    maxWidth: LARGURA_MAXIMA,
    alignSelf: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 20,
    gap: 16,
  },
  tituloCartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  grupos: {
    gap: 20,
  },
  gruposEmLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  grupo: {
    gap: 8,
  },
  grupoEmLinha: {
    flex: 1,
  },
  tituloGrupo: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.secondary,
    letterSpacing: 0.6,
  },
  vazio: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  arvore: {
    gap: 8,
  },
  arvoreAninhada: {
    borderWidth: 1.5,
    borderColor: theme.colors.lightGray,
    borderStyle: 'dashed',
    padding: 10,
  },
  legendaArvore: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.gray,
  },
  conector: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.secondary,
    paddingHorizontal: 4,
  },
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.cream,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requisitoPressionado: {
    backgroundColor: theme.colors.beige,
  },
  requisitoCodigo: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.secondary,
    minWidth: 72,
  },
  requisitoNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
  },
});

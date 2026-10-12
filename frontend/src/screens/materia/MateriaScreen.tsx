import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '../../constants/theme';
import { useConsulta } from '../../hooks/useConsulta';
import { getMateria } from '../../services/api';
import type { ArvoreRequisito, Requisito } from '../../types/materia';

interface MateriaScreenProps {
  codigo: string;
  onVoltar: () => void;
  onSelectMateria: (codigo: string) => void;
}

export function MateriaScreen({ codigo, onVoltar, onSelectMateria }: MateriaScreenProps) {
  const { dados: materia, carregando, erro } = useConsulta(
    (sinal) => getMateria(codigo, sinal),
    [codigo],
  );

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Pressable onPress={onVoltar} style={styles.botaoVoltar} accessibilityRole="button">
        <Text style={styles.textoVoltar}>← Voltar para a busca</Text>
      </Pressable>

      {carregando && <ActivityIndicator color={theme.colors.primary} style={styles.carregando} />}
      {!carregando && erro && <Text style={styles.erro}>{erro}</Text>}

      {!carregando && materia && (
        <View style={styles.card}>
          <Text style={styles.codigo}>{materia.codigo_materia}</Text>
          <Text style={styles.nome}>{materia.nome}</Text>
          {materia.departamento && (
            <Text style={styles.departamento}>{materia.departamento.nome}</Text>
          )}

          <View style={styles.etiquetas}>
            <Etiqueta texto={`${materia.creditos} créditos`} />
            <Etiqueta texto={`${materia.carga_horaria}h`} />
            {materia.nivel_de_ensino && <Etiqueta texto={materia.nivel_de_ensino} />}
          </View>

          <Secao titulo="Ementa">
            <Text style={styles.ementa}>{materia.ementa || 'Ementa não informada.'}</Text>
          </Secao>

          <SecaoRequisitos
            titulo="Pré-requisitos"
            arvore={materia.pre_requisito_arvore}
            requisitos={materia.pre_requisitos}
            onSelectMateria={onSelectMateria}
          />
          <SecaoRequisitos
            titulo="Co-requisitos"
            arvore={materia.co_requisito_arvore}
            requisitos={materia.co_requisitos}
            onSelectMateria={onSelectMateria}
          />
          <SecaoRequisitos
            titulo="Equivalências"
            arvore={materia.equivalencia_arvore}
            requisitos={materia.equivalencias}
            onSelectMateria={onSelectMateria}
          />
        </View>
      )}
    </ScrollView>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao}>{titulo}</Text>
      {children}
    </View>
  );
}

function Etiqueta({ texto }: { texto: string }) {
  return (
    <View style={styles.etiqueta}>
      <Text style={styles.textoEtiqueta}>{texto}</Text>
    </View>
  );
}

interface SecaoRequisitosProps {
  titulo: string;
  arvore: ArvoreRequisito | ArvoreRequisito[] | null;
  requisitos: Requisito[];
  onSelectMateria: (codigo: string) => void;
}

function SecaoRequisitos({ titulo, arvore, requisitos, onSelectMateria }: SecaoRequisitosProps) {
  const nomesPorCodigo = new Map(requisitos.map((requisito) => [requisito.codigo, requisito.nome]));

  return (
    <Secao titulo={titulo}>
      {requisitos.length === 0 || !arvore ? (
        <Text style={styles.vazio}>Nenhum.</Text>
      ) : (
        <NoRequisito
          arvore={arvore}
          nomesPorCodigo={nomesPorCodigo}
          onSelectMateria={onSelectMateria}
        />
      )}
    </Secao>
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
    <View style={[styles.grupo, aninhado && styles.grupoAninhado]}>
      {!aninhado && (
        <Text style={styles.legendaGrupo}>
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

const sombra = (deslocamento: number) =>
  Platform.OS === 'web'
    ? ({ boxShadow: `${deslocamento}px ${deslocamento}px 0px ${theme.colors.dark}` } as object)
    : {};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  conteudo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  botaoVoltar: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 820,
    marginBottom: 16,
  },
  textoVoltar: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  carregando: {
    marginTop: 48,
  },
  erro: {
    marginTop: 32,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.danger,
  },
  card: {
    width: '100%',
    maxWidth: 820,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    borderRadius: 8,
    padding: 28,
    ...sombra(6),
  },
  codigo: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  nome: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.dark,
    marginTop: 4,
  },
  departamento: {
    fontSize: 14,
    color: theme.colors.gray,
    marginTop: 4,
  },
  etiquetas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  etiqueta: {
    backgroundColor: theme.colors.beige,
    borderWidth: 1.5,
    borderColor: theme.colors.dark,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  textoEtiqueta: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dark,
  },
  secao: {
    marginTop: 28,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.dark,
    marginBottom: 10,
  },
  ementa: {
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.textPrimary,
  },
  vazio: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  grupo: {
    gap: 8,
  },
  grupoAninhado: {
    borderWidth: 1.5,
    borderColor: theme.colors.lightGray,
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 10,
  },
  legendaGrupo: {
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
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  requisitoPressionado: {
    backgroundColor: theme.colors.beige,
  },
  requisitoCodigo: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
    minWidth: 72,
  },
  requisitoNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
  },
});

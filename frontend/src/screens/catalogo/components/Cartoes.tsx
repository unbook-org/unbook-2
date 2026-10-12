import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../constants/theme';
import type { MateriaResumo, ProfessorCatalogo } from '../../../types/materia';
import { corDoCartao, fonteMono, sombra } from '../estilos';

export const LARGURA_CARTAO = 240;
const ALTURA_CARTAO = 136;
// No card preto, o selo inverte para continuar visível.
const FUNDO_ESCURO = '#1F1F1F';

function Selo({ texto, escuro }: { texto: string; escuro: boolean }) {
  return (
    <View style={[styles.selo, escuro ? styles.seloEscuro : styles.seloClaro]}>
      <Text style={[styles.textoSelo, { color: escuro ? theme.colors.white : theme.colors.dark }]}>
        {texto}
      </Text>
    </View>
  );
}

interface CartaoMateriaProps {
  materia: MateriaResumo;
  onPress: () => void;
  largura?: number;
}

export function CartaoMateria({ materia, onPress, largura = LARGURA_CARTAO }: CartaoMateriaProps) {
  const sigla = materia.departamento?.codigo ?? materia.codigo_materia.slice(0, 3);
  const cor = corDoCartao(`${materia.codigo_materia}${materia.nome}`);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${materia.codigo_materia} ${materia.nome}`}
      style={({ pressed }) => [
        styles.cartao,
        { width: largura, backgroundColor: cor.fundo },
        pressed && styles.pressionado,
      ]}
    >
      <Selo texto={sigla} escuro={cor.fundo !== FUNDO_ESCURO} />
      <Text style={[styles.titulo, { color: cor.texto }]} numberOfLines={3}>
        {materia.nome}
      </Text>
      <Text style={[styles.rodape, { color: cor.texto }]}>{materia.codigo_materia}</Text>
    </Pressable>
  );
}

export function CartaoProfessor({
  professor,
  largura = LARGURA_CARTAO,
}: {
  professor: ProfessorCatalogo;
  largura?: number;
}) {
  const sigla = professor.departamento?.codigo ?? '—';
  const cor = corDoCartao(professor.slug);

  // Sem link: a página de perfil do professor é a issue #22.
  return (
    <View style={[styles.cartao, { width: largura, backgroundColor: cor.fundo }]}>
      <Selo texto={sigla} escuro={cor.fundo !== FUNDO_ESCURO} />
      <Text style={[styles.titulo, { color: cor.texto }]} numberOfLines={3}>
        {professor.nome_completo}
      </Text>
      <Text style={[styles.rodape, { color: cor.texto }]} numberOfLines={1}>
        {professor.titulo_academico ?? professor.departamento?.nome ?? ''}
      </Text>
    </View>
  );
}

export function CartaoVerMais({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.cartao, styles.verMais, pressed && styles.pressionado]}
    >
      <Text style={styles.setaVerMais}>→</Text>
      <Text style={styles.textoVerMais}>VER MAIS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    height: ALTURA_CARTAO,
    borderWidth: 2,
    borderColor: theme.colors.dark,
    padding: 16,
    justifyContent: 'space-between',
    ...sombra(5),
  },
  pressionado: {
    opacity: 0.85,
  },
  selo: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  seloEscuro: {
    backgroundColor: theme.colors.dark,
  },
  seloClaro: {
    backgroundColor: theme.colors.white,
  },
  textoSelo: {
    fontFamily: fonteMono,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  rodape: {
    fontFamily: fonteMono,
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.85,
  },
  verMais: {
    width: LARGURA_CARTAO,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  setaVerMais: {
    fontSize: 18,
    color: '#F3B6A6',
  },
  textoVerMais: {
    fontFamily: fonteMono,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#F3B6A6',
  },
});

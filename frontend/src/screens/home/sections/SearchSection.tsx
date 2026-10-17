import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  Linking,
} from 'react-native';
import Svg, { Path, Circle, Line, Defs, Pattern, Rect } from 'react-native-svg';
import { SeletorDepartamento } from '../../../components/SeletorDepartamento';
import { useConsulta } from '../../../hooks/useConsulta';
import {
  TAMANHO_MINIMO_BUSCA,
  buscarMaterias,
  listarDepartamentos,
  listarProfessores,
} from '../../../services/api';
import type { MateriaResumo } from '../../../types/materia';
import type { ProfessorListItem } from '../../../types/professor';
import type { NivelEnsino } from '../../../utils/nivelEnsino';

const ATRASO_BUSCA_MS = 350;

export type SearchTab = 'disciplinas' | 'docentes' | 'artigos' | 'ia';

export function getCategoryColors(tab: SearchTab) {
  switch (tab) {
    case 'disciplinas':
      return {
        main: '#009A5E',
        bg: '#EAF7F0',
        badgeBg: '#009A5E',
        badgeText: '#FFFFFF',
      };
    case 'docentes':
      return {
        main: '#1349EB',
        bg: '#EEF4FF',
        badgeBg: '#1349EB',
        badgeText: '#FFFFFF',
      };
    case 'artigos':
      return {
        main: '#8B5CF6',
        bg: '#F5EEFF',
        badgeBg: '#8B5CF6',
        badgeText: '#FFFFFF',
      };
    case 'ia':
      return {
        main: '#EA580C',
        bg: '#FFF4EB',
        badgeBg: '#EA580C',
        badgeText: '#FFFFFF',
      };
  }
}

interface SearchSectionProps {
  onSelectMateria: (codigo: string, nivel?: NivelEnsino) => void;
  onSelectProfessor?: (identifier: string, origemNome?: string) => void;
}

// =========================================================================
// ÍCONES VETORIAIS NEO-BRUTALISTAS
// =========================================================================

function SearchIcon({ size = 20, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2.5" />
      <Line
        x1="16.5"
        y1="16.5"
        x2="21"
        y2="21"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function BookIcon({ size = 15, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function UserIcon({ size = 15, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2.4" />
    </Svg>
  );
}

function SparklesIcon({ size = 15, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 15l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LightningIcon({ size = 15, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronLeftIcon({ size = 15, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 15, color = '#9CA3AF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SlidersIcon({ size = 13, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Circle cx="4" cy="12" r="2" stroke={color} strokeWidth="2.4" fill="none" />
      <Circle cx="12" cy="10" r="2" stroke={color} strokeWidth="2.4" fill="none" />
      <Circle cx="20" cy="14" r="2" stroke={color} strokeWidth="2.4" fill="none" />
    </Svg>
  );
}

function MailIcon({ size = 13, color = '#4B5563' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} strokeWidth="2.2" />
      <Path d="M22 6L12 13 2 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TipBulbIcon({ size = 15, color = '#1F1F1F' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6m-4 3h2M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.6 3.2 5.8.5.3.8.9.8 1.5v.7h6v-.7c0-.6.3-1.2.8-1.5C17.7 13.6 19 11.5 19 9a7 7 0 0 0-7-7z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// =========================================================================
// FUNDO PAPEL QUADRICULADO (CADERNO MILLIMÉTRICO / GRAPH PAPER)
// =========================================================================

function GraphPaperBackground() {
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        <Pattern
          id="search-graph-grid"
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <Path
            d="M 36 0 L 0 0 0 36"
            fill="none"
            stroke="rgba(0, 0, 0, 0.05)"
            strokeWidth="1"
          />
        </Pattern>
      </Defs>
      {/* Papel base branco suave */}
      <Rect width="100%" height="100%" fill="#FAF9F5" />
      {/* Grade milimétrica */}
      <Rect width="100%" height="100%" fill="url(#search-graph-grid)" />
    </Svg>
  );
}

// =========================================================================
// COMPONENTE PRINCIPAL SEARCH SECTION
// =========================================================================

export function SearchSection({ onSelectMateria, onSelectProfessor }: SearchSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const inputRef = useRef<TextInput>(null);

  const [termo, setTermo] = useState('');
  const [departamentoId, setDepartamentoId] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [activeTab, setActiveTab] = useState<SearchTab>('disciplinas');
  const [showDeptSelector, setShowDeptSelector] = useState(false);
  const [showFilterTray, setShowFilterTray] = useState(false);
  const [exibirDicas, setExibirDicas] = useState(true);

  const [pesquisarHovered, setPesquisarHovered] = useState(false);

  const termoLimpo = termo.trim();
  const termoCurto = termoLimpo.length > 0 && termoLimpo.length < TAMANHO_MINIMO_BUSCA;
  const emBusca = termoLimpo.length > 0 || departamentoId !== null;
  const buscaAtiva =
    activeTab === 'disciplinas' && (!termoCurto && (termoLimpo.length > 0 || departamentoId !== null));
  const buscaDocentesAtiva =
    activeTab === 'docentes' && (!termoCurto && (termoLimpo.length > 0 || departamentoId !== null));

  const departamentos = useConsulta((sinal) => listarDepartamentos(sinal), []);
  const { dados, carregando, erro } = useConsulta(
    buscaAtiva
      ? (sinal) => buscarMaterias({ termo: termoLimpo, departamentoId, pagina }, sinal)
      : null,
    [buscaAtiva, termoLimpo, departamentoId, pagina],
    ATRASO_BUSCA_MS,
  );
  const {
    dados: dadosDocentes,
    carregando: carregandoDocentes,
    erro: erroDocentes,
  } = useConsulta(
    buscaDocentesAtiva
      ? (sinal) =>
          listarProfessores(
            {
              busca: termoLimpo || undefined,
              departamento: departamentoId ?? undefined,
              pagina,
              limite: 10,
            },
            sinal,
          )
      : null,
    [buscaDocentesAtiva, termoLimpo, departamentoId, pagina],
    ATRASO_BUSCA_MS,
  );

  const categoryColors = getCategoryColors(activeTab);
  const deptoSelecionado = departamentos.dados?.find((d) => d.id === departamentoId);

  const alterarTermo = (novoTermo: string) => {
    setTermo(novoTermo);
    setPagina(1);
  };

  const alterarDepartamento = (novoDepartamentoId: string | null) => {
    setDepartamentoId(novoDepartamentoId);
    setPagina(1);
  };

  const handleRecentSearch = (termoPesquisa: string, tab: SearchTab = 'disciplinas') => {
    setActiveTab(tab);
    setTermo(termoPesquisa);
    setPagina(1);
  };

  const trocarAba = (tab: SearchTab) => {
    setActiveTab(tab);
    setPagina(1);
  };

  const handleOpenCaptureDocs = () => {
    const url = 'https://github.com/unbook-org/unbook-2/blob/main/docs/catalogo.md';
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case 'disciplinas':
        return 'Ex.: FÍSICA 1, Cálculo, CIC0004, Estruturas...';
      case 'docentes':
        return 'Ex.: Prof. Alberto, Carla, Departamento...';
      case 'artigos':
        return 'Ex.: TCC, Inteligência Artificial, Engenharia...';
      case 'ia':
        return 'Ex.: Quais matérias puxar no 3º semestre de CC?';
      default:
        return 'Digite sua busca...';
    }
  };

  const RECENT_SEARCHES = [
    { label: 'Cálculo I', query: 'Cálculo 1', tab: 'disciplinas' as SearchTab },
    { label: 'Prof. Silva', query: 'Silva', tab: 'docentes' as SearchTab },
    { label: 'TCC', query: 'Trabalho de Conclusão', tab: 'disciplinas' as SearchTab },
    { label: 'Laboratório', query: 'Laboratório', tab: 'disciplinas' as SearchTab },
    { label: 'Grade 2025', query: '2025', tab: 'disciplinas' as SearchTab },
  ];

  return (
    <View
      nativeID="search-section"
      // @ts-ignore - ID para ancoragem suave na web
      id="search-section"
      style={styles.sectionWrapper}
    >
      {/* Fundo quadriculado milimétrico (estilo caderno de exatas) */}
      <GraphPaperBackground />

      <View style={styles.centerContainer}>
        {/* ========================================================================= */}
        {/* BADGE SUPERIOR 'BUSCAR' */}
        {/* ========================================================================= */}
        <View style={styles.topBadgeWrapper}>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeText}>BUSCAR</Text>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* TÍTULO PRINCIPAL E SUBTÍTULO */}
        {/* ========================================================================= */}
        <Text style={[styles.mainTitle, isMobile && styles.mainTitleMobile]}>
          Qual informação você{' '}
          <Text style={styles.mainTitleGreen}>gostaria de encontrar</Text> hoje?
        </Text>

        <Text style={[styles.mainSubtitle, isMobile && styles.mainSubtitleMobile]}>
          Descubra informações sobre disciplinas, professores e muito mais
        </Text>

        {/* ========================================================================= */}
        {/* CAIXA DE PESQUISA NEO-BRUTALISTA */}
        {/* ========================================================================= */}
        <View style={[styles.searchBoxCard, isMobile && styles.searchBoxCardMobile]}>
          {/* Linha Superior: Campo de Input de Texto */}
          <View style={styles.inputArea}>
            <View style={styles.searchIconWrapper}>
              <SearchIcon size={20} color="#1F1F1F" />
            </View>

            <TextInput
              ref={inputRef}
              value={termo}
              onChangeText={alterarTermo}
              placeholder={getPlaceholderText()}
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              accessibilityLabel="Campo de pesquisa"
            />

            {termo.length > 0 && (
              <Pressable
                onPress={() => alterarTermo('')}
                style={styles.clearInputBtn}
                accessibilityRole="button"
                accessibilityLabel="Limpar texto digitado"
              >
                <Text style={styles.clearInputText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Barra Inferior: Abas de Filtros + Botões Limpar e Pesquisar */}
          <View
            style={[
              styles.toolbarRow,
              { backgroundColor: categoryColors.bg },
              isMobile && styles.toolbarRowMobile,
            ]}
          >
            {/* Abas de Categorias */}
            <View style={[styles.filterTabsRow, isMobile && styles.filterTabsRowMobile]}>
              <Pressable
                accessibilityRole="tab"
                onPress={() => trocarAba('disciplinas')}
                style={({ pressed }) => [
                  styles.filterTab,
                  activeTab === 'disciplinas'
                    ? styles.filterTabDisciplinasActive
                    : styles.filterTabInactive,
                  pressed && styles.filterTabPressed,
                ]}
              >
                <BookIcon
                  size={14}
                  color={activeTab === 'disciplinas' ? '#FFFFFF' : '#1F1F1F'}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    activeTab === 'disciplinas'
                      ? styles.filterTabTextActive
                      : styles.filterTabTextInactive,
                  ]}
                >
                  DISCIPLINAS
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="tab"
                onPress={() => trocarAba('docentes')}
                style={({ pressed }) => [
                  styles.filterTab,
                  activeTab === 'docentes'
                    ? styles.filterTabDocentesActive
                    : styles.filterTabInactive,
                  pressed && styles.filterTabPressed,
                ]}
              >
                <UserIcon
                  size={14}
                  color={activeTab === 'docentes' ? '#FFFFFF' : '#1F1F1F'}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    activeTab === 'docentes'
                      ? styles.filterTabTextActive
                      : styles.filterTabTextInactive,
                  ]}
                >
                  DOCENTES
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="tab"
                onPress={() => trocarAba('artigos')}
                style={({ pressed }) => [
                  styles.filterTab,
                  activeTab === 'artigos'
                    ? styles.filterTabArtigosActive
                    : styles.filterTabInactive,
                  pressed && styles.filterTabPressed,
                ]}
              >
                <SparklesIcon
                  size={14}
                  color={activeTab === 'artigos' ? '#FFFFFF' : '#1F1F1F'}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    activeTab === 'artigos'
                      ? styles.filterTabTextActive
                      : styles.filterTabTextInactive,
                  ]}
                >
                  ARTIGOS
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="tab"
                onPress={() => trocarAba('ia')}
                style={({ pressed }) => [
                  styles.filterTab,
                  activeTab === 'ia'
                    ? styles.filterTabIaActive
                    : styles.filterTabInactive,
                  pressed && styles.filterTabPressed,
                ]}
              >
                <LightningIcon
                  size={14}
                  color={activeTab === 'ia' ? '#FFFFFF' : '#1F1F1F'}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    activeTab === 'ia'
                      ? styles.filterTabTextActive
                      : styles.filterTabTextInactive,
                  ]}
                >
                  PESQUISA INTELIGENTE
                </Text>
              </Pressable>
            </View>

            {/* Ações da Direita: FILTROS e PESQUISAR */}
            <View style={[styles.toolbarRightActions, isMobile && styles.toolbarRightActionsMobile]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showFilterTray ? 'Recolher filtros' : 'Expandir filtros'}
                onPress={() => setShowFilterTray((prev) => !prev)}
                style={({ pressed }) => [
                  styles.filtrosButton,
                  showFilterTray && styles.filtrosButtonActive,
                  pressed && styles.filtrosButtonPressed,
                ]}
              >
                <SlidersIcon
                  size={13}
                  color={showFilterTray ? categoryColors.main : '#1F1F1F'}
                />
                <Text
                  style={[
                    styles.filtrosButtonText,
                    showFilterTray && { color: categoryColors.main },
                  ]}
                >
                  FILTROS
                </Text>
                {departamentoId !== null && <View style={styles.filtrosActiveDot} />}
                <Text
                  style={[
                    styles.filtrosArrow,
                    showFilterTray && { color: categoryColors.main },
                  ]}
                >
                  {showFilterTray ? '▲' : '▼'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (activeTab === 'disciplinas' && termoLimpo.length < TAMANHO_MINIMO_BUSCA) {
                    if (inputRef.current) inputRef.current.focus();
                  }
                }}
                onHoverIn={() => setPesquisarHovered(true)}
                onHoverOut={() => setPesquisarHovered(false)}
                style={({ pressed }) => [
                  styles.pesquisarButton,
                  pesquisarHovered && styles.pesquisarButtonHovered,
                  pressed && styles.pesquisarButtonPressed,
                ]}
              >
                <Text style={styles.pesquisarButtonText}>PESQUISAR</Text>
              </Pressable>
            </View>
          </View>

          {/* ========================================================================= */}
          {/* BANDEJA DINÂMICA DE FERRAMENTAS (EXPANDIDA VIA BOTÃO FILTROS OU CARDS) */}
          {/* ========================================================================= */}
          {showFilterTray && (
            <View
              style={[
                styles.contextToolTray,
                { backgroundColor: categoryColors.bg },
              ]}
            >
              {/* FERRAMENTA 1: DISCIPLINAS -> FILTRO POR DEPARTAMENTO */}
              {activeTab === 'disciplinas' && (
                <View style={styles.toolTrayContent}>
                  <View style={styles.toolTrayHeader}>
                    <View style={[styles.toolTagBadge, { backgroundColor: '#009A5E' }]}>
                      <Text style={styles.toolTagBadgeText}>FILTRO DE DEPARTAMENTO</Text>
                    </View>
                  <Text style={styles.toolTraySubtitle}>
                    Filtre o catálogo por departamento da UnB ou use os atalhos:
                  </Text>
                </View>

                <View style={[styles.toolControlsRow, isMobile && styles.toolControlsRowMobile]}>
                  {/* Dropdown / Botão Seletor de Departamento */}
                  <Pressable
                    onPress={() => setShowDeptSelector((prev) => !prev)}
                    style={({ pressed }) => [
                      styles.deptSelectorBtn,
                      departamentoId !== null && styles.deptSelectorBtnActive,
                      pressed && styles.deptSelectorBtnPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Escolher departamento da UnB"
                  >
                    <Text
                      style={[
                        styles.deptSelectorBtnText,
                        departamentoId !== null && styles.deptSelectorBtnTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {departamentos.carregando
                        ? 'Carregando departamentos...'
                        : deptoSelecionado
                        ? `${deptoSelecionado.codigo} — ${deptoSelecionado.nome}`
                        : 'Filtrar por Departamento UnB ▾'}
                    </Text>
                    <Text style={styles.deptSelectorBtnArrow}>
                      {showDeptSelector ? '▲' : '▼'}
                    </Text>
                  </Pressable>

                  {/* Botão Limpar Departamento */}
                  {departamentoId !== null && (
                    <Pressable
                      onPress={() => alterarDepartamento(null)}
                      style={styles.deptClearActionBtn}
                      accessibilityRole="button"
                      accessibilityLabel="Limpar filtro de departamento"
                    >
                      <Text style={styles.deptClearActionText}>✕ Limpar Depto</Text>
                    </Pressable>
                  )}

                  {/* Atalhos Rápidos dos Departamentos mais buscados */}
                  <View style={styles.quickDeptsGroup}>
                    {['Todos', 'CIC', 'MAT', 'FGA', 'IF', 'IQ', 'FT'].map((sigla) => {
                      const isTodos = sigla === 'Todos';
                      const dptoEncontrado = departamentos.dados?.find(
                        (d) =>
                          d.codigo.toUpperCase() === sigla ||
                          d.nome.toUpperCase().includes(sigla)
                      );
                      const isAtivo = isTodos
                        ? departamentoId === null
                        : dptoEncontrado && dptoEncontrado.id === departamentoId;

                      return (
                        <Pressable
                          key={sigla}
                          onPress={() => {
                            if (isTodos) {
                              alterarDepartamento(null);
                            } else if (dptoEncontrado) {
                              alterarDepartamento(
                                isAtivo ? null : dptoEncontrado.id
                              );
                            }
                          }}
                          style={({ pressed }) => [
                            styles.quickDeptChip,
                            isAtivo && styles.quickDeptChipGreenActive,
                            pressed && styles.quickDeptChipPressed,
                          ]}
                          accessibilityRole="button"
                          accessibilityLabel={`Filtrar por ${sigla}`}
                        >
                          <Text
                            style={[
                              styles.quickDeptChipText,
                              isAtivo && styles.quickDeptChipTextActive,
                            ]}
                          >
                            {sigla}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Dropdown com a lista completa se expandido */}
                {showDeptSelector && (
                  <View style={styles.deptFullDropdownWrapper}>
                    <SeletorDepartamento
                      departamentos={departamentos.dados}
                      selecionadoId={departamentoId}
                      onSelecionar={(id) => {
                        alterarDepartamento(id);
                        setShowDeptSelector(false);
                      }}
                      carregando={departamentos.carregando}
                      erro={departamentos.erro}
                    />
                  </View>
                )}
              </View>
            )}

            {/* FERRAMENTA 2: DOCENTES -> FILTRO DE PROFESSORES */}
            {activeTab === 'docentes' && (
              <View style={styles.toolTrayContent}>
                <View style={styles.toolTrayHeader}>
                  <View style={[styles.toolTagBadge, { backgroundColor: '#1349EB' }]}>
                    <Text style={styles.toolTagBadgeText}>CORPO DOCENTE UnB</Text>
                  </View>
                  <Text style={styles.toolTraySubtitle}>
                    Filtros rápidos de titulação e departamentos de professores:
                  </Text>
                </View>

                <View style={styles.quickDeptsGroup}>
                  {[
                    { label: 'Todos', query: '' },
                    { label: 'Prof. Adjunto', query: 'Adjunto' },
                    { label: 'Prof. Titular', query: 'Titular' },
                    { label: 'Doutorado', query: 'Doutor' },
                    { label: 'Com Avaliações', query: 'Avaliações' },
                    { label: 'Ciência da Computação', query: 'Computação' },
                    { label: 'Matemática', query: 'Matemática' },
                  ].map((item, idx) => {
                    const isAtivo =
                      item.query === '' ? termo === '' : termo === item.query;
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => alterarTermo(item.query)}
                        style={({ pressed }) => [
                          styles.quickDeptChip,
                          isAtivo && styles.quickDeptChipBlueActive,
                          pressed && styles.quickDeptChipPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.quickDeptChipText,
                            isAtivo && styles.quickDeptChipTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* FERRAMENTA 3: ARTIGOS -> FILTRO DE PUBLICAÇÕES */}
            {activeTab === 'artigos' && (
              <View style={styles.toolTrayContent}>
                <View style={styles.toolTrayHeader}>
                  <View style={[styles.toolTagBadge, { backgroundColor: '#8B5CF6' }]}>
                    <Text style={styles.toolTagBadgeText}>ACERVO & PUBLICAÇÕES</Text>
                  </View>
                  <Text style={styles.toolTraySubtitle}>
                    Filtre pelo tipo de produção acadêmica e científica:
                  </Text>
                </View>

                <View style={styles.quickDeptsGroup}>
                  {[
                    { label: 'Todos', query: '' },
                    { label: 'TCC & Monografias', query: 'TCC' },
                    { label: 'Artigos Científicos', query: 'Artigo' },
                    { label: 'Workshops & Eventos', query: 'Workshop' },
                    { label: 'Dissertações Mestrado', query: 'Mestrado' },
                    { label: 'Linhas de Pesquisa', query: 'Pesquisa' },
                  ].map((item, idx) => {
                    const isAtivo =
                      item.query === '' ? termo === '' : termo === item.query;
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => alterarTermo(item.query)}
                        style={({ pressed }) => [
                          styles.quickDeptChip,
                          isAtivo && styles.quickDeptChipPurpleActive,
                          pressed && styles.quickDeptChipPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.quickDeptChipText,
                            isAtivo && styles.quickDeptChipTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* FERRAMENTA 4: PESQUISA INTELIGENTE -> MODELO IA */}
            {activeTab === 'ia' && (
              <View style={styles.toolTrayContent}>
                <View style={styles.toolTrayHeader}>
                  <View style={[styles.toolTagBadge, { backgroundColor: '#EA580C' }]}>
                    <Text style={styles.toolTagBadgeText}>PROMPTS UNBOOK IA</Text>
                  </View>
                  <Text style={styles.toolTraySubtitle}>
                    Clique em um atalho para preencher a pergunta para a IA:
                  </Text>
                </View>

                <View style={styles.quickDeptsGroup}>
                  {[
                    {
                      label: 'Montar Grade Sem Conflitos',
                      prompt:
                        'Montar grade semestral recomendada sem choque de horários',
                    },
                    {
                      label: 'Turmas com Menção Alta',
                      prompt:
                        'Quais turmas têm melhor média de notas e aprovação?',
                    },
                    {
                      label: 'Melhores Eletivas de Exatas',
                      prompt:
                        'Quais as melhores matérias optativas de exatas na UnB?',
                    },
                    {
                      label: 'Verificar Pré-requisitos',
                      prompt:
                        'Verificar cadeia de pré-requisitos para formatura',
                    },
                  ].map((item, idx) => {
                    const isAtivo = termo === item.prompt;
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => alterarTermo(item.prompt)}
                        style={({ pressed }) => [
                          styles.quickDeptChip,
                          isAtivo && styles.quickDeptChipOrangeActive,
                          pressed && styles.quickDeptChipPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.quickDeptChipText,
                            isAtivo && styles.quickDeptChipTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

        {/* ========================================================================= */}
        {/* PESQUISAS RECENTES & CONTROLE DE DICAS */}
        {/* ========================================================================= */}
        <View style={[styles.recentSearchesRow, isMobile && styles.recentSearchesRowMobile]}>
          <View style={styles.recentSearchesLeft}>
            <Text style={styles.recentSearchesLabel}>PESQUISAS RECENTES:</Text>
            <View style={styles.recentPillsWrapper}>
              {RECENT_SEARCHES.map((item, idx) => (
                <Pressable
                  key={idx}
                  accessibilityRole="button"
                  onPress={() => handleRecentSearch(item.query, item.tab)}
                  style={({ pressed }) => [
                    styles.recentPill,
                    pressed && styles.recentPillPressed,
                  ]}
                >
                  <Text style={styles.recentPillText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Botão para habilitar ou desabilitar as dicas */}
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: exibirDicas }}
            accessibilityLabel={exibirDicas ? "Ocultar dicas de pesquisa" : "Exibir dicas de pesquisa"}
            onPress={() => setExibirDicas((prev) => !prev)}
            style={({ pressed }) => [
              styles.toggleDicasBtn,
              exibirDicas ? styles.toggleDicasBtnAtivo : styles.toggleDicasBtnInativo,
              pressed && styles.toggleDicasBtnPressed,
            ]}
          >
            <TipBulbIcon size={12} color={exibirDicas ? "#009A5E" : "#6B7280"} />
            <Text
              style={[
                styles.toggleDicasTexto,
                exibirDicas ? styles.toggleDicasTextoAtivo : styles.toggleDicasTextoInativo,
              ]}
            >
              {exibirDicas ? "DICAS: ATIVAS" : "DICAS: OCULTAS"}
            </Text>
            <View
              style={[
                styles.toggleDicasSwitch,
                exibirDicas && styles.toggleDicasSwitchAtivo,
              ]}
            >
              <View
                style={[
                  styles.toggleDicasThumb,
                  exibirDicas && styles.toggleDicasThumbAtivo,
                ]}
              />
            </View>
          </Pressable>
        </View>

        {/* ========================================================================= */}
        {/* CONTEÚDO CONDICIONAL: CARDS OU RESULTADOS DA PESQUISA */}
        {/* ========================================================================= */}
        {!emBusca ? (
          exibirDicas ? (
            /* FORMATO DE DICAS (TIPS) DE PESQUISA (SEM EMOJIS) */
            <SearchTipsBox
              activeTab={activeTab}
              isMobile={isMobile}
              onOpenFilters={() => setShowFilterTray(true)}
              onSelectQuery={(q, tab) => {
                if (tab) setActiveTab(tab);
                alterarTermo(q);
                if (inputRef.current) inputRef.current.focus();
              }}
            />
          ) : null
        ) : (
          /* ÁREA DE RESULTADOS DA PESQUISA (SUBSTITUI OS CARDS) */
          <View style={styles.resultsArea}>
            {termoCurto && departamentoId === null && (
              <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  Digite pelo menos {TAMANHO_MINIMO_BUSCA} caracteres para ver os resultados.
                </Text>
              </View>
            )}

            {buscaAtiva && carregando && (
              <View style={styles.loadingBox}>
                <ActivityIndicator color="#009A5E" size="large" />
                <Text style={styles.loadingText}>Buscando no catálogo oficial da UnB...</Text>
              </View>
            )}

            {buscaAtiva && !carregando && erro && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            )}

            {buscaAtiva && !carregando && dados && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsHeaderRow}>
                  <Text style={styles.resultsTotalCount}>
                    {dados.meta.total_items === 0
                      ? 'Nenhuma matéria encontrada.'
                      : `${dados.meta.total_items} ${
                          dados.meta.total_items === 1
                            ? 'disciplina encontrada'
                            : 'disciplinas encontradas'
                        }`}
                  </Text>
                  {termoLimpo.length > 0 && (
                    <Text style={styles.resultsQueryBadge}>{`"${termoLimpo}"`}</Text>
                  )}
                </View>

                {dados.meta.total_items === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <Text style={styles.emptyStateTitle}>Nenhuma matéria encontrada</Text>
                    <Text style={styles.emptyStateDesc}>
                      {`Não encontramos resultados para "${termoLimpo}". Tente buscar por parte do nome, código ou sem abreviações.`}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.itemsList}>
                    {dados.items.map((materia) => (
                      <ItemMateriaCard
                        key={materia.codigo_materia}
                        materia={materia}
                        onPress={() => onSelectMateria(materia.codigo_materia)}
                      />
                    ))}
                  </View>
                )}

                {dados.meta.total_pages > 1 && (
                  <Paginacao
                    pagina={dados.meta.page}
                    totalPaginas={dados.meta.total_pages}
                    onMudar={setPagina}
                  />
                )}
              </View>
            )}

            {/* RESULTADOS DA ABA DOCENTES */}
            {buscaDocentesAtiva && carregandoDocentes && (
              <View style={styles.loadingBox}>
                <ActivityIndicator color="#1349EB" size="large" />
                <Text style={styles.loadingText}>Buscando no corpo docente da UnB...</Text>
              </View>
            )}

            {buscaDocentesAtiva && !carregandoDocentes && erroDocentes && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{erroDocentes}</Text>
              </View>
            )}

            {buscaDocentesAtiva && !carregandoDocentes && dadosDocentes && (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsHeaderRow}>
                  <Text style={styles.resultsTotalCount}>
                    {dadosDocentes.meta.total_items === 0
                      ? 'Nenhum docente encontrado.'
                      : `${dadosDocentes.meta.total_items} ${
                          dadosDocentes.meta.total_items === 1
                            ? 'docente encontrado'
                            : 'docentes encontrados'
                        }`}
                  </Text>
                  {termoLimpo.length > 0 && (
                    <Text style={[styles.resultsQueryBadge, { backgroundColor: '#EEF4FF', color: '#1349EB' }]}>
                      {`"${termoLimpo}"`}
                    </Text>
                  )}
                </View>

                {dadosDocentes.meta.total_items === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <Text style={styles.emptyStateTitle}>Nenhum docente encontrado</Text>
                    <Text style={styles.emptyStateDesc}>
                      {`Não encontramos resultados para "${termoLimpo}". Tente buscar por parte do nome ou sem acentos.`}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.itemsList}>
                    {dadosDocentes.items.map((professor) => (
                      <ItemProfessorCard
                        key={professor.id}
                        professor={professor}
                        onPress={() => onSelectProfessor?.(professor.slug || professor.id, 'pesquisa')}
                      />
                    ))}
                  </View>
                )}

                {dadosDocentes.meta.total_pages > 1 && (
                  <Paginacao
                    pagina={dadosDocentes.meta.page}
                    totalPaginas={dadosDocentes.meta.total_pages}
                    onMudar={setPagina}
                  />
                )}
              </View>
            )}

            {activeTab === 'artigos' && termoLimpo.length > 0 && (
              <View style={styles.categoryInfoBox}>
                <View style={[styles.categoryInfoIconCircle, { backgroundColor: '#8B5CF6' }]}>
                  <SparklesIcon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.categoryInfoTexts}>
                  <Text style={styles.categoryInfoTitle}>Artigos & Publicações Acadêmicas</Text>
                  <Text style={styles.categoryInfoDesc}>
                    Repositório institucional da UnB: workshops, apresentações de TCC e linhas de
                    pesquisa indexadas por departamento.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'ia' && termoLimpo.length > 0 && (
              <View style={styles.categoryInfoBox}>
                <View style={[styles.categoryInfoIconCircle, { backgroundColor: '#EA580C' }]}>
                  <LightningIcon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.categoryInfoTexts}>
                  <Text style={styles.categoryInfoTitle}>Pesquisa Inteligente UnBook IA</Text>
                  <Text style={styles.categoryInfoDesc}>
                    {`Analisando matriz curricular e requisitos para "${termoLimpo}". Sugestão de grade semestral sem choque de horários e com histórico das melhores turmas.`}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ========================================================================= */}
        {/* LINK RODAPÉ INFORMATIVO 'FERRAMENTA DE CAPTURA UNBOOK, COMO FUNCIONA?' */}
        {/* ========================================================================= */}
        <Pressable
          accessibilityRole="link"
          onPress={handleOpenCaptureDocs}
          style={styles.captureInfoRow}
        >
          <Text style={styles.captureInfoText}>
            FERRAMENTA DE CAPTURA UNBOOK,{' '}
            <Text style={styles.captureInfoLink}>COMO FUNCIONA?</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

// =========================================================================
// SUBCOMPONENTES
// =========================================================================

interface TipSlideData {
  id: string;
  dicaNumero: string;
  tagColor: string;
  bgLight: string;
  title: string;
  description: string;
  chips?: { label: string; query: string; tab?: SearchTab }[];
  actionBtn?: { label: string; action: 'filters' };
}

const DICAS_CATALOGO: TipSlideData[] = [
  {
    id: 'dica-1',
    dicaNumero: 'DICA 01',
    tagColor: '#009A5E',
    bgLight: '#F0FDF4',
    title: 'Código Oficial da Matéria',
    description:
      'Digite a sigla e o código da matéria (ex: IFD0071, MAT0025, CIC0004) para abrir ementa, créditos e turmas abertas.',
    chips: [
      { label: 'IFD0071', query: 'IFD0071', tab: 'disciplinas' },
      { label: 'MAT0025', query: 'MAT0025', tab: 'disciplinas' },
      { label: 'CIC0004', query: 'CIC0004', tab: 'disciplinas' },
      { label: 'Cálculo 1', query: 'Cálculo 1', tab: 'disciplinas' },
    ],
  },
  {
    id: 'dica-2',
    dicaNumero: 'DICA 02',
    tagColor: '#1349EB',
    bgLight: '#EFF6FF',
    title: 'Docentes & Turmas Lecionadas',
    description:
      'Alterne para a aba Docentes ou busque o nome do professor para consultar e-mail institucional, SIAPE, Lattes e turmas que leciona.',
    chips: [
      { label: 'Charles Xavier', query: 'Charles Xavier', tab: 'docentes' },
      { label: 'Filtrar Docentes', query: '', tab: 'docentes' },
    ],
  },
  {
    id: 'dica-3',
    dicaNumero: 'DICA 03',
    tagColor: '#854D0E',
    bgLight: '#FEFCE8',
    title: 'Horários, Salas & Filtros',
    description:
      'Identifique locais no Darcy Ribeiro (ICC, PAT, BSA) ou FGA/FCE/FUP, ou abra Filtros para restringir por departamento.',
    actionBtn: { label: 'ABRIR FILTROS →', action: 'filters' },
  },
  {
    id: 'dica-4',
    dicaNumero: 'DICA 04',
    tagColor: '#7C3AED',
    bgLight: '#FAF5FF',
    title: 'Pesquisa Inteligente & Grade',
    description:
      'Consulte a IA ou o simulador semanal para identificar choques de horários e organizar sua grade semestral da UnB.',
    chips: [
      { label: 'Pesquisa Inteligente', query: '', tab: 'ia' },
      { label: 'Física 1', query: 'Física 1', tab: 'disciplinas' },
    ],
  },
];

interface SearchTipsBoxProps {
  activeTab: SearchTab;
  isMobile: boolean;
  onOpenFilters: () => void;
  onSelectQuery: (query: string, tab?: SearchTab) => void;
}

function SearchTipsBox({
  isMobile,
  onOpenFilters,
  onSelectQuery,
}: SearchTipsBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideAnim] = useState(() => new Animated.Value(0));

  // Auto-play que desliza o card a cada 5 segundos
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DICAS_CATALOGO.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Animação horizontal para deslizar o card para o lado
  useEffect(() => {
    if (containerWidth > 0) {
      Animated.timing(slideAnim, {
        toValue: -currentIndex * containerWidth,
        duration: 380,
        useNativeDriver: false,
      }).start();
    }
  }, [currentIndex, containerWidth, slideAnim]);

  const slideAnterior = () => {
    setCurrentIndex((prev) => (prev - 1 + DICAS_CATALOGO.length) % DICAS_CATALOGO.length);
  };

  const proximoSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % DICAS_CATALOGO.length);
  };

  const irParaSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <View
      style={styles.tipsSingleCardContainer}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0 && w !== containerWidth) {
          setContainerWidth(w);
          slideAnim.setValue(-currentIndex * w);
        }
      }}
      {...(Platform.OS === 'web'
        ? ({
            onMouseEnter: () => setIsPaused(true),
            onMouseLeave: () => setIsPaused(false),
          } as any)
        : {})}
    >
      <Animated.View
        style={[
          styles.tipsTrack,
          {
            transform: [{ translateX: slideAnim }],
            width: containerWidth > 0 ? containerWidth * DICAS_CATALOGO.length : `${DICAS_CATALOGO.length * 100}%`,
          },
        ]}
      >
        {DICAS_CATALOGO.map((tip) => {
          return (
            <View
              key={tip.id}
              style={[
                styles.tipSlideItem,
                {
                  width: containerWidth > 0 ? containerWidth : '100%',
                  backgroundColor: tip.bgLight,
                },
              ]}
            >
              {/* Linha Superior: Tag DICA, Título e Controles de Deslizar */}
              <View style={styles.tipSlideHeader}>
                <View style={styles.tipSlideHeaderLeft}>
                  <View style={[styles.tipSlideBadge, { backgroundColor: tip.tagColor }]}>
                    <TipBulbIcon size={12} color="#FFFFFF" />
                    <Text style={styles.tipSlideBadgeText}>{tip.dicaNumero}</Text>
                  </View>
                  <Text style={styles.tipSlideTitle} numberOfLines={1}>
                    {tip.title}
                  </Text>
                </View>

                {/* Controles de navegação (dots, contador e setas) */}
                <View style={styles.tipSlideHeaderRight}>
                  {/* Dots de navegação */}
                  <View style={styles.tipDotsRow}>
                    {DICAS_CATALOGO.map((_, dotIdx) => (
                      <Pressable
                        key={dotIdx}
                        onPress={() => irParaSlide(dotIdx)}
                        style={[
                          styles.tipDot,
                          dotIdx === currentIndex && [
                            styles.tipDotActive,
                            { backgroundColor: tip.tagColor },
                          ],
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Ir para dica ${dotIdx + 1}`}
                      />
                    ))}
                  </View>

                  {/* Contador 1/4 */}
                  <Text style={styles.tipCounterText}>
                    {currentIndex + 1}/{DICAS_CATALOGO.length}
                  </Text>

                  {/* Botões de avançar/voltar */}
                  <View style={styles.tipNavButtonsRow}>
                    <Pressable
                      onPress={slideAnterior}
                      style={({ pressed }) => [
                        styles.tipNavBtn,
                        pressed && styles.tipNavBtnPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Dica anterior"
                    >
                      <ChevronLeftIcon size={12} color="#1F1F1F" />
                    </Pressable>
                    <Pressable
                      onPress={proximoSlide}
                      style={({ pressed }) => [
                        styles.tipNavBtn,
                        pressed && styles.tipNavBtnPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel="Próxima dica"
                    >
                      <ChevronRightIcon size={12} color="#1F1F1F" />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Descrição da Dica */}
              <Text style={styles.tipSlideDesc}>{tip.description}</Text>

              {/* Chips e Ações */}
              <View style={styles.tipSlideFooter}>
                {tip.chips && (
                  <View style={styles.tipChipsRow}>
                    {tip.chips.map((chip, cIdx) => (
                      <Pressable
                        key={cIdx}
                        onPress={() => onSelectQuery(chip.query, chip.tab)}
                        style={({ pressed }) => [
                          styles.tipChip,
                          pressed && styles.tipChipPressed,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Buscar ${chip.label}`}
                      >
                        <Text style={styles.tipChipText}>{chip.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}

                {tip.actionBtn && (
                  <Pressable
                    onPress={onOpenFilters}
                    style={({ pressed }) => [
                      styles.tipChipHighlight,
                      pressed && styles.tipChipPressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir filtros de departamento"
                  >
                    <Text style={styles.tipChipHighlightText}>{tip.actionBtn.label}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

function ItemMateriaCard({
  materia,
  onPress,
}: {
  materia: MateriaResumo;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.materiaCard,
        hovered && styles.materiaCardHovered,
        pressed && styles.materiaCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${materia.codigo_materia} - ${materia.nome}`}
    >
      <View style={styles.materiaCodeBadge}>
        <Text style={styles.materiaCodeText}>{materia.codigo_materia}</Text>
      </View>

      <View style={styles.materiaDetailsCol}>
        <Text style={styles.materiaNomeText}>{materia.nome}</Text>
        {materia.departamento && (
          <Text style={styles.materiaDeptText}>{materia.departamento.nome}</Text>
        )}
      </View>

      <View style={styles.materiaActionCol}>
        <Text style={styles.materiaVerText}>VER EMENTA →</Text>
      </View>
    </Pressable>
  );
}

function ItemProfessorCard({
  professor,
  onPress,
}: {
  professor: ProfessorListItem;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const temFoto = Boolean(professor.url_foto) && !imgError;
  const iniciais = professor.nome_completo
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.materiaCard,
        hovered && styles.materiaCardHovered,
        pressed && styles.materiaCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Ver perfil do docente ${professor.nome_completo}`}
    >
      <View style={styles.profCardAvatar}>
        {temFoto ? (
          <Image
            source={{ uri: professor.url_foto! }}
            style={styles.profCardAvatarImg}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.profCardAvatarFallback}>
            <Text style={styles.profCardAvatarInitials}>{iniciais || 'DOC'}</Text>
          </View>
        )}
      </View>

      <View style={styles.materiaDetailsCol}>
        <Text style={styles.materiaNomeText} numberOfLines={1}>
          {professor.nome_completo}
        </Text>

        {professor.departamento && (
          <Text style={styles.materiaDeptText} numberOfLines={1}>
            {professor.departamento.nome} ({professor.departamento.codigo})
          </Text>
        )}

        <View style={styles.profCardMetaRow}>
          {professor.total_turmas > 0 && (
            <View style={styles.profTurmasBadge}>
              <Text style={styles.profTurmasBadgeText}>
                {professor.total_turmas} {professor.total_turmas === 1 ? 'TURMA' : 'TURMAS'}
              </Text>
            </View>
          )}
          {professor.email_institucional && (
            <View style={styles.profEmailWrapper}>
              <MailIcon size={12} color="#6B7280" />
              <Text style={styles.profEmailText} numberOfLines={1}>
                {professor.email_institucional}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.materiaActionCol}>
        <View style={styles.profVerBtn}>
          <Text style={styles.profVerText}>VER PERFIL →</Text>
        </View>
      </View>
    </Pressable>
  );
}

interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  onMudar: (pagina: number) => void;
}

function Paginacao({ pagina, totalPaginas, onMudar }: PaginacaoProps) {
  return (
    <View style={styles.paginacao}>
      <Pressable
        onPress={() => onMudar(pagina - 1)}
        disabled={pagina <= 1}
        style={[styles.botaoPagina, pagina <= 1 && styles.botaoPaginaDesabilitado]}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotaoPagina}>← ANTERIOR</Text>
      </Pressable>

      <Text style={styles.textoPagina}>
        PÁGINA {pagina} DE {totalPaginas}
      </Text>

      <Pressable
        onPress={() => onMudar(pagina + 1)}
        disabled={pagina >= totalPaginas}
        style={[styles.botaoPagina, pagina >= totalPaginas && styles.botaoPaginaDesabilitado]}
        accessibilityRole="button"
      >
        <Text style={styles.textoBotaoPagina}>PRÓXIMA →</Text>
      </Pressable>
    </View>
  );
}

// =========================================================================
// ESTILOS NEO-BRUTALISTAS
// =========================================================================

const styles = StyleSheet.create({
  sectionWrapper: {
    width: '100%',
    position: 'relative',
    paddingVertical: 72,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...(Platform.OS === 'web'
      ? ({
          scrollMarginTop: '30px',
        } as any)
      : {}),
  },
  centerContainer: {
    width: '100%',
    maxWidth: 960,
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },

  // Tag Superior 'BUSCAR'
  topBadgeWrapper: {
    marginBottom: 16,
  },
  topBadge: {
    backgroundColor: '#009A5E',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 4.5,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  topBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1.2,
  },

  // Título e Subtítulo
  mainTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
    maxWidth: 680,
  },
  mainTitleMobile: {
    fontSize: 24,
    lineHeight: 32,
  },
  mainTitleGreen: {
    color: '#009A5E',
  },
  mainSubtitle: {
    fontSize: 14.5,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 540,
    lineHeight: 22,
    fontWeight: '500',
  },
  mainSubtitleMobile: {
    fontSize: 13,
    marginBottom: 24,
  },

  // Card da Caixa de Pesquisa
  searchBoxCard: {
    width: '100%',
    maxWidth: 820,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4.5, height: 4.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  searchBoxCardMobile: {
    shadowOffset: { width: 3, height: 3 },
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },

  // Área de Input
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  searchIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    padding: 0,
    margin: 0,
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {}),
  },
  clearInputBtn: {
    padding: 4,
  },
  clearInputText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9CA3AF',
  },

  // Toolbar Inferior
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3EBE4', // Fundo bege suave exato da imagem
    borderTopWidth: 1.5,
    borderTopColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 10,
    flexWrap: 'wrap',
  },
  toolbarRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 10,
    paddingVertical: 10,
  },

  // Linha das Abas de Filtro
  filterTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  filterTabsRowMobile: {
    gap: 6,
    justifyContent: 'flex-start',
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.14s ease-in-out',
        } as any)
      : {}),
  },
  filterTabDisciplinasActive: {
    backgroundColor: '#009A5E',
  },
  filterTabDocentesActive: {
    backgroundColor: '#1349EB',
  },
  filterTabArtigosActive: {
    backgroundColor: '#8B5CF6',
  },
  filterTabIaActive: {
    backgroundColor: '#EA580C',
  },
  filterTabInactive: {
    backgroundColor: '#FFFFFF',
  },
  filterTabPressed: {
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(1px, 1px)',
        } as any)
      : {}),
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  filterTabTextInactive: {
    color: '#1F1F1F',
  },

  // Ações da Direita na Toolbar
  toolbarRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'flex-end',
  },
  toolbarRightActionsMobile: {
    justifyContent: 'space-between',
    width: '100%',
  },
  filtrosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.14s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  filtrosButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1F1F1F',
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1px 1px 0px #1F1F1F',
          transform: 'translate(1px, 1px)',
        } as any)
      : {}),
  },
  filtrosButtonPressed: {
    shadowOffset: { width: 0.5, height: 0.5 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px)',
          boxShadow: '0.5px 0.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  filtrosButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.8,
  },
  filtrosArrow: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  filtrosActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#009A5E',
  },
  limparButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  limparButtonPressed: {
    opacity: 0.7,
  },
  limparButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  pesquisarButton: {
    backgroundColor: '#F1C321', // Amarelo vibrante oficial da imagem
    borderWidth: 1.8,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 18,
    paddingVertical: 7,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.14s cubic-bezier(0.34, 1.56, 0.64, 1)',
        } as any)
      : {}),
  },
  pesquisarButtonHovered: {
    backgroundColor: '#F6CD35',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-1.5px)',
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  pesquisarButtonPressed: {
    shadowOffset: { width: 0.5, height: 0.5 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px)',
          boxShadow: '0.5px 0.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  pesquisarButtonText: {
    color: '#1F1F1F',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  // Linha 'PESQUISAS RECENTES' & Toggle de Dicas
  recentSearchesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 820,
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  recentSearchesRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  recentSearchesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  recentSearchesLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  recentPillsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexWrap: 'wrap',
  },
  recentPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'transform 0.12s ease',
        } as any)
      : {}),
  },
  recentPillPressed: {
    backgroundColor: '#FAF9F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'scale(0.97)',
        } as any)
      : {}),
  },
  recentPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  // Botão Toggle Habilitar/Desabilitar Dicas
  toggleDicasBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderWidth: 1.5,
    borderRadius: 2,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
          transition: 'all 0.15s ease',
        } as any)
      : {}),
  },
  toggleDicasBtnAtivo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1F1F1F',
  },
  toggleDicasBtnInativo: {
    backgroundColor: '#F3F4F6',
    borderColor: '#9CA3AF',
    shadowOpacity: 0.4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1px 1px 0px rgba(31,31,31,0.3)',
        } as any)
      : {}),
  },
  toggleDicasBtnPressed: {
    transform: [{ translateY: 1 }],
  },
  toggleDicasTexto: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  toggleDicasTextoAtivo: {
    color: '#1F1F1F',
  },
  toggleDicasTextoInativo: {
    color: '#6B7280',
  },
  toggleDicasSwitch: {
    width: 22,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    paddingHorizontal: 1.5,
  },
  toggleDicasSwitchAtivo: {
    backgroundColor: '#86EFAC',
    borderColor: '#009A5E',
  },
  toggleDicasThumb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
    transform: [{ translateX: 0 }],
  },
  toggleDicasThumbAtivo: {
    backgroundColor: '#009A5E',
    transform: [{ translateX: 9 }],
  },

  // Card Único de Dica Deslizante (Slider / Carousel)
  tipsSingleCardContainer: {
    width: '100%',
    maxWidth: 820,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  tipsTrack: {
    flexDirection: 'row',
  },
  tipSlideItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    minHeight: 125,
  },
  tipSlideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 10,
  },
  tipSlideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  tipSlideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 2,
  },
  tipSlideBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  tipSlideTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  tipSlideHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipDotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  tipDotActive: {
    width: 16,
    borderRadius: 3,
  },
  tipCounterText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  tipNavButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipNavBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  tipNavBtnPressed: {
    transform: [{ translateY: 1 }],
  },
  tipSlideDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 10,
  },
  tipSlideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tipChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  tipChipPressed: {
    transform: [{ translateY: 1 }],
  },
  tipChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  tipChipHighlight: {
    backgroundColor: '#F1C321',
    borderWidth: 1.2,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1.5px 1.5px 0px #1F1F1F',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  tipChipHighlightText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },

  // Link Inferior 'COMO FUNCIONA?'
  captureInfoRow: {
    marginTop: 6,
    marginBottom: 20,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  captureInfoText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.8,
  },
  captureInfoLink: {
    color: '#1F1F1F',
    textDecorationLine: 'underline',
  },

  // Bandeja Dinâmica de Ferramentas (Dentro do Input Card)
  contextToolTray: {
    borderTopWidth: 1.5,
    borderTopColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  toolTrayContent: {
    gap: 8,
  },
  toolTrayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  toolTagBadge: {
    borderRadius: 2,
    borderWidth: 1.2,
    borderColor: '#1F1F1F',
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  toolTagBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  toolTraySubtitle: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '600',
  },
  toolControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  toolControlsRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  deptSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    maxWidth: 320,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  deptSelectorBtnActive: {
    backgroundColor: '#009A5E',
    borderColor: '#1F1F1F',
  },
  deptSelectorBtnPressed: {
    backgroundColor: '#FAF9F5',
  },
  deptSelectorBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1F1F1F',
    flexShrink: 1,
  },
  deptSelectorBtnTextActive: {
    color: '#FFFFFF',
  },
  deptSelectorBtnArrow: {
    fontSize: 9,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  deptClearActionBtn: {
    backgroundColor: '#FAF9F5',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 5,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  deptClearActionText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  quickDeptsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  quickDeptChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          transition: 'all 0.12s ease',
        } as any)
      : {}),
  },
  quickDeptChipPressed: {
    transform: [{ scale: 0.96 }],
  },
  quickDeptChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  quickDeptChipGreenActive: {
    backgroundColor: '#009A5E',
    borderColor: '#1F1F1F',
  },
  quickDeptChipBlueActive: {
    backgroundColor: '#1349EB',
    borderColor: '#1F1F1F',
  },
  quickDeptChipPurpleActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#1F1F1F',
  },
  quickDeptChipOrangeActive: {
    backgroundColor: '#EA580C',
    borderColor: '#1F1F1F',
  },
  quickDeptChipTextActive: {
    color: '#FFFFFF',
  },
  deptFullDropdownWrapper: {
    width: '100%',
    marginTop: 6,
  },
  cardActivePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 2,
    borderWidth: 1.2,
    borderColor: '#1F1F1F',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    zIndex: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardActivePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },

  // Área de Resultados
  resultsArea: {
    width: '100%',
    maxWidth: 820,
    marginTop: 4,
    marginBottom: 24,
  },
  noticeBox: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 12.5,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 3,
    padding: 16,
  },
  errorText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 13.5,
    textAlign: 'center',
  },
  resultsContainer: {
    gap: 12,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 4,
  },
  resultsTotalCount: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  resultsQueryBadge: {
    fontSize: 12,
    color: '#009A5E',
    fontWeight: '800',
  },
  itemsList: {
    gap: 10,
  },
  emptyStateBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    padding: 24,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  emptyStateDesc: {
    fontSize: 12.5,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Card de Resultado de Matéria
  materiaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    padding: 14,
    gap: 14,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          cursor: 'pointer',
          transition: 'all 0.15s ease-in-out',
        } as any)
      : {}),
  },
  materiaCardHovered: {
    backgroundColor: '#FAF9F5',
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translateY(-2px)',
          boxShadow: '4.5px 4.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  materiaCardPressed: {
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    ...(Platform.OS === 'web'
      ? ({
          transform: 'translate(2px, 2px)',
          boxShadow: '1px 1px 0px #1F1F1F',
        } as any)
      : {}),
  },
  materiaCodeBadge: {
    backgroundColor: '#009A5E',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  materiaCodeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  materiaDetailsCol: {
    flex: 1,
  },
  materiaNomeText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 2,
  },
  materiaDeptText: {
    fontSize: 11.5,
    color: '#6B7280',
    fontWeight: '600',
  },
  materiaActionCol: {
    justifyContent: 'center',
  },
  materiaVerText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1349EB',
    letterSpacing: 0.5,
  },

  // Estilos do Card de Professor (Docente)
  profCardAvatar: {
    width: 44,
    height: 44,
    borderRadius: 2,
    borderWidth: 1.8,
    borderColor: '#1F1F1F',
    overflow: 'hidden',
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profCardAvatarImg: {
    width: '100%',
    height: '100%',
  },
  profCardAvatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1349EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profCardAvatarInitials: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  profCardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 3,
  },
  profTurmasBadge: {
    backgroundColor: '#EFECE6',
    borderWidth: 1.2,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 1.5,
  },
  profTurmasBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1F1F1F',
    letterSpacing: 0.3,
  },
  profEmailWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profEmailText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  profVerBtn: {
    backgroundColor: '#1349EB',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  profVerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Paginação
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  textoPagina: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  botaoPagina: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '2px 2px 0px #1F1F1F',
          cursor: 'pointer',
        } as any)
      : {}),
  },
  botaoPaginaDesabilitado: {
    opacity: 0.35,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'default',
        } as any)
      : {}),
  },
  textoBotaoPagina: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },

  // Feedback para Outras Abas (Docentes, Artigos, IA)
  categoryInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 3,
    padding: 16,
    gap: 14,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  categoryInfoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfoTexts: {
    flex: 1,
  },
  categoryInfoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  categoryInfoDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    fontWeight: '500',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { NotebookBackground } from '../../../components/NotebookBackground';

interface ParaOndeVaiDinheiroSectionProps {
  onSelectReitorTicket?: () => void;
}

interface InfraCard {
  id: string;
  tag: string;
  tagBg: string;
  tagTextColor?: string;
  title: string;
  tech: string;
  description: string;
}

const INFRA_CARDS: InfraCard[] = [
  {
    id: 'servidores',
    tag: 'COMPUTAÇÃO',
    tagBg: '#009A5E',
    tagTextColor: '#FFFFFF',
    title: 'Servidores & Containers Docker',
    tech: 'FastAPI • Uvicorn • 2 vCPU • 4GB RAM',
    description:
      'Garante que mais de 12.000 estudantes consigam consultar disciplinas, turmas e históricos simultaneamente sem travamentos nas semanas de matrícula.',
  },
  {
    id: 'database',
    tag: 'PRIVACIDADE',
    tagBg: '#1349EB',
    tagTextColor: '#FFFFFF',
    title: 'Banco de Dados & Criptografia',
    tech: 'PostgreSQL • Hashing com Salt • Backups',
    description:
      'Armazena com isolamento absoluto 8.200+ avaliações e comentários acadêmicos, garantindo que nenhum docente ou mantenedor rastreie quem avaliou.',
  },
  {
    id: 'busca',
    tag: 'VELOCIDADE',
    tagBg: '#F1C321',
    tagTextColor: '#1F1F1F',
    title: 'Engine de Busca Instantânea',
    tech: 'Meilisearch Cluster • Indexação Semântica',
    description:
      'Processa buscas em milissegundos por nome de matéria, código do departamento (ex: MAT0025, CIC0004) ou professor com tolerância a erros.',
  },
  {
    id: 'seguranca',
    tag: 'PROTEÇÃO',
    tagBg: '#FE4141',
    tagTextColor: '#FFFFFF',
    title: 'Domínio unbook.org & SSL',
    tech: 'Cloudflare • CDN Global • Escudo Anti-DDoS',
    description:
      'Protege o portal contra instabilidades, ataques automatizados e viabiliza navegação criptografada de ponta a ponta sem vender dados.',
  },
];

export function ParaOndeVaiDinheiroSection({}: ParaOndeVaiDinheiroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
    <NotebookBackground style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Cabeçalho Limpo e Espaçoso */}
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>TRANSPARÊNCIA FINANCEIRA</Text>
          </View>
          <Text style={styles.title}>
            Para onde vai o seu apoio?
          </Text>
          <Text style={styles.subtitle}>
            O UnBook é um projeto de código aberto mantido por estudantes da UnB para a comunidade discente. Não colocamos anúncios invasivos, não vendemos dados de navegação e aplicamos cada centavo exclusivamente na infraestrutura técnica da plataforma.
          </Text>
        </View>

        {/* Grade de 4 Pilares de Infraestrutura */}
        <View
          style={[
            styles.infraGrid,
            isTablet && styles.infraGridTablet,
            isMobile && styles.infraGridMobile,
          ]}
        >
          {INFRA_CARDS.map((card) => (
            <View key={card.id} style={styles.infraCard}>
              <View style={styles.cardHeaderRow}>
                <View
                  style={[
                    styles.tagBadge,
                    { backgroundColor: card.tagBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagBadgeText,
                      { color: card.tagTextColor || '#FFFFFF' },
                    ]}
                  >
                    {card.tag}
                  </Text>
                </View>
                <Text style={styles.techText}>{card.tech}</Text>
              </View>

              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDesc}>{card.description}</Text>
            </View>
          ))}
        </View>

        {/* Banner de Compromisso Estudantil */}
        <View style={styles.commitmentBanner}>
          <Text style={styles.commitmentTitle}>
            Compromisso Estudantil de Independência
          </Text>
          <Text style={styles.commitmentBody}>
            Nossa prestação de contas é 100% aberta no repositório do GitHub. Qualquer estudante pode auditar a arquitetura do backend, as chamadas de rede e conferir como a plataforma é operada de forma autônoma e sem fins lucrativos.
          </Text>
        </View>
      </View>
    </NotebookBackground>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 72,
    paddingHorizontal: 24,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
    width: '100%',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 44,
    maxWidth: 820,
  },
  badgePill: {
    backgroundColor: '#1F1F1F',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 14,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 25,
  },
  infraGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 36,
  },
  infraGridTablet: {
    flexWrap: 'wrap',
  },
  infraGridMobile: {
    flexDirection: 'column',
  },
  infraCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 22,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  tagBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  techText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#707070',
    letterSpacing: 0.2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 10,
    lineHeight: 22,
  },
  cardDesc: {
    fontSize: 12.5,
    color: '#4A4A4A',
    lineHeight: 19,
  },
  commitmentBanner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
        } as any)
      : {}),
  },
  commitmentTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  commitmentBody: {
    fontSize: 13.5,
    color: '#4A4A4A',
    lineHeight: 22,
  },
});

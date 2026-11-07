import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';

interface TermometroMetaSectionProps {
  onPressDoar?: () => void;
}

interface MetaCusto {
  id: string;
  item: string;
  valor: string;
  percentual: number;
  tag: string;
  tagColor: string;
  tagTextColor?: string;
  desc: string;
}

const META_TOTAL = 450;
const VALOR_ARRECADADO = 315;
const PERCENTUAL_TOTAL = Math.round((VALOR_ARRECADADO / META_TOTAL) * 100); // 70%

const CUSTOS_INFRA: MetaCusto[] = [
  {
    id: 'servidor',
    item: 'Servidor Backend (FastAPI & Docker)',
    valor: 'R$ 180,00',
    percentual: 40,
    tag: 'ESSENCIAL',
    tagColor: '#009A5E',
    tagTextColor: '#FFFFFF',
    desc: 'Instância em nuvem (2 vCPU, 4GB RAM) para atender mais de 12.000 estudantes sem lentidão.',
  },
  {
    id: 'database',
    item: 'Banco de Dados & Criptografia',
    valor: 'R$ 140,00',
    percentual: 31,
    tag: 'PRIVACIDADE',
    tagColor: '#1349EB',
    tagTextColor: '#FFFFFF',
    desc: 'PostgreSQL isolado com hashing irreversible de e-mails para proteção de 8.200+ avaliações.',
  },
  {
    id: 'busca',
    item: 'Engine de Busca Meilisearch',
    valor: 'R$ 80,00',
    percentual: 18,
    tag: 'VELOCIDADE',
    tagColor: '#F1C321',
    tagTextColor: '#1F1F1F',
    desc: 'Indexação rápida de matérias, turmas e professores com tolerância a erros ortográficos.',
  },
  {
    id: 'dominio',
    item: 'Domínio unbook.org & SSL Cloudflare',
    valor: 'R$ 50,00',
    percentual: 11,
    tag: 'SEGURANÇA',
    tagColor: '#FE4141',
    tagTextColor: '#FFFFFF',
    desc: 'Certificados de segurança TLS, proteção anti-DDoS e CDN de carregamento rápido.',
  },
];

export function TermometroMetaSection({ onPressDoar }: TermometroMetaSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const faltam = META_TOTAL - VALOR_ARRECADADO;

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>METAS & PRESTAÇÃO DE CONTAS</Text>
          </View>
          <Text style={styles.title}>
            Termômetro da Infraestrutura
          </Text>
          <Text style={styles.subtitle}>
            Acompanhe o progresso da arrecadação mensal necessária para manter os servidores, o banco de dados e as buscas ativas durante todo o semestre.
          </Text>
        </View>

        {/* Card Principal do Termômetro */}
        <View style={styles.thermometerCard}>
          {/* Estatísticas em Destaque */}
          <View style={[styles.statsRow, isMobile && styles.statsRowMobile]}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>META DO MÊS</Text>
              <Text style={styles.statValue}>R$ {META_TOTAL},00</Text>
              <Text style={styles.statSub}>Custo real de nuvem</Text>
            </View>

            <View style={[styles.statBox, styles.statBoxArrecadado]}>
              <Text style={styles.statLabel}>ARRECADADO NO MÊS</Text>
              <Text style={[styles.statValue, { color: '#009A5E' }]}>
                R$ {VALOR_ARRECADADO},00
              </Text>
              <View style={styles.percentBadge}>
                <Text style={styles.percentBadgeText}>{PERCENTUAL_TOTAL}% COBERTO</Text>
              </View>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>RESTANTE</Text>
              <Text style={[styles.statValue, { color: '#FE4141' }]}>
                R$ {faltam},00
              </Text>
              <Text style={styles.statSub}>Para fechar a fatura</Text>
            </View>
          </View>

          {/* Barra de Progresso / Termômetro */}
          <View style={styles.gaugeBox}>
            <View style={styles.gaugeHeaderRow}>
              <Text style={styles.gaugeStatusText}>
                Status Atual: <Text style={{ fontWeight: '900' }}>70% COBERTO</Text> • Faltam R$ {faltam},00
              </Text>
              <Text style={styles.gaugeTargetText}>Objetivo: R$ {META_TOTAL},00/mês</Text>
            </View>

            {/* Barra Visual */}
            <View style={styles.gaugeTrack}>
              <View style={[styles.gaugeFill, { width: `${PERCENTUAL_TOTAL}%` }]} />
            </View>

            {/* Marcadores de Graduação */}
            <View style={styles.ticksRow}>
              <Text style={styles.tickText}>R$ 0</Text>
              <Text style={styles.tickText}>R$ 112 (25%)</Text>
              <Text style={styles.tickText}>R$ 225 (50%)</Text>
              <Text style={styles.tickText}>R$ 337 (75%)</Text>
              <Text style={[styles.tickText, { fontWeight: '900' }]}>R$ 450 (100%)</Text>
            </View>
          </View>

          {/* Chamada para Ação */}
          <View style={styles.ctaRow}>
            <View style={styles.ctaTextCol}>
              <Text style={styles.ctaHeading}>Ajude a garantir os servidores deste mês</Text>
              <Text style={styles.ctaParagraph}>
                Cada vale de R$ 4,50 financia um dia inteiro de consultas de matérias e avaliações no ar.
              </Text>
            </View>

            {onPressDoar && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Apoiar com R$ 4,50 via PIX"
                onPress={onPressDoar}
                style={({ pressed }) => [
                  styles.ctaButton,
                  pressed && styles.ctaButtonPressed,
                ]}
              >
                <Text style={styles.ctaButtonText}>APOIAR COM R$ 4,50 →</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Detalhamento dos 4 Custos Operacionais */}
        <View style={styles.breakdownHeader}>
          <Text style={styles.breakdownHeading}>DETALHAMENTO DOS CUSTOS MENSAIS</Text>
          <Text style={styles.breakdownSub}>
            Divisão transparente de cada item da infraestrutura técnica
          </Text>
        </View>

        <View
          style={[
            styles.costGrid,
            isTablet && styles.costGridTablet,
            isMobile && styles.costGridMobile,
          ]}
        >
          {CUSTOS_INFRA.map((custo) => {
            const isHovered = hoveredCard === custo.id;
            return (
              <View
                key={custo.id}
                style={[
                  styles.costCard,
                  isHovered && styles.costCardHovered,
                ]}
                // @ts-ignore
                onMouseEnter={() => setHoveredCard(custo.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredCard(null)}
              >
                <View style={styles.costCardTop}>
                  <View
                    style={[
                      styles.costTag,
                      { backgroundColor: custo.tagColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.costTagText,
                        { color: custo.tagTextColor || '#FFFFFF' },
                      ]}
                    >
                      {custo.tag}
                    </Text>
                  </View>
                  <Text style={styles.costAmount}>{custo.valor}/mês</Text>
                </View>

                <Text style={styles.costName}>{custo.item}</Text>
                <Text style={styles.costDesc}>{custo.desc}</Text>

                <View style={styles.costBottom}>
                  <Text style={styles.percentText}>{custo.percentual}% do orçamento</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
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
    maxWidth: 800,
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
  thermometerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 28,
    marginBottom: 48,
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
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 28,
  },
  statsRowMobile: {
    flexDirection: 'column',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 18,
  },
  statBoxArrecadado: {
    backgroundColor: '#EBF8F2',
    borderColor: '#009A5E',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#707070',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  statSub: {
    fontSize: 12,
    color: '#666666',
  },
  percentBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#009A5E',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  percentBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#009A5E',
    letterSpacing: 0.5,
  },
  gaugeBox: {
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  gaugeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  gaugeStatusText: {
    fontSize: 13,
    color: '#1F1F1F',
  },
  gaugeTargetText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#707070',
  },
  gaugeTrack: {
    height: 24,
    backgroundColor: '#E8E2D5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: '#009A5E',
    borderRadius: 10,
  },
  ticksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  tickText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#707070',
  },
  ctaRow: {
    backgroundColor: '#FAF9F5',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  ctaTextCol: {
    flex: 1,
    minWidth: 260,
  },
  ctaHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
  },
  ctaParagraph: {
    fontSize: 12.5,
    color: '#666666',
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: '#009A5E',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        } as any)
      : {}),
  },
  ctaButtonPressed: {
    transform: [{ translateY: 2 }],
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  breakdownHeader: {
    marginBottom: 20,
  },
  breakdownHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  breakdownSub: {
    fontSize: 13,
    color: '#707070',
  },
  costGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  costGridTablet: {
    flexWrap: 'wrap',
  },
  costGridMobile: {
    flexDirection: 'column',
  },
  costCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        } as any)
      : {}),
  },
  costCardHovered: {
    transform: [{ translateY: -3 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  costCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  costTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  costTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  costAmount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  costName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 6,
    lineHeight: 19,
  },
  costDesc: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 14,
  },
  costBottom: {
    borderTopWidth: 1.5,
    borderColor: '#EFEDE1',
    paddingTop: 8,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#707070',
  },
});

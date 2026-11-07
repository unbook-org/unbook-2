import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  FONTE_MANUSCRITA,
  MosaicoBackground,
  Migalha,
  Pacoca,
} from '../../../components/vida-universitaria';

interface MilestoneItem {
  year: string;
  phase: string;
  nodeLabel: string;
  nodeBg: string;
  nodeTextColor: string;
  title: string;
  annotation: string;
  description: string;
  tag: string;
  campus: string;
  sideTip: string;
  sideTipAuthor: string;
  tapeColor: string;
}

const MILESTONES: MilestoneItem[] = [
  {
    year: '2022',
    phase: 'FASE 01 • GÊNESE',
    nodeLabel: '2022',
    nodeBg: '#F1C321',
    nodeTextColor: '#1F1F1F',
    title: 'A Planilha no WhatsApp',
    annotation: 'a salvação de quem pegava APC e Cálculo 1',
    description:
      'Um grupo de calouros e veteranos do Darcy Ribeiro começou a circular uma planilha no Google Drive para avaliar didática de professores e compartilhar relatos de turmas. O link viralizou nos grupos de WhatsApp dos cursos.',
    tag: '+50 turmas catalogadas no Drive',
    campus: 'Darcy Ribeiro • ICC Norte',
    sideTip: 'Quem nunca conferiu a planilha antes do período de ajuste de matrícula no SIGAA não viveu o Darcy!',
    sideTipAuthor: '— Calouro de 2022',
    tapeColor: '#F1C321',
  },
  {
    year: '2023',
    phase: 'FASE 02 • COMUNIDADE',
    nodeLabel: '2023',
    nodeBg: '#009A5E',
    nodeTextColor: '#FFFFFF',
    title: 'Formulário Aberto & Provas',
    annotation: '+1.500 relatos sinceros enviados sem censura',
    description:
      'A planilha não suportava mais o volume de acessos simultâneos. Alunos voluntários criaram formulários estruturados, compilando avaliações anônimas, macetes de sobrevivência acadêmica e resumos do ICC e BCE.',
    tag: '1.000+ estudantes colaborando',
    campus: 'BCE & Centros Acadêmicos',
    sideTip: 'A comunidade enviou provas antigas, critérios reais de menção e dicas sinceras de quem fez a matéria.',
    sideTipAuthor: '— Relato colaborativo',
    tapeColor: '#009A5E',
  },
  {
    year: '2024',
    phase: 'FASE 03 • EXPANSÃO',
    nodeLabel: '2024',
    nodeBg: '#FE4141',
    nodeTextColor: '#FFFFFF',
    title: 'Darcy, FGA, FCE e FAL Unidos',
    annotation: 'porque a UnB não termina no Plano Piloto',
    description:
      'O UnBook expandiu oficialmente para todos os quatro campi da Universidade de Brasília: Gama (Engenharias), Ceilândia (Saúde) e Planaltina (FAL), abraçando as particularidades e o dia a dia de cada unidade.',
    tag: '4 Campi Unificados',
    campus: 'Darcy • FGA • FCE • FAL',
    sideTip: 'Horários do Intercampi e macetes do RU de cada unidade finalmente reunidos no mesmo lugar.',
    sideTipAuthor: '— Coletivo FGA / FCE',
    tapeColor: '#FE4141',
  },
  {
    year: '2025/26',
    phase: 'FASE 04 • ECOSSISTEMA',
    nodeLabel: '2.0',
    nodeBg: '#1349EB',
    nodeTextColor: '#FFFFFF',
    title: 'UnBook 2.0 • Código Aberto & Seguro',
    annotation: '100% aberto, independente e discente',
    description:
      'Reconstrução completa da plataforma com arquitetura moderna, anonimato criptográfico para avaliações sinceras, busca rápida de disciplinas e governança discente comunitária no GitHub.',
    tag: 'Versão Atual • Plataforma Aberta',
    campus: 'Toda a Comunidade UnB',
    sideTip: 'Feito para durar: nenhum dado vendido, nenhum anúncio invasivo. 100% patrimônio discente.',
    sideTipAuthor: '— Equipe UnBook',
    tapeColor: '#1349EB',
  },
];

export function ManifestoSection() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <MosaicoBackground
      overlayOpacity={0.88}
      overlayColor="#FAF9F5"
      style={styles.sectionWrapper}
    >
      <View style={styles.container}>
        {/* Cabeçalho da Seção de Linha do Tempo */}
        <View style={styles.header}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>HISTÓRIA & TRAJETÓRIA</Text>
            </View>
          </View>
          <Text style={styles.mainTitle}>Linha do Tempo do UnBook</Text>
          <Text style={styles.subtitle}>
            De uma planilha compartilhada no WhatsApp até a maior plataforma acadêmica independente da UnB
          </Text>
          <Text style={styles.handwrittenTag}>
            "de alunos para alunos • sem fins lucrativos desde 2022"
          </Text>
        </View>

        {/* Linha do Tempo */}
        <View style={styles.timelineContainer}>
          {/* Espinha dorsal da Linha do Tempo */}
          <View style={isMobile ? styles.spineLineMobile : styles.spineLine} />

          {MILESTONES.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isEven = idx % 2 === 0;

            if (isMobile) {
              return (
                <View key={item.year} style={styles.timelineRowMobile}>
                  {/* Nó do Ano sobre a linha */}
                  <View
                    style={[
                      styles.spineNodeMobile,
                      { backgroundColor: item.nodeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.spineNodeTextMobile,
                        { color: item.nodeTextColor },
                      ]}
                    >
                      {item.nodeLabel}
                    </Text>
                  </View>

                  {/* Card do Marco */}
                  <View style={styles.mobileCardWrapper}>
                    <View
                      // @ts-ignore
                      onMouseEnter={() => setHoveredIdx(idx)}
                      // @ts-ignore
                      onMouseLeave={() => setHoveredIdx(null)}
                      style={[
                        styles.milestoneCard,
                        isHovered && styles.milestoneCardHovered,
                      ]}
                    >
                      {/* Topo do Card */}
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.phaseBadge,
                            { backgroundColor: item.nodeBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.phaseBadgeText,
                              { color: item.nodeTextColor },
                            ]}
                          >
                            {item.phase}
                          </Text>
                        </View>
                        <Text style={styles.cardYearText}>{item.year}</Text>
                      </View>

                      {/* Título & Anotação */}
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View style={styles.annotationBox}>
                        <Text style={styles.annotationText}>{item.annotation}</Text>
                      </View>

                      {/* Descrição */}
                      <Text style={styles.cardDesc}>{item.description}</Text>

                      {/* Rodapé do Card */}
                      <View style={styles.cardFooter}>
                        <View style={styles.campusTag}>
                          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                              stroke="#707070"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                              stroke="#707070"
                              strokeWidth="2"
                            />
                          </Svg>
                          <Text style={styles.campusTagText}>{item.campus}</Text>
                        </View>
                        <View style={styles.metricPill}>
                          <Text style={styles.metricPillText}>{item.tag}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }

            // Desktop: Layout alternado Esquerda / Direita
            return (
              <View key={item.year} style={styles.timelineRowDesktop}>
                {/* Lado Esquerdo */}
                <View style={styles.desktopColLeft}>
                  {isEven ? (
                    <View
                      // @ts-ignore
                      onMouseEnter={() => setHoveredIdx(idx)}
                      // @ts-ignore
                      onMouseLeave={() => setHoveredIdx(null)}
                      style={[
                        styles.milestoneCard,
                        isHovered && styles.milestoneCardHovered,
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.phaseBadge,
                            { backgroundColor: item.nodeBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.phaseBadgeText,
                              { color: item.nodeTextColor },
                            ]}
                          >
                            {item.phase}
                          </Text>
                        </View>
                        <Text style={styles.cardYearText}>{item.year}</Text>
                      </View>

                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View style={styles.annotationBox}>
                        <Text style={styles.annotationText}>{item.annotation}</Text>
                      </View>
                      <Text style={styles.cardDesc}>{item.description}</Text>

                      <View style={styles.cardFooter}>
                        <View style={styles.campusTag}>
                          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                              stroke="#707070"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                              stroke="#707070"
                              strokeWidth="2"
                            />
                          </Svg>
                          <Text style={styles.campusTagText}>{item.campus}</Text>
                        </View>
                        <View style={styles.metricPill}>
                          <Text style={styles.metricPillText}>{item.tag}</Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.sideNoteWrapper}>
                      <View
                        style={[
                          styles.tapeStrip,
                          { backgroundColor: item.tapeColor },
                        ]}
                      />
                      <Text style={styles.sideNoteText}>"{item.sideTip}"</Text>
                      <Text style={styles.sideNoteAuthor}>{item.sideTipAuthor}</Text>
                    </View>
                  )}
                </View>

                {/* Nó Central na Espinha */}
                <View style={styles.desktopColCenter}>
                  <View
                    style={[
                      styles.spineNodeDesktop,
                      { backgroundColor: item.nodeBg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.spineNodeTextDesktop,
                        { color: item.nodeTextColor },
                      ]}
                    >
                      {item.nodeLabel}
                    </Text>
                  </View>
                </View>

                {/* Lado Direito */}
                <View style={styles.desktopColRight}>
                  {!isEven ? (
                    <View
                      // @ts-ignore
                      onMouseEnter={() => setHoveredIdx(idx)}
                      // @ts-ignore
                      onMouseLeave={() => setHoveredIdx(null)}
                      style={[
                        styles.milestoneCard,
                        isHovered && styles.milestoneCardHovered,
                      ]}
                    >
                      <View style={styles.cardHeader}>
                        <View
                          style={[
                            styles.phaseBadge,
                            { backgroundColor: item.nodeBg },
                          ]}
                        >
                          <Text
                            style={[
                              styles.phaseBadgeText,
                              { color: item.nodeTextColor },
                            ]}
                          >
                            {item.phase}
                          </Text>
                        </View>
                        <Text style={styles.cardYearText}>{item.year}</Text>
                      </View>

                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <View style={styles.annotationBox}>
                        <Text style={styles.annotationText}>{item.annotation}</Text>
                      </View>
                      <Text style={styles.cardDesc}>{item.description}</Text>

                      <View style={styles.cardFooter}>
                        <View style={styles.campusTag}>
                          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                              stroke="#707070"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                              stroke="#707070"
                              strokeWidth="2"
                            />
                          </Svg>
                          <Text style={styles.campusTagText}>{item.campus}</Text>
                        </View>
                        <View style={styles.metricPill}>
                          <Text style={styles.metricPillText}>{item.tag}</Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.sideNoteWrapper}>
                      <View
                        style={[
                          styles.tapeStrip,
                          { backgroundColor: item.tapeColor },
                        ]}
                      />
                      <Text style={styles.sideNoteText}>"{item.sideTip}"</Text>
                      <Text style={styles.sideNoteAuthor}>{item.sideTipAuthor}</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Rodapé / Declaração Discente com Mascote */}
        <View style={styles.manifestoCallout}>
          <View style={styles.mascoteWrapper}>
            <Migalha pose="pao" size={58} />
          </View>
          <View style={styles.calloutContent}>
            <View style={styles.calloutBadge}>
              <Text style={styles.calloutBadgeText}>PATRIMÔNIO DISCENTE DA UNB</Text>
            </View>
            <Text style={styles.calloutText}>
              "O UnBook foi criado por quem enfrenta as filas do RU, estuda nos subsolos do ICC e passa noites programando ou terminando relatório de laboratório. O projeto é e sempre será 100% gratuito e mantido por estudantes para estudantes."
            </Text>
            <Text style={styles.calloutSignature}>
              — Coletivo de Estudantes Voluntários da UnB
            </Text>
          </View>
          <View style={styles.pacocaWrapper}>
            <Pacoca pose="sentado" size={54} />
          </View>
        </View>
      </View>
    </MosaicoBackground>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1120,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  badgeRow: {
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  categoryBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 22,
    marginBottom: 10,
  },
  handwrittenTag: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 20,
    color: '#009A5E',
    transform: [{ rotate: '-1.5deg' }],
    textAlign: 'center',
  },
  timelineContainer: {
    position: 'relative',
    marginBottom: 48,
  },
  spineLine: {
    position: 'absolute',
    top: 24,
    bottom: 24,
    left: '50%',
    width: 4,
    marginLeft: -2,
    backgroundColor: '#1F1F1F',
    zIndex: 1,
    borderRadius: 2,
  },
  spineLineMobile: {
    position: 'absolute',
    top: 20,
    bottom: 20,
    left: 20,
    width: 4,
    backgroundColor: '#1F1F1F',
    zIndex: 1,
    borderRadius: 2,
  },
  timelineRowMobile: {
    flexDirection: 'row',
    marginBottom: 32,
    alignItems: 'flex-start',
    position: 'relative',
  },
  spineNodeMobile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  spineNodeTextMobile: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  mobileCardWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  timelineRowDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  desktopColLeft: {
    flex: 1,
    paddingRight: 32,
    alignItems: 'flex-end',
  },
  desktopColCenter: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  desktopColRight: {
    flex: 1,
    paddingLeft: 32,
    alignItems: 'flex-start',
  },
  spineNodeDesktop: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3px 3px 0px #1F1F1F',
        } as any)
      : {}),
  },
  spineNodeTextDesktop: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  milestoneCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 22,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '4px 4px 0px #1F1F1F',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        } as any)
      : {}),
  },
  milestoneCardHovered: {
    transform: [{ translateY: -3 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '6px 6px 0px #1F1F1F',
        } as any)
      : {}),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
  },
  phaseBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardYearText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: -0.4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  annotationBox: {
    backgroundColor: '#FCFAEC',
    borderLeftWidth: 3,
    borderLeftColor: '#F1C321',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 12,
  },
  annotationText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 15,
    color: '#1F1F1F',
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderColor: '#EFECE1',
    paddingTop: 10,
  },
  campusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  campusTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
  },
  metricPill: {
    backgroundColor: '#FAF9F5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D4CEBC',
  },
  metricPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1F1F1F',
  },
  sideNoteWrapper: {
    maxWidth: 320,
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 10,
    padding: 16,
    paddingTop: 22,
    position: 'relative',
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
  tapeStrip: {
    position: 'absolute',
    top: -9,
    alignSelf: 'center',
    width: 68,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 2,
    opacity: 0.9,
    transform: [{ rotate: '-2deg' }],
  },
  sideNoteText: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 16,
    color: '#1F1F1F',
    lineHeight: 21,
    marginBottom: 6,
  },
  sideNoteAuthor: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#707070',
    textAlign: 'right',
  },
  manifestoCallout: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 14,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  mascoteWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pacocaWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutContent: {
    flex: 1,
  },
  calloutBadge: {
    backgroundColor: '#009A5E',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    marginBottom: 8,
  },
  calloutBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  calloutText: {
    fontSize: 13.5,
    color: '#1F1F1F',
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 6,
  },
  calloutSignature: {
    fontFamily: FONTE_MANUSCRITA,
    fontSize: 16,
    color: '#707070',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  IconeTerminal,
  IconeGrafico,
  IconeDesign,
  IconeMegafone,
} from '../../../components/UnbookIcons';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  avatarTextColor?: string;
  github?: string;
  linkedin?: string;
}

interface Department {
  id: string;
  label: string;
  bannerTitle: string;
  bannerBg: string;
  bannerTextColor: string;
  iconComponent: (color: string) => React.ReactNode;
  members: TeamMember[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'software',
    label: 'ENGENHARIA DE SOFTWARE',
    bannerTitle: 'ENGENHARIA DE SOFTWARE & ARQUITETURA CORE',
    bannerBg: '#1349EB',
    bannerTextColor: '#FFFFFF',
    iconComponent: (color) => <IconeTerminal size={20} color={color} />,
    members: [
      {
        id: '1',
        name: 'Lucas Ferreira',
        role: 'Eng. de Software • 4º sem.',
        initials: 'LF',
        avatarBg: '#1349EB',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '2',
        name: 'Ana Rodrigues',
        role: 'Full-stack • 8º sem.',
        initials: 'AR',
        avatarBg: '#F1C321',
        avatarTextColor: '#1F1F1F',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '3',
        name: 'Pedro Alves',
        role: 'Backend • 4º sem.',
        initials: 'PA',
        avatarBg: '#009A5E',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '4',
        name: 'Mariana Lima',
        role: 'Arquitetura • 7º sem.',
        initials: 'ML',
        avatarBg: '#FE4141',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
  {
    id: 'dados',
    label: 'DADOS & PIPELINES',
    bannerTitle: 'ENGENHARIA DE DADOS & INTELIGÊNCIA ACADÊMICA',
    bannerBg: '#009A5E',
    bannerTextColor: '#FFFFFF',
    iconComponent: (color) => <IconeGrafico size={20} color={color} />,
    members: [
      {
        id: '5',
        name: 'Rafael Costa',
        role: 'Data Pipeline • 6º sem.',
        initials: 'RC',
        avatarBg: '#009A5E',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '6',
        name: 'Camila Santos',
        role: 'NLP & IA • 5º sem.',
        initials: 'CS',
        avatarBg: '#1349EB',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '7',
        name: 'Gabriel Rocha',
        role: 'Catálogo SIGAA • 3º sem.',
        initials: 'GR',
        avatarBg: '#F1C321',
        avatarTextColor: '#1F1F1F',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
  {
    id: 'design',
    label: 'DESIGN & UX/UI',
    bannerTitle: 'PRODUCT DESIGN, IHC & EXPERIÊNCIA DO ESTUDANTE',
    bannerBg: '#F1C321',
    bannerTextColor: '#1F1F1F',
    iconComponent: (color) => <IconeDesign size={20} color={color} />,
    members: [
      {
        id: '8',
        name: 'Isabela Torres',
        role: 'UX/UI • 7º sem.',
        initials: 'IT',
        avatarBg: '#009A5E',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '9',
        name: 'Gustavo Nunes',
        role: 'Product Design • 5º sem.',
        initials: 'GN',
        avatarBg: '#1349EB',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '10',
        name: 'Letícia Prado',
        role: 'IHC • 4º sem.',
        initials: 'LP',
        avatarBg: '#F1C321',
        avatarTextColor: '#1F1F1F',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
  {
    id: 'comunicacao',
    label: 'COMUNICAÇÃO & COMUNIDADE',
    bannerTitle: 'COMUNICAÇÃO, EVENTOS & SUPORTE ESTUDANTIL',
    bannerBg: '#FE4141',
    bannerTextColor: '#FFFFFF',
    iconComponent: (color) => <IconeMegafone size={20} color={color} />,
    members: [
      {
        id: '11',
        name: 'Bruna Oliveira',
        role: 'Comunicação • 4º sem.',
        initials: 'BO',
        avatarBg: '#1349EB',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      {
        id: '12',
        name: 'Diego Martins',
        role: 'Comunidade • 6º sem.',
        initials: 'DM',
        avatarBg: '#009A5E',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
];

interface EquipeSectionProps {
  onPressJoinTeam?: () => void;
}

export function EquipeSection({ onPressJoinTeam }: EquipeSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [selectedDeptId, setSelectedDeptId] = useState('software');
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const currentDept =
    DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];

  const handleOpenUrl = (url?: string) => {
    if (!url) return;
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.accentBar} />
            <Text style={styles.sectionTitle}>QUEM CONSTRÓI O UNBOOK</Text>
          </View>
          <Text style={styles.subtitle}>
            Estudantes da Universidade de Brasília trabalhando voluntariamente pelo coletivo
          </Text>
        </View>

        {/* Abas dos departamentos */}
        <View style={styles.tabsRow}>
          {DEPARTMENTS.map((dept) => {
            const isSelected = dept.id === selectedDeptId;
            return (
              <Pressable
                key={dept.id}
                onPress={() => setSelectedDeptId(dept.id)}
                style={[
                  styles.tabButton,
                  isSelected && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isSelected && styles.tabButtonTextActive,
                  ]}
                >
                  {dept.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Faixa temática do departamento selecionado */}
        <View
          style={[
            styles.deptBanner,
            { backgroundColor: currentDept.bannerBg },
          ]}
        >
          <View style={styles.bannerLeft}>
            <View style={styles.bannerIconBox}>
              {currentDept.iconComponent(currentDept.bannerTextColor)}
            </View>
            <Text
              style={[
                styles.bannerTitleText,
                { color: currentDept.bannerTextColor },
              ]}
            >
              {currentDept.bannerTitle}
            </Text>
          </View>
          <View
            style={[
              styles.memberCountBadge,
              currentDept.bannerTextColor === '#1F1F1F' && styles.memberCountBadgeDark,
            ]}
          >
            <Text
              style={[
                styles.bannerMemberCount,
                { color: currentDept.bannerTextColor },
              ]}
            >
              {currentDept.members.length} MEMBROS
            </Text>
          </View>
        </View>

        {/* Grid de membros da equipe */}
        <View style={[styles.membersGrid, isMobile && styles.membersGridMobile]}>
          {currentDept.members.map((member) => {
            const isHovered = hoveredMember === member.id;
            return (
              <View
                key={member.id}
                // @ts-ignore
                onMouseEnter={() => setHoveredMember(member.id)}
                // @ts-ignore
                onMouseLeave={() => setHoveredMember(null)}
                style={[
                  styles.memberCard,
                  isHovered && styles.memberCardHovered,
                ]}
              >
                <View
                  style={[
                    styles.avatarBox,
                    { backgroundColor: member.avatarBg },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarInitials,
                      member.avatarTextColor
                        ? { color: member.avatarTextColor }
                        : { color: '#FFFFFF' },
                    ]}
                  >
                    {member.initials}
                  </Text>
                </View>

                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>

                <View style={styles.socialRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="GitHub do colaborador"
                    onPress={() => handleOpenUrl(member.github)}
                    style={styles.socialBtn}
                  >
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
                        stroke="#1F1F1F"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="LinkedIn do colaborador"
                    onPress={() => handleOpenUrl(member.linkedin)}
                    style={styles.socialBtn}
                  >
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"
                        stroke="#1F1F1F"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path d="M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#1F1F1F" />
                    </Svg>
                  </Pressable>
                </View>
              </View>
            );
          })}

          {/* Card de recrutamento / chamada para novos alunos */}
          <View style={styles.recruitmentCard}>
            <View style={styles.avatarDashed}>
              <Text style={styles.questionMark}>+</Text>
            </View>
            <Text style={styles.recruitTitle}>Faça parte da equipe!</Text>
            <Text style={styles.recruitDesc}>
              Ganhe horas de extensão e construa projetos para toda a UnB.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar para a equipe do UnBook"
              onPress={() =>
                onPressJoinTeam
                  ? onPressJoinTeam()
                  : handleOpenUrl('https://github.com/unbook-org/unbook-2')
              }
              style={styles.recruitBtn}
            >
              <Text style={styles.recruitBtnText}>COLABORAR →</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FAF9F5',
    paddingVertical: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderColor: '#1F1F1F',
  },
  container: {
    maxWidth: 1160,
    width: '100%',
    marginHorizontal: 'auto',
  },
  header: {
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  accentBar: {
    width: 6,
    height: 28,
    backgroundColor: '#009A5E',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#707070',
    marginLeft: 18,
  },
  tabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tabButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2.5px 2.5px 0px #1F1F1F',
          transition: 'all 0.18s ease',
        } as any)
      : {}),
  },
  tabButtonActive: {
    backgroundColor: '#1F1F1F',
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1F1F1F',
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  deptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    marginBottom: 24,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  memberCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'currentColor',
  },
  memberCountBadgeDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  bannerMemberCount: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  membersGridMobile: {
    flexDirection: 'column',
  },
  memberCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '3.5px 3.5px 0px #1F1F1F',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        } as any)
      : {}),
  },
  memberCardHovered: {
    transform: [{ translateY: -4 }],
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '5px 5px 0px #1F1F1F',
        } as any)
      : {}),
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#707070',
    marginBottom: 14,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    backgroundColor: '#FAF9F5',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
        } as any)
      : {}),
  },
  recruitmentCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#FCFAEC',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  avatarDashed: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#009A5E',
    backgroundColor: '#E6F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  questionMark: {
    fontSize: 22,
    fontWeight: '900',
    color: '#009A5E',
  },
  recruitTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 4,
    textAlign: 'center',
  },
  recruitDesc: {
    fontSize: 11,
    color: '#707070',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
  },
  recruitBtn: {
    backgroundColor: '#009A5E',
    borderWidth: 1.5,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 16,
    shadowColor: '#1F1F1F',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({
          cursor: 'pointer',
          boxShadow: '2px 2px 0px #1F1F1F',
        } as any)
      : {}),
  },
  recruitBtnText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

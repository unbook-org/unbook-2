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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
  github?: string;
  linkedin?: string;
}

interface Department {
  id: string;
  label: string;
  bannerTitle: string;
  bannerBg: string;
  bannerTextColor: string;
  iconText: string;
  members: TeamMember[];
}

const DEPARTMENTS: Department[] = [
  {
    id: 'software',
    label: 'ENGENHARIA DE SOFTWARE & ARQUITETURA CORE',
    bannerTitle: 'ENGENHARIA DE SOFTWARE & ARQUITETURA CORE',
    bannerBg: '#1349EB',
    bannerTextColor: '#FFFFFF',
    iconText: '</>',
    members: [
      {
        id: '1',
        name: 'Lucas Ferreira',
        role: 'Eng. Software • 4º sem.',
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
    label: 'ENGENHARIA DE DADOS & PIPELINE',
    bannerTitle: 'ENGENHARIA DE DADOS & PIPELINE',
    bannerBg: '#009A5E',
    bannerTextColor: '#FFFFFF',
    iconText: '📊',
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
        role: 'Scraping SIGAA • 3º sem.',
        initials: 'GR',
        avatarBg: '#F1C321',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
  {
    id: 'design',
    label: 'PRODUCT DESIGN, IHC & UX/UI',
    bannerTitle: 'PRODUCT DESIGN, IHC & UX/UI',
    bannerBg: '#FF7A00',
    bannerTextColor: '#FFFFFF',
    iconText: '🎨',
    members: [
      {
        id: '8',
        name: 'Isabela Torres',
        role: 'UX/UI • 7º sem.',
        initials: 'IT',
        avatarBg: '#FF7A00',
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
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    ],
  },
  {
    id: 'comunicacao',
    label: 'COMUNICAÇÃO & CONTEÚDO',
    bannerTitle: 'COMUNICAÇÃO & CONTEÚDO',
    bannerBg: '#FE4141',
    bannerTextColor: '#FFFFFF',
    iconText: '📢',
    members: [
      {
        id: '11',
        name: 'Bruna Oliveira',
        role: 'Conteúdo • 4º sem.',
        initials: 'BO',
        avatarBg: '#FF7A00',
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
            <Text style={styles.sectionTitle}>QUEM FAZ ACONTECER</Text>
          </View>
          <Text style={styles.subtitle}>Os estudantes por trás do UnBook</Text>
        </View>

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

        <View
          style={[
            styles.deptBanner,
            { backgroundColor: currentDept.bannerBg },
          ]}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerIcon}>{currentDept.iconText}</Text>
            <Text style={styles.bannerTitleText}>{currentDept.bannerTitle}</Text>
          </View>
          <Text style={styles.bannerMemberCount}>
            {currentDept.members.length} MEMBROS
          </Text>
        </View>

        <View style={[styles.membersGrid, isMobile && styles.membersGridMobile]}>
          {currentDept.members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View
                style={[
                  styles.avatarBox,
                  { backgroundColor: member.avatarBg },
                ]}
              >
                <Text style={styles.avatarInitials}>{member.initials}</Text>
              </View>

              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>

              <View style={styles.socialRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="GitHub"
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
                  accessibilityLabel="LinkedIn"
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
          ))}

          <View style={styles.recruitmentCard}>
            <View style={styles.avatarDashed}>
              <Text style={styles.questionMark}>?</Text>
            </View>
            <Text style={styles.recruitTitle}>Seja o próximo!</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Entrar para a equipe"
              onPress={() =>
                onPressJoinTeam
                  ? onPressJoinTeam()
                  : handleOpenUrl('https://github.com/unbook-org/unbook-2')
              }
              style={styles.recruitBtn}
            >
              <Text style={styles.recruitBtnText}>ENTRAR</Text>
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
    backgroundColor: '#FE4141',
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
    gap: 10,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tabButtonActive: {
    backgroundColor: '#1F1F1F',
  },
  tabButtonText: {
    fontSize: 11,
    fontWeight: '800',
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  bannerTitleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bannerMemberCount: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  membersGridMobile: {
    justifyContent: 'center',
  },
  memberCard: {
    flex: 1,
    minWidth: 180,
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 11,
    color: '#707070',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
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
  },
  recruitmentCard: {
    flex: 1,
    minWidth: 180,
    maxWidth: 220,
    backgroundColor: '#FAF9F5',
    borderWidth: 2.5,
    borderColor: '#1F1F1F',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDashed: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#A0A09B',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  questionMark: {
    fontSize: 20,
    fontWeight: '900',
    color: '#707070',
  },
  recruitTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 12,
  },
  recruitBtn: {
    backgroundColor: '#009A5E',
    borderWidth: 2,
    borderColor: '#1F1F1F',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  recruitBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});


import React, { useState, useEffect } from 'react';
import {
  View, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, ActivityIndicator, Image,
} from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MemberService, FirestoreMember } from '../services/firebase';
import {
  MemberCategory, Department,
  HuynhTruongRole, GENDERS,
} from '../Common/MemberEnums';
import Languages from '../Common/Languages';

interface Props {
  onBack: () => void;
  onAdd?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────
const filter = (
  members: FirestoreMember[],
  opts: { role?: string; department?: string; position?: string; gender?: string },
) =>
  members.filter(m =>
    (!opts.role || m.role === opts.role) &&
    (!opts.department || m.department === opts.department) &&
    (!opts.position || m.position === opts.position) &&
    (!opts.gender || m.gender === opts.gender),
  );

// ── Sub-components ────────────────────────────────────────────
const MemberChip = ({ member }: { member: FirestoreMember }) => {
  const initials = (member.fullName || '?')
    .split(' ')
    .slice(-2)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase();
  const isHT = member.position === MemberCategory.HUYNH_TRUONG;

  return (
    <View style={chipStyles.chip}>
      {member.avatar ? (
        <Image source={{ uri: member.avatar }} style={chipStyles.avatar} />
      ) : (
        <View style={[chipStyles.avatarFallback, isHT && chipStyles.avatarFallbackHT]}>
          <WText type="medium10" style={chipStyles.initials}>{initials}</WText>
        </View>
      )}
      <View style={chipStyles.info}>
        <WText type="medium11" style={chipStyles.name} numberOfLines={1}>{member.fullName}</WText>
        {!!member.dharmaName && (
          <WText type="regular10" style={chipStyles.dharma} numberOfLines={1}>{member.dharmaName}</WText>
        )}
      </View>
    </View>
  );
};

const MemberRow = ({ members }: { members: FirestoreMember[] }) => {
  if (members.length === 0) return <EmptySlot />;
  return (
    <View style={styles.chipGrid}>
      {members.map(m => <MemberChip key={m.id} member={m} />)}
    </View>
  );
};

const EmptySlot = () => (
  <View style={styles.emptySlot}>
    <WText type="medium10" style={styles.emptySlotText}>
      {Languages.get('screen.family_tree.empty')}
    </WText>
  </View>
);

const SubHeader = ({ title }: { title: string }) => (
  <View style={styles.subHeader}>
    <View style={styles.subDot} />
    <WText type="medium10" style={styles.subHeaderText}>{title}</WText>
    <View style={styles.subLine} />
  </View>
);

const GroupBox = ({
  title, color = '#008A45', children,
}: { title: string; color?: string; children: React.ReactNode }) => (
  <View style={styles.group}>
    <View style={styles.groupTitleRow}>
      <View style={[styles.groupTitleDot, { backgroundColor: color }]} />
      <View style={[styles.groupTitle, { borderColor: color + '40', backgroundColor: color + '12' }]}>
        <WText type="medium11" style={[styles.groupTitleText, { color }]}>{title}</WText>
      </View>
    </View>
    <View style={styles.groupContent}>{children}</View>
  </View>
);

const Section = ({
  title, onAdd, children,
}: { title: string; onAdd?: () => void; children: React.ReactNode }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <WText type="medium13" style={styles.sectionHeaderText}>{title}</WText>
      {onAdd && (
        <TouchableOpacity onPress={onAdd} style={styles.addBtn} activeOpacity={0.8}>
          <MaterialIcon name="add" size={13} color="#FFFFFF" />
          <WText type="medium11" style={styles.addBtnText}>
            {Languages.get('screen.family_tree.add')}
          </WText>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

// ── Main Screen ───────────────────────────────────────────────
const FamilyTreeScreen: React.FC<Props> = ({ onBack, onAdd }) => {
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = MemberService.subscribeAll(data => {
      setMembers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Nhóm dữ liệu ──────────────────────────────────────────
  const giaTruong = filter(members, { role: HuynhTruongRole.GIA_TRUONG });
  const ldTruong = filter(members, { role: HuynhTruongRole.LIEN_DOAN_TRUONG });
  const ldPho = filter(members, { role: HuynhTruongRole.LIEN_DOAN_PHO });
  const thuKy = filter(members, { role: HuynhTruongRole.THU_KY });
  const thuQuy = filter(members, { role: HuynhTruongRole.THU_QUY });

  const byDeptGender = (dept: Department, gender: string, position: MemberCategory) =>
    filter(members, { department: dept, gender, position });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />

      {/* AppBar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialIcon name="arrow-back" size={22} color="#008A45" />
        </TouchableOpacity>
        <WText type="medium18" style={styles.appBarTitle}>
          {Languages.get('screen.family_tree.title')}
        </WText>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#008A45" size="large" />
          <WText type="regular13" style={styles.loadingText}>
            {Languages.get('screen.family_tree.loading')}
          </WText>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Gia trưởng */}
          <Section title={Languages.get('screen.family_tree.section_gia_truong')} onAdd={onAdd}>
            <MemberRow members={giaTruong} />
          </Section>

          {/* Ban thường vụ */}
          <Section title={Languages.get('screen.family_tree.section_btv')} onAdd={onAdd}>
            <SubHeader title={Languages.get('screen.family_tree.role_ld_truong')} />
            <MemberRow members={ldTruong} />

            <SubHeader title={Languages.get('screen.family_tree.role_ld_pho')} />
            <MemberRow members={ldPho} />

            <SubHeader title={Languages.get('screen.family_tree.role_thu_ky')} />
            <MemberRow members={thuKy} />

            <SubHeader title={Languages.get('screen.family_tree.role_thu_quy')} />
            <MemberRow members={thuQuy} />
          </Section>

          {/* Ngành Thanh */}
          <Section title={Languages.get('screen.family_tree.section_thanh')} onAdd={onAdd}>
            <GroupBox title={Languages.get('screen.family_tree.group_thanh_nam')}>
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.THANH, GENDERS[0], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.THANH, GENDERS[0], MemberCategory.DOAN_SINH)} />
            </GroupBox>
            <GroupBox title={Languages.get('screen.family_tree.group_thanh_nu')} color="#EC4899">
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.THANH, GENDERS[1], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.THANH, GENDERS[1], MemberCategory.DOAN_SINH)} />
            </GroupBox>
          </Section>

          {/* Ngành Thiếu */}
          <Section title={Languages.get('screen.family_tree.section_thieu')} onAdd={onAdd}>
            <GroupBox title={Languages.get('screen.family_tree.group_thieu_nam')}>
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.THIEU, GENDERS[0], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.THIEU, GENDERS[0], MemberCategory.DOAN_SINH)} />
            </GroupBox>
            <GroupBox title={Languages.get('screen.family_tree.group_thieu_nu')} color="#EC4899">
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.THIEU, GENDERS[1], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.THIEU, GENDERS[1], MemberCategory.DOAN_SINH)} />
            </GroupBox>
          </Section>

          {/* Ngành Oanh */}
          <Section title={Languages.get('screen.family_tree.section_oanh')} onAdd={onAdd}>
            <GroupBox title={Languages.get('screen.family_tree.group_oanh_nam')}>
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.OANH, GENDERS[0], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.OANH, GENDERS[0], MemberCategory.DOAN_SINH)} />
            </GroupBox>
            <GroupBox title={Languages.get('screen.family_tree.group_oanh_nu')} color="#EC4899">
              <SubHeader title={Languages.get('screen.family_tree.sub_huynh_truong')} />
              <MemberRow members={byDeptGender(Department.OANH, GENDERS[1], MemberCategory.HUYNH_TRUONG)} />
              <SubHeader title={Languages.get('screen.family_tree.sub_doan_sinh')} />
              <MemberRow members={byDeptGender(Department.OANH, GENDERS[1], MemberCategory.DOAN_SINH)} />
            </GroupBox>
          </Section>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// ── Chip Styles ───────────────────────────────────────────────
const chipStyles = StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#F3F4F6',
    borderRadius: 12, padding: 8, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  avatar: { width: 36, height: 36, borderRadius: 10 },
  avatarFallback: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  avatarFallbackHT: { backgroundColor: '#FFF3E0' },
  initials: { color: '#008A45' },
  info: { flex: 1 },
  name: { color: '#1F2937' },
  dharma: { color: '#008A45', marginTop: 1 },
});

// ── Main Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  appBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center',
  },
  appBarTitle: { flex: 1, textAlign: 'center', color: '#008A45' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F7F9F7' },
  loadingText: { color: '#9CA3AF' },

  scrollView: { flex: 1, backgroundColor: '#F7F9F7' },
  scroll: { padding: 12, paddingBottom: 48, gap: 12 },

  // Section
  section: { borderRadius: 18, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  sectionHeader: {
    backgroundColor: '#008A45',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13,
  },
  sectionHeaderText: { color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1.2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 3 },
  addBtnText: { color: '#FFFFFF' },
  sectionContent: { backgroundColor: '#FFFFFF', padding: 14, gap: 6 },

  // Group
  group: { marginTop: 10 },
  groupTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  groupTitleDot: { width: 4, height: 20, borderRadius: 2 },
  groupTitle: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  groupTitleText: {},
  groupContent: { paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#F3F4F6', marginLeft: 2, gap: 6 },

  // SubHeader
  subHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 6, marginTop: 4 },
  subDot: { width: 3, height: 14, backgroundColor: '#008A45', borderRadius: 2, opacity: 0.5 },
  subHeaderText: { color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1.2, flex: 0 },
  subLine: { flex: 1, height: 1, backgroundColor: '#F3F4F6' },

  // Chip grid
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  // Empty slot
  emptySlot: { paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, borderStyle: 'dashed', flex: 1 },
  emptySlotText: { color: '#D1D5DB', textTransform: 'uppercase', fontStyle: 'italic' },
});

export default FamilyTreeScreen;

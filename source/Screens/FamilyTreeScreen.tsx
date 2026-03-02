import React, { useState, useEffect } from 'react';
import {
  View, TouchableOpacity, ScrollView, StyleSheet,
  StatusBar, ActivityIndicator, Image, Modal,
  TextInput, FlatList, Animated, Dimensions,
} from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MemberService, FirestoreMember, ApprovalService } from '../services/firebase';
import { Member } from '../../types';
import { ToastType } from '../Common/Toast';
import {
  MemberCategory, Department,
  HuynhTruongRole, GENDERS,
} from '../Common/MemberEnums';
import Languages from '../Common/Languages';
import Style from '../Common/Style';

interface Props {
  onBack: () => void;
  onAdd: (initialData?: any) => void;
  isAdmin?: boolean;
  user: Member;
  showToast: (message: string, type?: ToastType) => void;
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
  title, onAdd, initialData, children,
}: { title: string; onAdd?: (data?: any) => void; initialData?: any; children: React.ReactNode }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <WText type="medium13" style={styles.sectionHeaderText}>{title}</WText>
      {onAdd && (
        <TouchableOpacity onPress={() => onAdd(initialData)} style={styles.addBtn} activeOpacity={0.8}>
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
const FamilyTreeScreen: React.FC<Props> = ({ onBack, onAdd, isAdmin, user, showToast }) => {
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [loading, setLoading] = useState(true);

  // States cho Select Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  useEffect(() => {
    const unsub = MemberService.subscribeAll(data => {
      setMembers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleOpenSelect = (initialData: any) => {
    setSelectedSlot(initialData);
    setIsModalOpen(true);
  };

  const handleMemberSelect = (member: FirestoreMember) => {
    if (!selectedSlot) return;

    // Đóng modal và chuyển sang màn hình AddMember với data đã fill sẵn
    setIsModalOpen(false);

    // Gộp dữ liệu:
    // 1. Lấy toàn bộ thông tin gốc của member (rank, phone, email, dharmaName...)
    // 2. Ghi đè bằng thông tin của slot (vị trí/chức vụ/ngành mới mà user vừa chọn trên sơ đồ)
    onAdd({
      ...member,       // Giữ nguyên các field có sẵn của member
      ...selectedSlot, // Overwrite bằng các field của slot (role, department, position)
      uid: member.id,  // Gán ID thực để xử lý update
    });
  };

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
          <Section
            title={Languages.get('screen.family_tree.section_gia_truong')}
            onAdd={handleOpenSelect}
            initialData={{ position: MemberCategory.HUYNH_TRUONG, role: HuynhTruongRole.GIA_TRUONG }}
          >
            <MemberRow members={giaTruong} />
          </Section>

          {/* Ban thường vụ */}
          <Section
            title={Languages.get('screen.family_tree.section_btv')}
            onAdd={handleOpenSelect}
            initialData={{ position: MemberCategory.HUYNH_TRUONG, role: HuynhTruongRole.LIEN_DOAN_TRUONG }}
          >
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
          <Section
            title={Languages.get('screen.family_tree.section_thanh')}
            onAdd={handleOpenSelect}
            initialData={{ department: Department.THANH }}
          >
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
          <Section
            title={Languages.get('screen.family_tree.section_thieu')}
            onAdd={handleOpenSelect}
            initialData={{ department: Department.THIEU }}
          >
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
          <Section
            title={Languages.get('screen.family_tree.section_oanh')}
            onAdd={handleOpenSelect}
            initialData={{ department: Department.OANH }}
          >
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

      {/* Select Modal */}
      <MemberSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={members}
        onSelect={handleMemberSelect}
        onAddNew={() => { }}
        isAdmin={!!isAdmin}
        showToast={showToast}
      />
    </SafeAreaView>
  );
};

// ── MemberSelectModal ─────────────────────────────────────────

const MemberSelectModal = ({
  isOpen, onClose, members, onSelect, onAddNew, isAdmin, showToast
}: {
  isOpen: boolean; onClose: () => void; members: FirestoreMember[];
  onSelect: (m: FirestoreMember) => void; onAddNew: () => void; isAdmin: boolean;
  showToast: (message: string, type?: ToastType) => void;
}) => {
  const [search, setSearch] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', dharmaName: '' });
  const [creating, setCreating] = useState(false);

  const slideAnim = React.useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      setIsCreateMode(false);
      setForm({ fullName: '', email: '', dharmaName: '' });
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get('window').height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleQuickCreate = async () => {
    if (!form.fullName.trim() || !form.email.trim()) return;
    setCreating(true);
    try {
      const newId = await MemberService.createQuick(form.fullName, form.email, form.dharmaName);
      const newMember: FirestoreMember = {
        id: newId,
        ...form,
        gender: 'Nam',
        status: 'active',
        position: '',
        department: '',
        role: '',
        rank: '',
      } as any;
      onSelect(newMember);
      setIsCreateMode(false);
      showToast(Languages.get('screen.family_tree.create_acc_success').replace('{name}', form.fullName));
    } catch (err) {
      console.error(err);
      showToast(Languages.get('system.msg.error_general'), 'error');
    } finally {
      setCreating(false);
    }
  };

  const filtered = members.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (m.dharmaName && m.dharmaName.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[modalStyles.sheet, {
        transform: [{ translateY: slideAnim }],
        height: isCreateMode ? Dimensions.get('window').height * 0.52 : Dimensions.get('window').height * 0.75
      }]}>
        <View style={modalStyles.handle} />
        <View style={modalStyles.header}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {isCreateMode && (
              <TouchableOpacity onPress={() => setIsCreateMode(false)} style={{ marginRight: 8 }}>
                <MaterialIcon name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
            )}
            <WText type="medium16" style={modalStyles.title}>
              {isCreateMode ? Languages.get('screen.family_tree.modal_create_account_title') : Languages.get('screen.family_tree.modal_select_title')}
            </WText>
          </View>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <MaterialIcon name="close" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {isCreateMode ? (
          <ScrollView style={{ paddingHorizontal: 20 }}>
            {/* Form Create */}
            <WText type="medium11" style={modalStyles.fieldLabel}>{Languages.get('screen.edit_profile.label_fullname')}</WText>
            <TextInput
              style={modalStyles.formInput}
              value={form.fullName}
              onChangeText={v => setForm({ ...form, fullName: v })}
              placeholder={Languages.get('screen.add_member.placeholder_input')}
            />

            <WText type="medium11" style={modalStyles.fieldLabel}>{Languages.get('screen.family_tree.label_email_acc')}</WText>
            <TextInput
              style={modalStyles.formInput}
              value={form.email}
              onChangeText={v => setForm({ ...form, email: v })}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder={'example@gmail.com'}
            />

            <WText type="medium11" style={modalStyles.fieldLabel}>{Languages.get('screen.edit_profile.label_dharma_name')}</WText>
            <TextInput
              style={modalStyles.formInput}
              value={form.dharmaName}
              onChangeText={v => setForm({ ...form, dharmaName: v })}
              placeholder={Languages.get('screen.add_member.placeholder_input')}
            />

            <TouchableOpacity
              style={[modalStyles.addBtn, (!form.fullName || !form.email) && { opacity: 0.6 }]}
              onPress={handleQuickCreate}
              disabled={creating || !form.fullName || !form.email}
            >
              {creating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcon name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <WText type="medium14" style={modalStyles.addBtnText}>{Languages.get('screen.family_tree.btn_confirm_create')}</WText>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <>
            {/* Search */}
            <View style={modalStyles.searchBox}>
              <MaterialIcon name="search" size={20} color="#9CA3AF" style={modalStyles.searchIcon} />
              <TextInput
                placeholder={Languages.get('screen.family_tree.search_placeholder')}
                style={modalStyles.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={m => m.id}
              contentContainerStyle={modalStyles.list}
              renderItem={({ item }) => {
                const initials = (item.fullName || '?')
                  .split(' ')
                  .slice(-2)
                  .map((w: string) => w[0])
                  .join('')
                  .toUpperCase();
                const isHT = item.position === MemberCategory.HUYNH_TRUONG;

                return (
                  <TouchableOpacity style={modalStyles.item} onPress={() => onSelect(item)}>
                    <View style={modalStyles.itemAvatarBox}>
                      {item.avatar ? (
                        <Image source={{ uri: item.avatar }} style={modalStyles.itemAvatar} />
                      ) : (
                        <View style={[modalStyles.itemAvatarFallback, isHT && modalStyles.itemAvatarFallbackHT]}>
                          <WText type="medium11" style={modalStyles.itemInitials}>{initials}</WText>
                        </View>
                      )}
                    </View>
                    <View style={modalStyles.itemInfo}>
                      <WText type="medium14" style={modalStyles.itemName}>{item.fullName}</WText>
                      {!!item.dharmaName && (
                        <WText type="regular11" style={modalStyles.itemDharma}>{item.dharmaName}</WText>
                      )}
                    </View>
                    <MaterialIcon name="chevron-right" size={20} color="#E5E7EB" />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={modalStyles.empty}>
                  <WText type="regular12" style={modalStyles.emptyText}>
                    {Languages.get('screen.member_list.no_result_title')}
                  </WText>
                </View>
              }
            />

            {isAdmin && (
              <TouchableOpacity style={modalStyles.addBtn} onPress={() => setIsCreateMode(true)} activeOpacity={0.8}>
                <MaterialIcon name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <WText type="medium14" style={modalStyles.addBtnText}>
                  {Languages.get('screen.family_tree.btn_create_new')}
                </WText>
              </TouchableOpacity>
            )}
          </>
        )}
      </Animated.View>
    </Modal>
  );
};

// ── Modal Styles ──────────────────────────────────────────────
const modalStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 24,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 12 },
  title: { color: '#1F2937' },
  closeBtn: { padding: 4 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6',
    marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 12, marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { ...Style.textFontSize12, ...Style.fontRegular, flex: 1, height: 44, color: '#1F2937' },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  itemAvatarBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  itemAvatar: { width: 44, height: 44, borderRadius: 12 },
  itemAvatarFallback: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  itemAvatarFallbackHT: { backgroundColor: '#FFF3E0' },
  itemInitials: { color: '#008A45' },
  itemInfo: { flex: 1 },
  itemName: { color: '#1F2937' },
  itemDharma: { color: '#008A45' },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF' },
  addBtn: {
    backgroundColor: '#008A45', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, paddingVertical: 14, borderRadius: 14, marginTop: 34,
    shadowColor: '#008A45', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  fieldLabel: { color: '#6B7280', marginBottom: 8, marginTop: 16 },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 16, height: 48,
    color: '#1F2937', fontSize: 14,
  },
});

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

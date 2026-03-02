import React, { useState, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, Image, StyleSheet,
  FlatList, StatusBar, ActivityIndicator, Modal, ScrollView,
} from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MemberService, FirestoreMember } from '../services/firebase';
import { MemberCategory } from '../Common/MemberEnums';
import Languages from '../Common/Languages';
import Style from '../Common/Style';

interface Props {
  onBack: () => void;
  currentUid?: string;
}

const getTabs = () => [
  { key: 'all', label: Languages.get('screen.member_list.tab_all') },
  { key: MemberCategory.HUYNH_TRUONG, label: Languages.get('screen.member_list.tab_huynh_truong') },
  { key: MemberCategory.DOAN_SINH, label: Languages.get('screen.member_list.tab_doan_sinh') },
];

const MemberListScreen: React.FC<Props> = ({ onBack, currentUid }) => {
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selected, setSelected] = useState<FirestoreMember | null>(null);

  useEffect(() => {
    const unsub = MemberService.subscribeAll((data) => {
      setMembers(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Danh sách đã loại bản thân
  const othersMembers = members.filter(m => !currentUid || m.id !== currentUid);

  const filtered = othersMembers.filter((m) => {
    const matchTab = activeTab === 'all' || m.position === activeTab;
    const matchText = !filter ||
      m.fullName.toLowerCase().includes(filter.toLowerCase()) ||
      (m.dharmaName || '').toLowerCase().includes(filter.toLowerCase());
    return matchTab && matchText;
  });

  const countByTab = (key: string) =>
    key === 'all' ? othersMembers.length : othersMembers.filter(m => m.position === key).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />

      {/* ── Header ───────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={22} color="#008A45" />
          </TouchableOpacity>
          <View style={styles.headerTextBlock}>
            <WText type="medium20" style={styles.headerTitle}>{Languages.get('screen.member_list.title')}</WText>
            <WText type="regular11" style={styles.headerSub}>
              {loading ? '...' : `${othersMembers.length} ${Languages.get('screen.member_list.subtitle')}`}
            </WText>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <MaterialIcon name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder={Languages.get('screen.member_list.search_placeholder')}
            placeholderTextColor="#9CA3AF"
            value={filter}
            onChangeText={setFilter}
          />
          {!!filter && (
            <TouchableOpacity onPress={() => setFilter('')}>
              <MaterialIcon name="close" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {getTabs().map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <WText
                type={activeTab === tab.key ? 'medium12' : 'regular12'}
                style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
              >
                {tab.label}
              </WText>
              <View style={[styles.tabBadge, activeTab === tab.key && styles.tabBadgeActive]}>
                <WText type="medium9" style={[styles.tabBadgeText, activeTab === tab.key && styles.tabBadgeTextActive]}>
                  {countByTab(tab.key)}
                </WText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Content ──────────────────────────────────── */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#008A45" size="large" />
            <WText type="regular13" style={styles.loadingText}>{Languages.get('screen.member_list.loading')}</WText>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            contentContainerStyle={[styles.list, filtered.length === 0 && styles.listEmpty]}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => <MemberCard member={item} onPress={() => setSelected(item)} />}
            ListEmptyComponent={<EmptyState hasFilter={!!filter} />}
          />
        )}
      </View>

      {/* Detail Modal */}
      {selected && (
        <MemberDetailModal member={selected} onClose={() => setSelected(null)} />
      )}
    </SafeAreaView>
  );
};

// ── MemberDetailModal ─────────────────────────────────────────
const DetailRow = ({ icon, label, value }: { icon: string; label: string; value?: string }) => {
  if (!value) return null;
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.rowIcon}>
        <MaterialIcon name={icon} size={15} color="#008A45" />
      </View>
      <View style={detailStyles.rowContent}>
        <WText type="medium10" style={detailStyles.rowLabel}>{label}</WText>
        <WText type="medium13" style={detailStyles.rowValue}>{value}</WText>
      </View>
    </View>
  );
};

const MemberDetailModal = ({ member, onClose }: { member: FirestoreMember; onClose: () => void }) => {
  const isHT = member.position === MemberCategory.HUYNH_TRUONG;
  const initials = (member.fullName || '?').split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase();

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <TouchableOpacity style={detailStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={detailStyles.sheet}>
        <View style={detailStyles.handle} />

        {/* Avatar + Name */}
        <View style={detailStyles.heroSection}>
          {member.avatar ? (
            <Image source={{ uri: member.avatar }} style={detailStyles.heroAvatar} />
          ) : (
            <View style={[detailStyles.heroAvatarFallback, isHT && detailStyles.heroAvatarFallbackHT]}>
              <WText type="medium24" style={detailStyles.heroInitials}>{initials}</WText>
            </View>
          )}
          <WText type="medium18" style={detailStyles.heroName}>{member.fullName}</WText>
          {!!member.dharmaName && (
            <WText type="regular13" style={detailStyles.heroDharma}>{member.dharmaName}</WText>
          )}
          <View style={detailStyles.heroBadgeRow}>
            {!!member.rank && (
              <View style={[detailStyles.heroBadge, isHT && detailStyles.heroBadgeHT]}>
                <WText type="medium10" style={[detailStyles.heroBadgeText, isHT && detailStyles.heroBadgeTextHT]}>
                  {member.rank}
                </WText>
              </View>
            )}
            {!!member.position && (
              <View style={detailStyles.heroBadgePos}>
                <WText type="medium10" style={detailStyles.heroBadgePosText}>{member.position}</WText>
              </View>
            )}
          </View>
        </View>

        {/* Info rows */}
        <ScrollView style={detailStyles.infoScroll} showsVerticalScrollIndicator={false}>
          <DetailRow icon="badge" label={Languages.get('screen.member_list.detail_role')} value={member.role} />
          <DetailRow icon="account-tree" label={Languages.get('screen.member_list.detail_department')} value={member.department} />
          <DetailRow icon="wc" label={Languages.get('screen.member_list.detail_gender')} value={member.gender} />
          <DetailRow icon="email" label={Languages.get('screen.member_list.detail_email')} value={member.email} />
          <DetailRow icon="phone" label={Languages.get('screen.member_list.detail_phone')} value={member.phone} />
          <DetailRow icon="calendar-today" label={Languages.get('screen.member_list.detail_join_date')} value={member.joinDate} />
          {member.isOrdained && (
            <DetailRow icon="military-tech" label={Languages.get('screen.member_list.detail_ordination_level')} value={member.ordinationLevel} />
          )}
          {member.isOrdained && (
            <DetailRow icon="event" label={Languages.get('screen.member_list.detail_ordination_date')} value={member.ordinationDate} />
          )}
        </ScrollView>

        {/* Close button */}
        <TouchableOpacity style={detailStyles.closeBtn} onPress={onClose} activeOpacity={0.8}>
          <WText type="medium14" style={detailStyles.closeBtnText}>{Languages.get('screen.member_list.detail_close')}</WText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const detailStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 24,
  },
  handle: {
    width: 40, height: 4, backgroundColor: '#E5E7EB',
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8,
  },
  // Hero
  heroSection: { alignItems: 'center', paddingVertical: 16, paddingHorizontal: 24 },
  heroAvatar: { width: 80, height: 80, borderRadius: 22, marginBottom: 12 },
  heroAvatarFallback: {
    width: 80, height: 80, borderRadius: 22,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroAvatarFallbackHT: { backgroundColor: '#FFF3E0' },
  heroInitials: { color: '#008A45' },
  heroName: { color: '#1F2937', textAlign: 'center' },
  heroDharma: { color: '#008A45', marginTop: 2, textAlign: 'center' },
  heroBadgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  heroBadge: {
    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  heroBadgeHT: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  heroBadgeText: { color: '#008A45', textTransform: 'uppercase' },
  heroBadgeTextHT: { color: '#D97706' },
  heroBadgePos: {
    backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  heroBadgePosText: { color: '#2563EB', textTransform: 'uppercase' },
  // Info rows
  infoScroll: { paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB',
    gap: 12,
  },
  rowIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: { color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  rowValue: { color: '#1F2937' },
  // Close
  closeBtn: {
    marginHorizontal: 20, marginTop: 16,
    backgroundColor: '#F3F4F6', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  closeBtnText: { color: '#374151' },
});

// ── MemberCard ────────────────────────────────────────────────
const MemberCard = ({ member, onPress }: { member: FirestoreMember; onPress: () => void }) => {
  const initials = (member.fullName || '?')
    .split(' ')
    .slice(-2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const isHuynhTruong = member.position === MemberCategory.HUYNH_TRUONG;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.75} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {member.avatar ? (
          <Image source={{ uri: member.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarFallback, isHuynhTruong && styles.avatarFallbackHT]}>
            <WText type="medium16" style={styles.avatarInitials}>{initials}</WText>
          </View>
        )}
        <View style={[styles.posDot, isHuynhTruong ? styles.posDotHT : styles.posDotDS]} />
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.cardTopRow}>
          <WText type="medium14" style={styles.cardName} numberOfLines={1}>
            {member.fullName}
          </WText>
          {!!member.rank && (
            <View style={[styles.rankBadge, isHuynhTruong && styles.rankBadgeHT]}>
              <WText type="medium9" style={[styles.rankText, isHuynhTruong && styles.rankTextHT]}>
                {member.rank}
              </WText>
            </View>
          )}
        </View>

        {!!member.dharmaName && (
          <WText type="regular12" style={styles.cardDharma} numberOfLines={1}>
            {member.dharmaName}
          </WText>
        )}

        <View style={styles.cardMeta}>
          {!!member.role && (
            <View style={styles.metaChip}>
              <MaterialIcon name="badge" size={11} color="#6B7280" />
              <WText type="regular11" style={styles.metaChipText} numberOfLines={1}>{member.role}</WText>
            </View>
          )}
          {!!member.department && (
            <View style={styles.metaChip}>
              <MaterialIcon name="account-tree" size={11} color="#6B7280" />
              <WText type="regular11" style={styles.metaChipText}>{member.department}</WText>
            </View>
          )}
        </View>
      </View>

      <MaterialIcon name="chevron-right" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
};

// ── EmptyState ────────────────────────────────────────────────
const IC_SEARCH_EMPTY = require('../Images/ic_search_empty.png');

const EmptyState = ({ hasFilter }: { hasFilter: boolean }) => (
  <View style={styles.emptyBox}>
    <Image source={IC_SEARCH_EMPTY} style={styles.emptyImage} resizeMode="contain" />
    <WText type="medium14" style={styles.emptyTitle}>
      {hasFilter ? Languages.get('screen.member_list.no_result_title') : Languages.get('screen.member_list.empty_title')}
    </WText>
    <WText type="regular12" style={styles.emptySub}>
      {hasFilter ? Languages.get('screen.member_list.no_result_sub') : Languages.get('screen.member_list.empty_sub')}
    </WText>
  </View>
);

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, backgroundColor: '#F7F9F7' },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  backButton: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextBlock: { flex: 1 },
  headerTitle: { color: '#1F2937' },
  headerSub: { color: '#9CA3AF', marginTop: 1 },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    ...Style.textFontSize12,
    ...Style.textWeight400,
    ...Style.fontRegular,
    flex: 1,
    color: '#1F2937',
    padding: 0,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  tabActive: { backgroundColor: '#008A45' },
  tabText: { color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },
  tabBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabBadgeText: { color: '#6B7280' },
  tabBadgeTextActive: { color: '#FFFFFF' },

  // List
  list: { padding: 16, paddingBottom: 40, backgroundColor: '#F7F9F7' },
  listEmpty: { flexGrow: 1, backgroundColor: '#F7F9F7' },

  // Loading
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#F7F9F7' },
  loadingText: { color: '#9CA3AF' },

  // Card
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },

  // Avatar
  avatarWrap: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 14 },
  avatarFallback: {
    width: 52, height: 52,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackHT: { backgroundColor: '#FFF3E0' },
  avatarInitials: { color: '#008A45' },
  posDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 14, height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  posDotHT: { backgroundColor: '#F59E0B' },
  posDotDS: { backgroundColor: '#22C55E' },

  // Card info
  cardInfo: { flex: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardName: { color: '#1F2937', flex: 1, marginRight: 8 },
  cardDharma: { color: '#008A45', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  metaChipText: { color: '#6B7280' },

  // Rank badge
  rankBadge: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rankBadgeHT: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  rankText: { color: '#008A45', textTransform: 'uppercase' },
  rankTextHT: { color: '#D97706' },

  // Empty
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 4 },
  emptyImage: { width: 120, height: 120 },
  emptyIconWrap: {
    width: 80, height: 80,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { color: '#374151' },
  emptySub: { color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 32 },
});

export default MemberListScreen;

import React from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import WText from '../Common/WText';
import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';

interface Props {
  user: Member;
  onBack: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, onBack, onEdit, onLogout }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <MaterialIcon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
            <MaterialIcon name="edit" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <WText type="medium24" style={styles.fullName}>{user.fullName}</WText>
        <WText type="medium14" style={styles.dharmaName}>{user.dharmaName}</WText>

        <View style={styles.statsContainer}>
          <StatBox label="Chức vụ" value={user.role || user.position} />
          <View style={styles.statDivider} />
          <StatBox label="Bậc học" value={user.rank} />
          <View style={styles.statDivider} />
          <StatBox label="Ngành" value={user.department} />
        </View>
      </View>

      <View style={styles.detailsSection}>
        <ProfileTile icon="face" label="Giới tính" value={user.gender} />
        <ProfileTile icon="email" label="Email" value={user.email} />
        <ProfileTile icon="phone" label="Số điện thoại" value={user.phone} />
        <ProfileTile icon="calendar-today" label="NGÀY BẮT ĐẦU SINH HOẠT" value={user.joinDate} />
        <ProfileTile icon="stars" label="Cấp bậc" value={user.promotionRank} highlight />
        <ProfileTile icon="category" label="Phân loại" value={user.position} />
      </View>

      <View style={styles.footer}>
        <WText type="medium10" style={styles.footerText}>Thông tin hồ sơ nội bộ GĐPT Vĩnh An</WText>
      </View>
    </ScrollView>
  );
};

const StatBox = ({ label, value }: any) => (
  <View style={styles.statBox}>
    <WText type="medium13" style={styles.statBoxValue}>{value || '-'}</WText>
    <WText type="medium9" style={styles.statBoxLabel}>{label}</WText>
  </View>
);

const ProfileTile = ({ icon, label, value, highlight }: any) => (
  <View style={[styles.tileContainer, highlight && styles.tileHighlight]}>
    <View style={[styles.tileIconContainer, highlight && styles.tileIconHighlight]}>
      <MaterialIcon name={icon} size={22} color={highlight ? '#008A45' : '#008A45'} />
    </View>
    <View style={[styles.tileTextContainer, !highlight && styles.tileTextBorder]}>
      <WText type="medium10" style={styles.tileLabel}>{label}</WText>
      <WText type="medium16" style={[styles.tileValue, highlight && styles.tileValueHighlight]}>{value || '-'}</WText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    height: 176,
    backgroundColor: '#008A45',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
    marginBottom: 64, // To give space for the overlapping avatar
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 20,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -64,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  fullName: {
    color: '#1F2937',
  },
  dharmaName: {
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 16,
    minWidth: 80,
  },
  statBoxValue: {
    color: '#1F2937',
    textAlign: 'center',
  },
  statBoxLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F3F4F6',
  },
  detailsSection: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  tileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tileHighlight: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 16,
    borderColor: '#DCFCE7',
    borderWidth: 1,
  },
  tileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#E8F5E9',
  },
  tileIconHighlight: {
    backgroundColor: '#FFFFFF',
  },
  tileTextContainer: {
    flex: 1,
  },
  tileTextBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    paddingBottom: 12,
  },
  tileLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tileValue: {
    color: '#374151',
    marginTop: 2,
  },
  tileValueHighlight: {
    color: '#008A45',
  },
  footer: {
    marginTop: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  }
});

export default ProfileScreen;

import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import WText from '../Common/WText';
import { Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import Constants from '../Common/Constants';
import { MemberService, FirestoreMember } from '../services/firebase';
import Languages from '../Common/Languages';

interface Props {
  user: Member;
  onBack: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, onBack, onEdit, onLogout }) => {
  const [profile, setProfile] = useState<FirestoreMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.uid) {
      setLoading(false);
      return;
    }
    // Subscribe real-time từ Firestore
    const unsubscribe = MemberService.subscribeOne(user.uid, (member) => {
      setProfile(member);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.uid]);

  const data = profile ?? user;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008A45" />
      </View>
    );
  }

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
            <Image
              source={data.avatar ? { uri: data.avatar } : require('../Images/ic_user_default.png')}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <WText type="medium24" style={styles.fullName}>{data.fullName || '-'}</WText>
        {!!data.dharmaName && (
          <WText type="medium14" style={styles.dharmaName}>{data.dharmaName}</WText>
        )}

        <View style={styles.statsContainer}>
          <StatBox label={Languages.get('screen.profile.label_role')} value={(data as any).role || (data as any).position} />
          <View style={styles.statDivider} />
          <StatBox label={Languages.get('screen.profile.label_rank')} value={(data as any).rank} />
          <View style={styles.statDivider} />
          <StatBox label={Languages.get('screen.profile.label_department')} value={(data as any).department} />
        </View>
      </View>

      <View style={styles.detailsSection}>
        <ProfileTile icon="face" label={Languages.get('screen.profile.label_gender')} value={(data as any).gender} />
        <ProfileTile icon="email" label={Languages.get('screen.profile.label_email')} value={data.email} />
        <ProfileTile icon="phone" label={Languages.get('screen.profile.label_phone')} value={(data as any).phone} />
        <ProfileTile icon="calendar-today" label={Languages.get('screen.profile.label_join_date')} value={(data as any).joinDate} />
        <ProfileTile icon="stars" label={Languages.get('screen.profile.label_promotion_rank')} value={(data as any).promotionRank} highlight />
        <ProfileTile icon="category" label={Languages.get('screen.profile.label_category')} value={(data as any).position} />
      </View>

      <View style={styles.footer}>
        <WText type="regular10" style={styles.footerText}>{Languages.get('screen.profile.footer')}</WText>
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
      <MaterialIcon name={icon} size={22} color="#008A45" />
    </View>
    <View style={[styles.tileTextContainer, !highlight && styles.tileTextBorder]}>
      <WText type="medium10" style={styles.tileLabel}>{label}</WText>
      <WText type="medium16" style={[styles.tileValue, highlight && styles.tileValueHighlight]}>{value || '-'}</WText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
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
    marginBottom: 64,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  iconButton: {
    height: Constants.MeasureSize(38),
    width: Constants.MeasureSize(38),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Constants.MeasureSize(30),
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
    paddingHorizontal: Constants.MeasureSize(20),
    paddingTop: Constants.MeasureSize(15),
  },
  fullName: {
    color: '#1F2937',
  },
  dharmaName: {
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 2,
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
    marginTop: 32,
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

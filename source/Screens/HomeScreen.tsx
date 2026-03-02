import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import WText from '../Common/WText';
import { Screen, Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import Constants from '../Common/Constants';
import Languages from '../Common/Languages';

interface Props {
  user: Member;
  onNavigate: (screen: Screen) => void;
  pendingApprovals?: number;
}

const HomeScreen: React.FC<Props> = ({ user, onNavigate, pendingApprovals = 0 }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../Images/ic_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <WText type="medium24" style={styles.titleText}>{Languages.get('screen.home.title')}</WText>
        {user.isAdmin && (
          <View style={styles.adminBadge}>
            <WText type="medium9" style={styles.adminBadgeText}>{Languages.get('screen.home.badge_admin')}</WText>
          </View>
        )}
        <View style={styles.divider} />
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="assignment-ind"
          title={Languages.get('screen.home.menu_profile_title')}
          description={Languages.get('screen.home.menu_profile_desc')}
          onClick={() => onNavigate(Screen.PROFILE)}
        />

        <MenuItem
          icon="groups"
          title={Languages.get('screen.home.menu_members_title')}
          description={Languages.get('screen.home.menu_members_desc')}
          onClick={() => onNavigate(Screen.MEMBER_LIST)}
        />

        <MenuItem
          icon="account-tree"
          title={Languages.get('screen.home.menu_family_tree_title')}
          description={Languages.get('screen.home.menu_family_tree_desc')}
          onClick={() => onNavigate(Screen.FAMILY_TREE)}
        />

        {user.isAdmin && (
          <MenuItem
            icon="verified-user"
            title={Languages.get('screen.home.menu_approval_title')}
            description={Languages.get('screen.home.menu_approval_desc')}
            onClick={() => onNavigate(Screen.APPROVAL)}
            badge={pendingApprovals > 0 ? pendingApprovals : undefined}
          />
        )}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            onPress={() => onNavigate(Screen.LOGIN)}
            style={styles.logoutButton}
            activeOpacity={0.8}
          >
            <MaterialIcon name="logout" size={20} color="#DC2626" />
            <WText type="medium14" style={styles.logoutText}>{Languages.get('screen.home.btn_logout')}</WText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <WText type="medium10" style={styles.footerText}>{Languages.get('screen.home.footer')}</WText>
      </View>
    </ScrollView>
  );
};

interface MenuItemProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  badge?: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, description, onClick, badge }) => (
  <TouchableOpacity onPress={onClick} style={styles.menuItem} activeOpacity={0.8}>
    <View style={styles.menuIconContainer}>
      <MaterialIcon name={icon} color="#008A45" size={28} />
    </View>
    <View style={styles.menuTextContainer}>
      <WText type="medium16" style={styles.menuTitle}>{title}</WText>
      <WText type="medium10" style={styles.menuDesc}>{description}</WText>
    </View>

    {badge !== undefined && badge > 0 && (
      <View style={styles.badgeContainer}>
        <WText type="medium10" style={styles.badgeText}>{badge}</WText>
      </View>
    )}

    <View style={styles.chevronContainer}>
      <MaterialIcon name="chevron-right" color="rgba(0, 138, 69, 0.3)" size={18} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    minHeight: '100%',
  },
  header: {
    paddingTop: Constants.MeasureSize(Constants.IS_IOS ? 40 : 80),
    paddingBottom: Constants.MeasureSize(Constants.IS_IOS ? 20 : 48),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 4,
    borderWidth: 1,
    borderColor: '#f9fafb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleText: {
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
  },
  adminBadge: {
    marginTop: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  adminBadgeText: {
    color: '#b45309',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    width: 48,
    height: 4,
    backgroundColor: '#008A45',
    marginTop: 8,
    borderRadius: 999,
    opacity: 0.2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  menuItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(232, 245, 233, 0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 138, 69, 0.05)',
    marginBottom: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: '#FFFFFF',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#008A45',
  },
  menuDesc: {
    color: '#6b7280',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    opacity: 0.7,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
  },
  chevronContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 6,
    borderRadius: 999,
  },
  logoutContainer: {
    paddingTop: 32,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: 'rgba(254, 226, 226, 0.5)',
  },
  logoutText: {
    color: '#DC2626',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 12,
  },
  footer: {
    paddingBottom: 48,
    paddingTop: 40,
    alignItems: 'center',
    opacity: 0.3,
  },
  footerText: {
    textTransform: 'uppercase',
    color: '#9ca3af',
    letterSpacing: 2,
  }
});

export default HomeScreen;

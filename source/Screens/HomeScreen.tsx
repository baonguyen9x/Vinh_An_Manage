import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Screen, Member } from '../../types';
import { MaterialIcon } from '../Common/Utils';

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
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg/512px-Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg.png" }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.titleText}>GĐPT VĨNH AN</Text>
        {user.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Quản trị viên</Text>
          </View>
        )}
        <View style={styles.divider} />
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <MenuItem
          icon="assignment-ind"
          title="Hồ sơ phật tử"
          description="Thông tin cá nhân & sinh hoạt"
          onClick={() => onNavigate(Screen.PROFILE)}
        />

        <MenuItem
          icon="groups"
          title="Danh sách thành viên"
          description="Tra cứu huynh trưởng & đoàn sinh"
          onClick={() => onNavigate(Screen.MEMBER_LIST)}
        />

        <MenuItem
          icon="account-tree"
          title="Hệ thống Gia Phả"
          description="Sơ đồ tổ chức đơn vị"
          onClick={() => onNavigate(Screen.FAMILY_TREE)}
        />

        {user.isAdmin && (
          <MenuItem
            icon="verified-user"
            title="Phê duyệt"
            description="Duyệt yêu cầu thêm thành viên"
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
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Management System v1.0.5</Text>
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
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuDesc}>{description}</Text>
    </View>

    {badge !== undefined && badge > 0 && (
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{badge}</Text>
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
    paddingTop: 64,
    paddingBottom: 48,
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
    fontWeight: '900',
    fontSize: 24,
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
    fontSize: 9,
    fontWeight: '900',
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
    fontWeight: 'bold',
    color: '#008A45',
    fontSize: 16,
  },
  menuDesc: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
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
    fontSize: 10,
    fontWeight: '900',
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
    fontWeight: '900',
    fontSize: 14,
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
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#9ca3af',
    letterSpacing: 2,
  }
});

export default HomeScreen;

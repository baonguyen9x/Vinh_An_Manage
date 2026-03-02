import React from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import WText from '../Common/WText';
import { ApprovalRequest } from '../../types';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  requests: ApprovalRequest[];
  onBack: () => void;
  onAction: (id: string) => void;
}

const ApprovalScreen: React.FC<Props> = ({ requests, onBack, onAction }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={20} color="#008A45" />
          </TouchableOpacity>
          <WText type="medium18" style={styles.headerTitle}>Phê duyệt yêu cầu</WText>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {requests.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <MaterialIcon name="task-alt" size={64} color="#D1D5DB" />
              <WText type="medium14" style={styles.emptyStateText}>Tất cả đã được xử lý</WText>
            </View>
          ) : (
            requests.map(req => (
              <View key={req.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.userInfoContainer}>
                    <View style={styles.avatarPlaceholder}>
                      <MaterialIcon name="person-add" size={24} color="#008A45" />
                    </View>
                    <View style={styles.userNameContainer}>
                      <WText type="medium14" style={styles.fullNameText}>{req.memberData.fullName}</WText>
                      <WText type="medium11" style={styles.dharmaNameText}>PD: {req.memberData.dharmaName}</WText>
                    </View>
                  </View>
                  <WText type="medium9" style={styles.dateText}>{req.requestDate}</WText>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoBox}>
                    <WText type="medium10" style={styles.infoLabel}>Ngành: <WText type="regular10" style={styles.infoValue}>{req.memberData.department}</WText></WText>
                  </View>
                  <View style={styles.infoBox}>
                    <WText type="medium10" style={styles.infoLabel}>Chức vụ: <WText type="regular10" style={styles.infoValue}>{req.memberData.position}</WText></WText>
                  </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={() => onAction(req.id)}
                    style={styles.rejectButton}
                    activeOpacity={0.8}
                  >
                    <WText type="medium11" style={styles.rejectButtonText}>Từ chối</WText>
                  </TouchableOpacity>
                  <View style={{ width: 8 }} />
                  <TouchableOpacity
                    onPress={() => onAction(req.id)}
                    style={styles.approveButton}
                    activeOpacity={0.8}
                  >
                    <WText type="medium11" style={styles.approveButtonText}>Phê duyệt</WText>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footerContainer}>
          <WText type="medium9" style={styles.footerText}>Hệ thống bảo mật nội bộ</WText>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 30,
  },
  backButton: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    opacity: 0.3,
  },
  emptyStateText: {
    marginTop: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userNameContainer: {
    flex: 1,
  },
  fullNameText: {
    color: '#1A3A5F',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dharmaNameText: {
    color: '#008A45',
  },
  dateText: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 8,
    borderRadius: 12,
  },
  infoLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  infoValue: {
    color: '#374151',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  rejectButtonText: {
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#008A45',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#008A45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  approveButtonText: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    opacity: 0.2,
  },
  footerText: {
    textTransform: 'uppercase',
    letterSpacing: 3,
  }
});

export default ApprovalScreen;

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ApprovalRequest } from '../../types';
import { MaterialIcon } from '../Common/Utils';

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
          <Text style={styles.headerTitle}>Phê duyệt yêu cầu</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {requests.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <MaterialIcon name="task-alt" size={64} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>Tất cả đã được xử lý</Text>
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
                      <Text style={styles.fullNameText}>{req.memberData.fullName}</Text>
                      <Text style={styles.dharmaNameText}>PD: {req.memberData.dharmaName}</Text>
                    </View>
                  </View>
                  <Text style={styles.dateText}>{req.requestDate}</Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Ngành: <Text style={styles.infoValue}>{req.memberData.department}</Text></Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.infoLabel}>Chức vụ: <Text style={styles.infoValue}>{req.memberData.position}</Text></Text>
                  </View>
                </View>

                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    onPress={() => onAction(req.id)}
                    style={styles.rejectButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.rejectButtonText}>Từ chối</Text>
                  </TouchableOpacity>
                  <View style={{ width: 8 }} />
                  <TouchableOpacity
                    onPress={() => onAction(req.id)}
                    style={styles.approveButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.approveButtonText}>Phê duyệt</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Hệ thống bảo mật nội bộ</Text>
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
    fontWeight: '900',
    fontSize: 18,
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
    fontWeight: 'bold',
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
    fontWeight: '900',
    color: '#1A3A5F',
    textTransform: 'uppercase',
    fontSize: 14,
    marginBottom: 2,
  },
  dharmaNameText: {
    fontSize: 11,
    color: '#008A45',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
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
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
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
    fontWeight: '900',
    fontSize: 11,
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
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  footerContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    opacity: 0.2,
  },
  footerText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
  }
});

export default ApprovalScreen;

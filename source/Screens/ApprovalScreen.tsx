import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, StatusBar } from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApprovalService, AuthService } from '../services/firebase';
import { FirestoreApprovalRequest } from '../services/firebase/types';
import Languages from '../Common/Languages';
import WConfirmModal from '../Common/WConfirmModal';

interface Props {
  onBack: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ApprovalScreen: React.FC<Props> = ({ onBack, showToast }) => {
  const [requests, setRequests] = useState<FirestoreApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Custom Modal State
  const [confirmData, setConfirmData] = useState<{
    visible: boolean;
    type: 'approve' | 'reject';
    id: string;
    fullName: string;
  }>({
    visible: false,
    type: 'approve',
    id: '',
    fullName: ''
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    // Lắng nghe danh sách yêu cầu phê duyệt real-time
    const unsubscribe = ApprovalService.subscribePending((data) => {
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string, fullName: string) => {
    setConfirmData({
      visible: true,
      type: 'approve',
      id,
      fullName
    });
  };

  const handleReject = async (id: string, fullName: string) => {
    setConfirmData({
      visible: true,
      type: 'reject',
      id,
      fullName
    });
  };

  const processConfirm = async () => {
    const admin = AuthService.getCurrentUser();
    if (!admin) return;

    const { type, id } = confirmData;
    setConfirmData(prev => ({ ...prev, visible: false }));
    setProcessingId(id);

    if (type === 'approve') {
      try {
        await ApprovalService.approve(id, admin.uid);
        showToast(Languages.get('screen.approval.toast_approve_success'), 'success');
      } catch (error) {
        console.error(error);
        showToast(Languages.get('screen.approval.toast_approve_error'), 'error');
      } finally {
        setProcessingId(null);
      }
    } else {
      try {
        await ApprovalService.reject(id, admin.uid);
        showToast(Languages.get('screen.approval.toast_reject_success'), 'info');
      } catch (error) {
        console.error(error);
        showToast(Languages.get('screen.approval.toast_reject_error'), 'error');
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <MaterialIcon name="arrow-back" size={20} color="#008A45" />
          </TouchableOpacity>
          <WText type="medium16" style={styles.headerTitle}>
            {Languages.get('screen.approval.title')}
          </WText>
          <View style={{ width: 38 }} />
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#008A45" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {requests.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <MaterialIcon name="task-alt" size={64} color="#D1D5DB" />
                <WText type="medium14" style={styles.emptyStateText}>{Languages.get('screen.approval.empty')}</WText>
              </View>
            ) : (
              requests.map(req => {
                const isExpanded = expandedId === req.id;
                const initials = (req.memberData.fullName || '?')
                  .split(' ')
                  .slice(-2)
                  .map((w: string) => w[0])
                  .join('')
                  .toUpperCase();

                return (
                  <TouchableOpacity
                    key={req.id}
                    style={styles.card}
                    activeOpacity={0.9}
                    onPress={() => toggleExpand(req.id)}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.userInfoContainer}>
                        <View style={styles.avatarPlaceholder}>
                          <WText type="medium16" style={styles.initialsText}>{initials}</WText>
                        </View>
                        <View style={styles.userNameContainer}>
                          <WText type="medium14" style={styles.fullNameText}>{req.memberData.fullName}</WText>
                          <WText type="medium11" style={styles.emailText}>{req.memberData.email}</WText>
                          <WText type="medium9" style={styles.dateText}>
                            {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString('vi-VN') : Languages.get('screen.approval.date_new')}
                          </WText>
                        </View>
                      </View>
                      <View style={styles.expandIconContainer}>
                        <MaterialIcon
                          name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                          size={24}
                          color="#9CA3AF"
                        />
                      </View>
                    </View>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={styles.divider} />
                        <View style={styles.detailRow}>
                          <WText type="medium11" style={styles.detailLabel}>{Languages.get('screen.approval.label_dharma_name')}</WText>
                          <WText type="medium12" style={styles.detailValue}>{req.memberData.dharmaName || '---'}</WText>
                        </View>
                        <View style={styles.detailRow}>
                          <WText type="medium11" style={styles.detailLabel}>{Languages.get('screen.approval.label_gender')}</WText>
                          <WText type="medium12" style={styles.detailValue}>{req.memberData.gender || '---'}</WText>
                        </View>
                        <View style={styles.detailRow}>
                          <WText type="medium11" style={styles.detailLabel}>{Languages.get('screen.approval.label_position')}</WText>
                          <WText type="medium12" style={styles.detailValue}>{req.memberData.position || '---'}</WText>
                        </View>
                        {(req.memberData.department || req.memberData.role) && (
                          <View style={styles.detailRow}>
                            <WText type="medium11" style={styles.detailLabel}>{Languages.get('screen.approval.label_role_dept')}</WText>
                            <WText type="medium12" style={styles.detailValue}>
                              {[req.memberData.role, req.memberData.department].filter(Boolean).join(' - ')}
                            </WText>
                          </View>
                        )}
                        <View style={styles.detailRow}>
                          <WText type="medium11" style={styles.detailLabel}>{Languages.get('screen.approval.label_req_type')}</WText>
                          <WText type="medium12" style={[styles.detailValue, { color: req.uid ? '#D97706' : '#008A45' }]}>
                            {req.uid ? Languages.get('screen.approval.type_update') : Languages.get('screen.approval.type_new')}
                          </WText>
                        </View>
                      </View>
                    )}

                    <View style={styles.actionButtonsContainer}>
                      <TouchableOpacity
                        onPress={() => handleReject(req.id, req.memberData.fullName)}
                        style={styles.rejectButton}
                        disabled={!!processingId}
                      >
                        <WText type="medium11" style={styles.rejectButtonText}>{Languages.get('screen.approval.btn_reject')}</WText>
                      </TouchableOpacity>
                      <View style={{ width: 12 }} />
                      <TouchableOpacity
                        onPress={() => handleApprove(req.id, req.memberData.fullName)}
                        style={styles.approveButton}
                        disabled={!!processingId}
                      >
                        {processingId === req.id ? (
                          <ActivityIndicator color="#FFF" size="small" />
                        ) : (
                          <WText type="medium11" style={styles.approveButtonText}>{Languages.get('screen.approval.btn_approve')}</WText>
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}

        <View style={styles.footerContainer}>
          <WText type="medium9" style={styles.footerText}>{Languages.get('screen.approval.footer')}</WText>
        </View>
      </View>

      {/* Custom Confirm Modal */}
      <WConfirmModal
        visible={confirmData.visible}
        type={confirmData.type}
        title={confirmData.type === 'approve' ? Languages.get('screen.approval.modal_approve_title') : Languages.get('screen.approval.modal_reject_title')}
        message={confirmData.type === 'approve'
          ? Languages.get('screen.approval.modal_approve_msg', { name: confirmData.fullName })
          : Languages.get('screen.approval.modal_reject_msg', { name: confirmData.fullName })}
        onCancel={() => setConfirmData(prev => ({ ...prev, visible: false }))}
        onConfirm={processConfirm}
        confirmText={confirmData.type === 'approve' ? Languages.get('screen.approval.btn_approve') : Languages.get('screen.approval.btn_reject')}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
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
  initialsText: {
    color: '#008A45',
  },
  userNameContainer: {
    flex: 1,
  },
  fullNameText: {
    color: '#1A3A5F',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  emailText: {
    color: '#008A45',
    fontSize: 11,
    marginBottom: 2,
  },
  dharmaNameText: {
    color: '#008A45',
  },
  dateText: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  expandIconContainer: {
    paddingLeft: 8,
  },
  expandedContent: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#9CA3AF',
    textTransform: 'uppercase',
    flex: 1,
  },
  detailValue: {
    color: '#374151',
    flex: 2,
    textAlign: 'right',
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

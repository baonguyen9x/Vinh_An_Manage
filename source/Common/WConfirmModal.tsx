import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import WText from './WText';
import { MaterialIcon } from './Utils';
import Languages from './Languages';

interface ConfirmModalProps {
    visible: boolean;
    type: 'approve' | 'reject' | 'warning' | 'info' | 'logout';
    title: string;
    message: string | React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    iconName?: string;
}

const WConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    type,
    title,
    message,
    onCancel,
    onConfirm,
    cancelText,
    confirmText,
    iconName,
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'approve':
                return { name: iconName || 'check-circle', color: '#008A45', bgColor: '#E8F5E9' };
            case 'reject':
            case 'warning':
            case 'logout':
                return { name: iconName || 'warning', color: '#EF4444', bgColor: '#FEE2E2' };
            case 'info':
                return { name: iconName || 'info', color: '#3B82F6', bgColor: '#DBEAFE' };
            default:
                return { name: iconName || 'info', color: '#6B7280', bgColor: '#F3F4F6' };
        }
    };

    const iconConfig = getIconConfig();
    const defaultConfirmColor = type === 'approve' ? '#008A45' : '#EF4444';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={[styles.modalIconContainer, { backgroundColor: iconConfig.bgColor }]}>
                        <MaterialIcon
                            name={iconConfig.name}
                            size={32}
                            color={iconConfig.color}
                        />
                    </View>

                    <WText type="medium18" style={styles.modalTitle}>
                        {title}
                    </WText>

                    <View style={styles.messageContainer}>
                        {typeof message === 'string' ? (
                            <WText type="regular14" style={styles.modalMessage}>
                                {message}
                            </WText>
                        ) : (
                            message
                        )}
                    </View>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalCancelButton}
                            onPress={onCancel}
                        >
                            <WText type="medium14" style={styles.modalCancelText}>
                                {cancelText || Languages.get('system.dialog.cancel')}
                            </WText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.modalConfirmButton,
                                { backgroundColor: defaultConfirmColor }
                            ]}
                            onPress={onConfirm}
                        >
                            <WText type="medium14" style={styles.modalConfirmText}>
                                {confirmText || Languages.get('system.dialog.confirm')}
                            </WText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        color: '#111827',
        marginBottom: 8,
        textAlign: 'center',
    },
    messageContainer: {
        width: '100%',
        marginBottom: 24,
    },
    modalMessage: {
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalCancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#4B5563',
    },
    modalConfirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: '#FFFFFF',
    }
});

export default WConfirmModal;

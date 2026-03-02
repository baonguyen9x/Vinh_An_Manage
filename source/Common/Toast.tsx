import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { View, StyleSheet, Animated, Platform, TouchableOpacity } from 'react-native';
import WText from './WText';
import { MaterialIcon } from './Utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastRef {
    show: (message: string, type?: ToastType) => void;
}

const Toast = forwardRef<ToastRef, {}>((props, ref) => {
    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [visible, setVisible] = useState(false);

    const translateY = useRef(new Animated.Value(-150)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const hide = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -150,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setVisible(false);
        });
    };

    useImperativeHandle(ref, () => ({
        show: (msg: string, t: ToastType = 'success') => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            setMessage(msg);
            setType(t);
            setVisible(true);

            // Reset animation for multiple triggers
            translateY.setValue(-150);
            opacity.setValue(0);

            // Animate in
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: insets.top + (Platform.OS === 'ios' ? 12 : 16),
                    useNativeDriver: true,
                    tension: 60,
                    friction: 8,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();

            // Auto hide
            timeoutRef.current = setTimeout(() => {
                hide();
            }, 3500);
        }
    }));

    if (!visible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'error';
            case 'info': return 'info';
            default: return 'notifications';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return '#008A45';
            case 'error': return '#EF4444';
            case 'info': return '#3B82F6';
            default: return '#1F2937';
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return '#F0FDF4';
            case 'error': return '#FEF2F2';
            case 'info': return '#EFF6FF';
            default: return '#FFFFFF';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: getBgColor(),
                    borderColor: getColor() + '30',
                }
            ]}
        >
            <View style={[styles.iconBox, { backgroundColor: getColor() + '15' }]}>
                <MaterialIcon name={getIcon()} size={20} color={getColor()} />
            </View>
            <View style={styles.textContainer}>
                <WText type="medium13" style={[styles.text, { color: getColor() }]}>
                    {message}
                </WText>
            </View>
            <TouchableOpacity onPress={hide} style={styles.closeBtn}>
                <MaterialIcon name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 10000,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 18,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 10,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        lineHeight: 18,
    },
    closeBtn: {
        padding: 6,
        marginLeft: 8,
    }
});

export default Toast;

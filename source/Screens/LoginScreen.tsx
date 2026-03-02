import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';

interface Props {
  onLoginSuccess: (isAdmin: boolean) => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLoginSuccess, onRegister }) => {
  const [user, setUser] = useState('demo123');
  const [pass, setPass] = useState('demo123');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Tài khoản demo123 được nâng cấp làm Admin
    if (user === 'demo123' && pass === 'demo123') {
      setError('');
      onLoginSuccess(true); // Trạng thái Admin = true
    }
    // Tài khoản test1234 là Member
    else if (user === 'test1234' && pass === 'test1234') {
      setError('');
      onLoginSuccess(false); // Trạng thái Admin = false
    }
    else if (user === 'nguyenvanan' && pass === '123456') {
      setError('');
      onLoginSuccess(false); // Trạng thái Admin = false
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Image
                source={require('../Images/ic_logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <WText type="medium24" style={styles.titleText}>GĐPT Vĩnh An</WText>
            <WText type="medium14" style={styles.subtitleText}>Tinh tấn - Hỷ xả</WText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <WText type="medium10" style={styles.inputLabel}>Tên đăng nhập</WText>
              <View style={styles.inputWrapper}>
                <MaterialIcon name="person" color="#008A45" size={20} />
                <TextInput
                  style={styles.input}
                  value={user}
                  onChangeText={(text) => { setUser(text); setError(''); }}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <WText type="medium10" style={styles.inputLabel}>Mật khẩu</WText>
              <View style={styles.inputWrapper}>
                <MaterialIcon name="lock" color="#008A45" size={20} />
                <TextInput
                  style={styles.input}
                  value={pass}
                  onChangeText={(text) => { setPass(text); setError(''); }}
                  secureTextEntry
                />
              </View>
            </View>

            {!!error && (
              <WText type="medium11" style={styles.errorText}>{error}</WText>
            )}

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
              activeOpacity={0.8}
            >
              <WText type="medium14" style={styles.loginButtonText}>ĐĂNG NHẬP</WText>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <TouchableOpacity onPress={onRegister}>
                <WText type="medium12" style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</WText>
              </TouchableOpacity>
            </View>
          </View>

          <WText type="regular10" style={styles.versionText}>
            Version v1.0.0
          </WText>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logoOuter: {
    marginBottom: 32,
  },
  logoInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 4,
    borderWidth: 2,
    borderColor: 'rgba(0, 138, 69, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#008A45',
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 4,
  },
  inputWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    padding: 0,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#008A45',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#008A45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#FFFFFF',
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#008A45',
  },
  versionText: {
    marginTop: 48,
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 3,
  }
});

export default LoginScreen;

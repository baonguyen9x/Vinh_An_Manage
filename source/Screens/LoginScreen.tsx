import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import WText from '../Common/WText';
import { MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/firebase';
import Languages from '../Common/Languages';

interface Props {
  onLoginSuccess: (isAdmin: boolean, uid: string) => void;
  onRegister: () => void;
}

const LoginScreen: React.FC<Props> = ({ onLoginSuccess, onRegister }) => {
  const [email, setEmail] = useState('anhno3qt@gmail.com');
  const [pass, setPass] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      setError(Languages.get('screen.login.error_empty'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await AuthService.login(email.trim(), pass);
      const isAdmin = await AuthService.isAdmin(user.uid);
      onLoginSuccess(isAdmin, user.uid);
    } catch (e: any) {
      console.error('[Login Error] code:', e.code, '| message:', e.message);
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError(Languages.get('screen.login.error_invalid_credential'));
      } else if (e.code === 'auth/invalid-email') {
        setError(Languages.get('screen.login.error_invalid_email'));
      } else if (e.code === 'auth/too-many-requests') {
        setError(Languages.get('screen.login.error_too_many_requests'));
      } else if (e.code === 'auth/user-disabled') {
        setError(Languages.get('screen.login.error_user_disabled'));
      } else if (e.code === 'auth/network-request-failed') {
        setError(Languages.get('screen.login.error_network'));
      } else {
        setError(`Lỗi: ${e.code || e.message || 'Không xác định'}`);
      }
    } finally {
      setLoading(false);
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
            <WText type="medium24" style={styles.titleText}>{Languages.get('screen.login.app_name')}</WText>
            <WText type="medium14" style={styles.subtitleText}>{Languages.get('screen.login.slogan')}</WText>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <WText type="medium10" style={styles.inputLabel}>{Languages.get('screen.login.label_email')}</WText>
              <View style={styles.inputWrapper}>
                <MaterialIcon name="email" color="#008A45" size={20} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => { setEmail(text); setError(''); }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder={Languages.get('screen.login.placeholder_email')}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <WText type="medium10" style={styles.inputLabel}>{Languages.get('screen.login.label_password')}</WText>
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
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFFFFF" />
                : <WText type="medium14" style={styles.loginButtonText}>{Languages.get('screen.login.btn_login')}</WText>
              }
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <TouchableOpacity onPress={onRegister}>
                <WText type="medium12" style={styles.registerText}>{Languages.get('screen.login.register_hint')}</WText>
              </TouchableOpacity>
            </View>
          </View>

          <WText type="regular10" style={styles.versionText}>
            {Languages.get('screen.login.version')}
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

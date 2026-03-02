import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import WText from '../Common/WText';
import { GDPT_LOGO, MaterialIcon } from '../Common/Utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../services/firebase';
import Languages from '../Common/Languages';

interface Props {
  onBack: () => void;
  onRegisterSuccess: (isAdmin: boolean, uid: string) => void;
}

const RegisterScreen: React.FC<Props> = ({ onBack, onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    password === confirmPassword;

  const handleRegister = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setError('');

    try {
      const user = await AuthService.register(email.trim(), password, fullName.trim());
      // Khi đăng ký thành công, user tự động đăng nhập với role user (isAdmin = false)
      onRegisterSuccess(false, user.uid);
    } catch (e: any) {
      console.error(e);
      if (e.code === 'auth/email-already-in-use') {
        setError(Languages.get('screen.register.error_email_in_use'));
      } else if (e.code === 'auth/invalid-email') {
        setError(Languages.get('screen.register.error_invalid_email'));
      } else if (e.code === 'auth/weak-password') {
        setError(Languages.get('screen.register.error_weak_password'));
      } else {
        setError(Languages.get('screen.register.error_unknown'));
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
          <View style={styles.logoContainer}>
            <GDPT_LOGO width={112} height={112} />
          </View>

          <WText type="medium20" style={styles.titleText}>{Languages.get('screen.register.title')}</WText>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <MaterialIcon name="person-outline" color="#9CA3AF" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={Languages.get('screen.register.placeholder_fullname')}
                placeholderTextColor="#9CA3AF"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcon name="mail-outline" color="#9CA3AF" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={Languages.get('screen.register.placeholder_email')}
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcon name="lock-outline" color="#9CA3AF" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={Languages.get('screen.register.placeholder_password')}
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcon name="lock-outline" color="#9CA3AF" size={20} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder={Languages.get('screen.register.placeholder_confirm_password')}
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {!!error && (
              <WText type="regular12" style={styles.errorText}>{error}</WText>
            )}

            <TouchableOpacity
              onPress={handleRegister}
              style={[
                styles.registerButton,
                isFormValid && !loading ? styles.registerButtonActive : styles.registerButtonDisabled
              ]}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <WText type="medium16" style={styles.registerButtonText}>{Languages.get('screen.register.btn_register')}</WText>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <WText type="regular14" style={styles.loginHint}>{Languages.get('screen.register.login_hint')}</WText>
              <TouchableOpacity onPress={onBack}>
                <WText type="medium14" style={styles.loginText}>{Languages.get('screen.register.btn_back_login')}</WText>
              </TouchableOpacity>
            </View>
          </View>
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
  logoContainer: {
    marginBottom: 32,
  },
  titleText: {
    color: '#008A45',
    marginBottom: 32,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000000',
    padding: 0,
  },
  registerButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  registerButtonActive: {
    backgroundColor: '#008A45',
  },
  registerButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  registerButtonText: {
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginHint: {
    color: '#6B7280',
  },
  loginText: {
    color: '#008A45',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  }
});

export default RegisterScreen;

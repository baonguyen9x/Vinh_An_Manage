import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
                source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg/512px-Gia_%C4%90%C3%ACnh_Ph%E1%BA%ADt_T%E1%BB%AD_Vi%E1%BB%87t_Nam_logo.svg.png" }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>GĐPT Vĩnh An</Text>
            <Text style={styles.subtitleText}>Tinh tấn - Hỷ xả</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên đăng nhập</Text>
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
              <Text style={styles.inputLabel}>Mật khẩu</Text>
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
              <Text style={styles.errorText}>{error}</Text>
            )}

            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <TouchableOpacity onPress={onRegister}>
                <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.versionText}>
            Version 1.0.5 (Admin Edition)
          </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008A45',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  subtitleText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '500',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
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
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
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
    fontWeight: 'bold',
    fontSize: 14,
  },
  registerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#008A45',
    fontWeight: 'bold',
    fontSize: 12,
  },
  versionText: {
    marginTop: 48,
    fontSize: 10,
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 3,
  }
});

export default LoginScreen;

import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';
import { Screen, Member, ApprovalRequest } from './types';
import SplashScreen from './source/Screens/SplashScreen';
import LoginScreen from './source/Screens/LoginScreen';
import RegisterScreen from './source/Screens/RegisterScreen';
import HomeScreen from './source/Screens/HomeScreen';
import ProfileScreen from './source/Screens/ProfileScreen';
import EditProfileScreen from './source/Screens/EditProfileScreen';
import MemberListScreen from './source/Screens/MemberListScreen';
import FamilyTreeScreen from './source/Screens/FamilyTreeScreen';
import AddMemberScreen from './source/Screens/AddMemberScreen';
import ApprovalScreen from './source/Screens/ApprovalScreen';
import { ApprovalService } from './source/services/firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const INITIAL_USER: Member = {
  id: '',
  fullName: '',
  dharmaName: '',
  gender: 'Nam',
  email: '',
  phone: '',
  joinDate: '',
  avatar: '',
  rank: '',
  position: '',
  role: '',
  department: '',
  promotionRank: '',
  status: 'active',
  isAdmin: false
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [user, setUser] = useState<Member>(INITIAL_USER);

  // Khởi tạo danh sách yêu cầu phê duyệt trống
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    if (currentScreen !== Screen.SPLASH) return;

    const handleSplash = async () => {
      // Hiển thị splash tối thiểu 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));

      try {
        const firebaseUser = auth().currentUser;
        console.log('Firebase Auth Status:', firebaseUser ? `Logged in as ${firebaseUser.email}` : 'Not logged in');

        if (firebaseUser) {
          // Đã login trước đó → load thông tin từ Firestore
          const memberDoc = await firestore().collection('members').doc(firebaseUser.uid).get();
          const data = memberDoc.data();
          setUser({
            ...INITIAL_USER,
            uid: firebaseUser.uid,
            fullName: data?.fullName || firebaseUser.displayName || 'Thành viên',
            email: firebaseUser.email || '',
            avatar: data?.avatar || INITIAL_USER.avatar,
            isAdmin: data?.isAdmin || false,
            role: data?.role || '',
            rank: data?.rank || '',
            position: data?.position || '',
            department: data?.department || '',
            dharmaName: data?.dharmaName || '',
            gender: data?.gender || 'Nam',
            phone: data?.phone || '',
            joinDate: data?.joinDate || '',
            promotionRank: data?.promotionRank || '',
            status: data?.status || 'active',
          });
          setCurrentScreen(Screen.HOME);
        } else {
          setCurrentScreen(Screen.LOGIN);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setCurrentScreen(Screen.LOGIN);
      }
    };

    handleSplash();
  }, [currentScreen]);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleLoginSuccess = (isAdmin: boolean, uid: string) => {
    setUser({
      ...INITIAL_USER,
      uid: uid,
      fullName: isAdmin ? 'Admin Vĩnh An' : 'Thành viên',
      isAdmin: isAdmin
    });
    navigate(Screen.HOME);
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(INITIAL_USER);
      navigate(Screen.LOGIN);
    }
  };

  const handleAddMemberRequest = async (memberData: any) => {
    try {
      if (!user.uid) return;
      await ApprovalService.submitRequest(
        memberData,
        user.uid,
        user.fullName
      );
      navigate(Screen.FAMILY_TREE);
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case Screen.SPLASH: return <SplashScreen />;
      case Screen.LOGIN: return <LoginScreen onLoginSuccess={handleLoginSuccess} onRegister={() => navigate(Screen.REGISTER)} />;
      case Screen.REGISTER: return <RegisterScreen onBack={() => navigate(Screen.LOGIN)} onRegisterSuccess={handleLoginSuccess} />;
      case Screen.HOME: return <HomeScreen user={user} onNavigate={navigate} pendingApprovals={approvals.length} />;
      case Screen.PROFILE: return <ProfileScreen user={user} onBack={() => navigate(Screen.HOME)} onEdit={() => navigate(Screen.EDIT_PROFILE)} onLogout={handleLogout} />;
      case Screen.EDIT_PROFILE: return <EditProfileScreen user={user} onBack={() => navigate(Screen.PROFILE)} onUpdate={(u) => { setUser(u); navigate(Screen.PROFILE); }} />;
      case Screen.MEMBER_LIST: return <MemberListScreen onBack={() => navigate(Screen.HOME)} />;
      case Screen.FAMILY_TREE: return <FamilyTreeScreen onBack={() => navigate(Screen.HOME)} onAdd={() => navigate(Screen.ADD_MEMBER)} />;
      case Screen.ADD_MEMBER: return <AddMemberScreen onBack={() => navigate(Screen.FAMILY_TREE)} onSave={handleAddMemberRequest} />;
      case Screen.APPROVAL: return <ApprovalScreen onBack={() => navigate(Screen.HOME)} />;
      default: return <HomeScreen user={user} onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
        translucent={false}
      />
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F7',
  },
  content: {
    flex: 1,
    position: 'relative'
  }
});

export default App;

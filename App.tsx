import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import { ApprovalService, MemberService } from './source/services/firebase';
import Languages from './source/Common/Languages';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast, { ToastRef, ToastType } from './source/Common/Toast';

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
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [addMemberInitialData, setAddMemberInitialData] = useState<any>(null);
  const toastRef = useRef<ToastRef>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    toastRef.current?.show(message, type);
  };

  useEffect(() => {
    if (currentScreen !== Screen.SPLASH) return;

    const handleSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      try {
        const firebaseUser = auth().currentUser;
        if (firebaseUser) {
          const memberDoc = await firestore().collection('members').doc(firebaseUser.uid).get();
          const data = memberDoc.data();
          setUser({
            ...INITIAL_USER,
            uid: firebaseUser.uid,
            fullName: data?.fullName || firebaseUser.displayName || Languages.get('common.role_member'),
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

  const navigate = (screen: Screen) => {
    if (screen !== Screen.ADD_MEMBER) {
      setAddMemberInitialData(null);
    }
    setCurrentScreen(screen);
  };

  const navigateToAddMember = (initialData?: any) => {
    setAddMemberInitialData(initialData);
    setCurrentScreen(Screen.ADD_MEMBER);
  };

  const handleLoginSuccess = (isAdmin: boolean, uid: string) => {
    setUser({
      ...INITIAL_USER,
      uid: uid,
      fullName: isAdmin ? Languages.get('common.role_admin') : Languages.get('common.role_member'),
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

      if (user.isAdmin) {
        if (memberData.uid) {
          const { id, uid, ...updateData } = memberData;
          await MemberService.update(memberData.uid, updateData);
          showToast(Languages.get('screen.family_tree.assign_success'));
        } else {
          await MemberService.create(memberData);
          showToast(Languages.get('screen.add_member.msg_admin_success'));
        }
      } else {
        await ApprovalService.submitRequest(
          memberData,
          user.uid,
          user.fullName,
          memberData.uid
        );
        showToast(Languages.get('screen.add_member.msg_member_success'));
      }
      navigate(Screen.FAMILY_TREE);
    } catch (error) {
      console.error(error);
      showToast(Languages.get('system.msg.error_general'), 'error');
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
      case Screen.MEMBER_LIST: return <MemberListScreen onBack={() => navigate(Screen.HOME)} currentUid={user.uid} />;
      case Screen.FAMILY_TREE: return <FamilyTreeScreen onBack={() => navigate(Screen.HOME)} onAdd={navigateToAddMember} isAdmin={user.isAdmin} user={user} showToast={showToast} />;
      case Screen.ADD_MEMBER: return <AddMemberScreen onBack={() => navigate(Screen.FAMILY_TREE)} onSave={handleAddMemberRequest} isAdmin={user.isAdmin} initialData={addMemberInitialData} />;
      case Screen.APPROVAL: return <ApprovalScreen onBack={() => navigate(Screen.HOME)} showToast={showToast} />;
      default: return <HomeScreen user={user} onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />
        <View style={styles.content}>
          {renderContent()}
        </View>
        <Toast ref={toastRef} />
      </View>
    </SafeAreaProvider>
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

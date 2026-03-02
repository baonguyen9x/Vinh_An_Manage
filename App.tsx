import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
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

const INITIAL_USER: Member = {
  id: '',
  fullName: '',
  dharmaName: '',
  gender: 'Nam',
  email: '',
  phone: '',
  joinDate: '',
  avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
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
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => setCurrentScreen(Screen.LOGIN), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  const handleLoginSuccess = (isAdmin: boolean) => {
    setUser({
      ...INITIAL_USER,
      fullName: isAdmin ? 'Admin Vĩnh An' : 'Thành viên',
      isAdmin: isAdmin
    });
    navigate(Screen.HOME);
  };

  const handleAddMemberRequest = (memberData: Partial<Member>) => {
    const newRequest: ApprovalRequest = {
      id: `req_${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
      memberData: memberData
    };
    setApprovals(prev => [...prev, newRequest]);
    navigate(Screen.FAMILY_TREE);
  };

  const renderContent = () => {
    switch (currentScreen) {
      case Screen.SPLASH: return <SplashScreen />;
      case Screen.LOGIN: return <LoginScreen onLoginSuccess={handleLoginSuccess} onRegister={() => navigate(Screen.REGISTER)} />;
      case Screen.REGISTER: return <RegisterScreen onBack={() => navigate(Screen.LOGIN)} onRegister={() => navigate(Screen.LOGIN)} />;
      case Screen.HOME: return <HomeScreen user={user} onNavigate={navigate} pendingApprovals={approvals.length} />;
      case Screen.PROFILE: return <ProfileScreen user={user} onBack={() => navigate(Screen.HOME)} onEdit={() => navigate(Screen.EDIT_PROFILE)} onLogout={() => navigate(Screen.LOGIN)} />;
      case Screen.EDIT_PROFILE: return <EditProfileScreen user={user} onBack={() => navigate(Screen.PROFILE)} onUpdate={(u) => { setUser(u); navigate(Screen.PROFILE); }} />;
      case Screen.MEMBER_LIST: return <MemberListScreen onBack={() => navigate(Screen.HOME)} />;
      case Screen.FAMILY_TREE: return <FamilyTreeScreen onBack={() => navigate(Screen.HOME)} onAdd={() => navigate(Screen.ADD_MEMBER)} />;
      case Screen.ADD_MEMBER: return <AddMemberScreen onBack={() => navigate(Screen.FAMILY_TREE)} onSave={handleAddMemberRequest} />;
      case Screen.APPROVAL: return <ApprovalScreen requests={approvals} onBack={() => navigate(Screen.HOME)} onAction={(id) => setApprovals(prev => prev.filter(r => r.id !== id))} />;
      default: return <HomeScreen user={user} onNavigate={navigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

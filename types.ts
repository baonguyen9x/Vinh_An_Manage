
export enum Screen {
  SPLASH = 'SPLASH',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  EDIT_PROFILE = 'EDIT_PROFILE',
  MEMBER_LIST = 'MEMBER_LIST',
  FAMILY_TREE = 'FAMILY_TREE',
  ADD_MEMBER = 'ADD_MEMBER',
  APPROVAL = 'APPROVAL'
}

export interface Member {
  id: string;
  uid?: string;
  fullName: string;
  dharmaName: string; // Pháp danh
  gender: 'Nam' | 'Nữ';
  email: string;
  phone: string;
  joinDate: string;
  avatar: string;
  rank: string; // Bậc học
  position: string; // Phân loại
  role: string; // Chức vụ
  department: string; // Ngành
  promotionRank: string; // Cấp bậc
  status: 'active' | 'inactive' | 'on_leave';
  isAdmin?: boolean; // Quyền quản trị
  // Thông tin thọ cấp
  isOrdained?: boolean;
  ordinationDate?: string;
  ordinationLevel?: 'Cấp Tập' | 'Cấp Tín' | 'Cấp Tấn' | 'Cấp Dũng' | '';
}

export interface ApprovalRequest {
  id: string;
  memberData: Partial<Member>;
  requestDate: string;
}

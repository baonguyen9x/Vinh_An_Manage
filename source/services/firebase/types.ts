import { Timestamp } from '@react-native-firebase/firestore';

// ============================================================
// Firestore Data Types — khớp với structure trên Firebase
// ============================================================

export interface FirestoreMember {
    id: string;                     // document ID
    fullName: string;               // Họ tên
    dharmaName: string;             // Pháp danh
    gender: 'Nam' | 'Nữ';
    position: 'Huynh trưởng' | 'Đoàn sinh';
    department: string;             // Ngành Oanh / Ngành Thiếu / Ngành Thanh
    rank: string;                   // Bậc học
    role: string;                   // Chức vụ
    email: string;
    phone: string;
    avatar: string;
    joinDate: string;               // ISO date string
    status: 'active' | 'inactive';
    isAdmin: boolean;
    isOrdained: boolean;
    ordinationDate?: string;
    ordinationLevel?: string;
    promotionRank?: string;
    uid?: string;                   // Firebase Auth UID (nếu có account)
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface FirestoreApprovalRequest {
    id: string;
    memberData: Omit<FirestoreMember, 'id' | 'createdAt' | 'updatedAt'>;
    requestedBy: string;            // UID người gửi
    requestedByName: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: Timestamp;
    note?: string;
    createdAt: Timestamp;
}

import firestore from '@react-native-firebase/firestore';
import { FirestoreApprovalRequest, FirestoreMember } from './types';

const COLLECTION = 'approvals';

export class ApprovalService {
    // ─── Gửi yêu cầu thêm thành viên mới ────────────────────────
    static async submitRequest(
        memberData: Omit<FirestoreMember, 'id' | 'createdAt' | 'updatedAt'>,
        requestedBy: string,
        requestedByName: string
    ): Promise<string> {
        const ref = await firestore().collection(COLLECTION).add({
            memberData,
            requestedBy,
            requestedByName,
            status: 'pending',
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        return ref.id;
    }

    // ─── Lấy danh sách pending (dành cho Admin) ──────────────────
    static async getPending(): Promise<FirestoreApprovalRequest[]> {
        const snapshot = await firestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as FirestoreApprovalRequest));
    }

    // ─── Admin phê duyệt yêu cầu → tạo/kích hoạt member ───────────────
    static async approve(requestId: string, adminUid: string): Promise<void> {
        const requestRef = firestore().collection(COLLECTION).doc(requestId);
        const requestDoc = await requestRef.get();
        const request = requestDoc.data() as any; // Dùng any để linh hoạt với uid field

        const batch = firestore().batch();

        if (request.uid) {
            // Trường hợp 1: Phê duyệt một Account đã đăng ký (có UID)
            const userMemberRef = firestore().collection('members').doc(request.uid);
            batch.update(userMemberRef, {
                status: 'active',
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        } else {
            // Trường hợp 2: Admin tự thêm một member mới hoàn toàn (không có account)
            const newMemberRef = firestore().collection('members').doc();
            batch.set(newMemberRef, {
                ...request.memberData,
                status: 'active',
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        }

        // Cập nhật trạng thái approval
        batch.update(requestRef, {
            status: 'approved',
            reviewedBy: adminUid,
            reviewedAt: firestore.FieldValue.serverTimestamp(),
        });

        await batch.commit();
    }

    // ─── Admin từ chối yêu cầu ───────────────────────────────────
    static async reject(requestId: string, adminUid: string, note?: string): Promise<void> {
        await firestore().collection(COLLECTION).doc(requestId).update({
            status: 'rejected',
            reviewedBy: adminUid,
            reviewedAt: firestore.FieldValue.serverTimestamp(),
            note: note || '',
        });
    }

    // ─── Lắng nghe real-time pending count (cho badge) ───────────
    static subscribePendingCount(callback: (count: number) => void): () => void {
        return firestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .onSnapshot(snapshot => {
                callback(snapshot.size);
            });
    }

    // ─── Lắng nghe real-time pending list ────────────────────────
    static subscribePending(
        callback: (requests: FirestoreApprovalRequest[]) => void
    ): () => void {
        return firestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const requests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as FirestoreApprovalRequest));
                callback(requests);
            });
    }
}

import firestore from '@react-native-firebase/firestore';
import { FirestoreApprovalRequest, FirestoreMember } from './types';

const COLLECTION = 'approvals';

export class ApprovalService {
    static async submitRequest(
        memberData: any,
        requestedBy: string,
        requestedByName: string,
        uid?: string
    ): Promise<string> {
        // Kiểm tra xem đã có yêu cầu nào đang chờ (pending) cho UID này chưa
        if (uid) {
            const existing = await firestore()
                .collection(COLLECTION)
                .where('uid', '==', uid)
                .where('status', '==', 'pending')
                .get();

            if (!existing.empty) {
                // Nếu có, cập nhật lại yêu cầu cũ với data mới nhất
                const docId = existing.docs[0].id;
                await firestore().collection(COLLECTION).doc(docId).update({
                    memberData,
                    requestedBy,
                    requestedByName,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
                return docId;
            }
        }

        // Nếu chưa có hoặc không có UID (thêm mới), tạo request mới
        const ref = await firestore().collection(COLLECTION).add({
            memberData,
            requestedBy,
            requestedByName,
            uid: uid || null,
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
            .get();

        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as FirestoreApprovalRequest));

        // Sort client-side thay vì dùng orderBy để tránh lỗi thiếu Index
        return requests.sort((a, b) => {
            const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return timeB - timeA;
        });
    }

    static async approve(requestId: string, adminUid: string): Promise<void> {
        const requestRef = firestore().collection(COLLECTION).doc(requestId);
        const requestDoc = await requestRef.get();
        const request = requestDoc.data() as any;

        const batch = firestore().batch();

        if (request.uid) {
            // Cập nhật thông tin thành viên hiện có
            const userMemberRef = firestore().collection('members').doc(request.uid);
            batch.update(userMemberRef, {
                ...request.memberData,
                status: 'active',
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        } else {
            // Tạo thành viên mới
            const newMemberRef = firestore().collection('members').doc();
            batch.set(newMemberRef, {
                ...request.memberData,
                status: 'active',
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });
        }

        // Xóa sạch yêu cầu khỏi bảng phê duyệt sau khi đã xử lý
        batch.delete(requestRef);

        await batch.commit();
    }

    static async reject(requestId: string, adminUid: string, note?: string): Promise<void> {
        // Xóa yêu cầu khỏi bảng phê duyệt ngay khi từ chối
        await firestore().collection(COLLECTION).doc(requestId).delete();
    }

    // ─── Lắng nghe real-time pending count (cho badge) ───────────
    static subscribePendingCount(callback: (count: number) => void): () => void {
        return firestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .onSnapshot(
                snapshot => {
                    if (!snapshot) {
                        callback(0);
                        return;
                    }
                    callback(snapshot.size);
                },
                error => {
                    console.error('[ApprovalService] subscribePendingCount error:', error);
                    callback(0);
                }
            );
    }

    // ─── Lắng nghe real-time pending list ────────────────────────
    static subscribePending(
        callback: (requests: FirestoreApprovalRequest[]) => void
    ): () => void {
        return firestore()
            .collection(COLLECTION)
            .where('status', '==', 'pending')
            .onSnapshot(
                snapshot => {
                    if (!snapshot) {
                        callback([]);
                        return;
                    }
                    const requests = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as FirestoreApprovalRequest));

                    // Sort client-side thay vì dùng orderBy để tránh lỗi thiếu Index
                    requests.sort((a, b) => {
                        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                        return timeB - timeA;
                    });

                    callback(requests);
                },
                error => {
                    console.error('[ApprovalService] subscribePending error:', error);
                    callback([]);
                }
            );
    }
}

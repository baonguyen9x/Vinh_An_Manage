import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirestoreMember } from './types';

const COLLECTION = 'members';

export class MemberService {
    // ─── Lấy tất cả members (active) ─────────────────────────────
    static async getAll(): Promise<FirestoreMember[]> {
        const snapshot = await firestore()
            .collection(COLLECTION)
            .where('status', '==', 'active')
            .orderBy('fullName', 'asc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as FirestoreMember));
    }

    // ─── Lấy member theo UID ─────────────────────────────────────
    static async getById(uid: string): Promise<FirestoreMember | null> {
        const doc = await firestore().collection(COLLECTION).doc(uid).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as FirestoreMember;
    }

    // ─── Cập nhật hồ sơ thành viên ───────────────────────────────
    static async update(
        uid: string,
        data: Partial<Omit<FirestoreMember, 'id' | 'createdAt'>>
    ): Promise<void> {
        await firestore().collection(COLLECTION).doc(uid).update({
            ...data,
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    }

    // ─── Tìm kiếm theo tên hoặc pháp danh ───────────────────────
    static async search(query: string): Promise<FirestoreMember[]> {
        // Firestore không hỗ trợ full-text search — lấy all rồi filter client-side
        const all = await this.getAll();
        const q = query.toLowerCase();
        return all.filter(m =>
            m.fullName.toLowerCase().includes(q) ||
            m.dharmaName.toLowerCase().includes(q)
        );
    }

    // ─── Lắng nghe real-time member list ─────────────────────────
    static subscribeAll(
        callback: (members: FirestoreMember[]) => void
    ): () => void {
        return firestore()
            .collection(COLLECTION)
            .where('status', '==', 'active')
            .orderBy('fullName', 'asc')
            .onSnapshot(snapshot => {
                const members = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as FirestoreMember));
                callback(members);
            });
    }

    // ─── Lắng nghe real-time 1 member (hồ sơ cá nhân) ───────────
    static subscribeOne(
        uid: string,
        callback: (member: FirestoreMember | null) => void
    ): () => void {
        return firestore()
            .collection(COLLECTION)
            .doc(uid)
            .onSnapshot(doc => {
                if (!doc.exists) {
                    callback(null);
                    return;
                }
                callback({ id: doc.id, ...doc.data() } as FirestoreMember);
            });
    }
}

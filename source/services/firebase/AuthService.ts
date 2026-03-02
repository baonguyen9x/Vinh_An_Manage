import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export class AuthService {
    // ─── Đăng nhập bằng email/password ───────────────────────────
    static async login(email: string, password: string): Promise<FirebaseAuthTypes.User> {
        const { user } = await auth().signInWithEmailAndPassword(email, password);
        return user;
    }

    // ─── Đăng ký tài khoản mới ───────────────────────────────────
    static async register(
        email: string,
        password: string,
        displayName: string
    ): Promise<FirebaseAuthTypes.User> {
        // 1. Tạo account trong Auth
        const { user } = await auth().createUserWithEmailAndPassword(email, password);

        // 2. Cập nhật Profile
        await user.updateProfile({ displayName });

        // 3. Tạo document member trong Firestore (đặt status là active để dùng được ngay)
        await firestore().collection('members').doc(user.uid).set({
            uid: user.uid,
            email,
            fullName: displayName,
            dharmaName: '',
            gender: 'Nam',
            status: 'active',
            isAdmin: false,
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        });

        return user;
    }

    // ─── Đăng xuất ───────────────────────────────────────────────
    static async logout(): Promise<void> {
        await auth().signOut();
    }

    // ─── Lấy user hiện tại ───────────────────────────────────────
    static getCurrentUser(): FirebaseAuthTypes.User | null {
        return auth().currentUser;
    }

    // ─── Lắng nghe trạng thái đăng nhập ─────────────────────────
    static onAuthStateChanged(
        callback: (user: FirebaseAuthTypes.User | null) => void
    ): () => void {
        return auth().onAuthStateChanged(callback);
    }

    // ─── Kiểm tra user có phải Admin không ───────────────────────
    static async isAdmin(uid: string): Promise<boolean> {
        const doc = await firestore().collection('members').doc(uid).get();
        return doc.data()?.isAdmin === true;
    }

    // ─── Reset mật khẩu ──────────────────────────────────────────
    static async resetPassword(email: string): Promise<void> {
        await auth().sendPasswordResetEmail(email);
    }
}

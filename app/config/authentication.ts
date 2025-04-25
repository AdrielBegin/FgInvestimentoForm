// authentication.ts
import { app } from './firebaseClient';
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    User,
    onAuthStateChanged
} from 'firebase/auth';

import {
    addDoc,
    collection,
    getFirestore,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    getDoc
} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Registrar um novo usuário (com papel de "user" por padrão)
const registerWithEmailAndPassword = async (name: string, email: string, pwd: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pwd);
        const user = res.user;

        // Criar documento no Firestore com papel "user" por padrão
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            name,
            authProvider: 'local',
            email,
            role: 'user' 
        });

        return user;
    } catch (error: any) {

        if (error.code === 'auth/email-already-in-use') {
            return {
                success: false,
                error: 'Este e-mail já está sendo usado. Por favor, use outro e-mail ou tente fazer login.'
            };
        }

        console.error("Erro ao registrar usuário:", error);
        throw error;
    }
}

// Login com email e senha
const loginWithEmailAndPassword = async (email: string, pwd: string) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, pwd);
        return result.user;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

// Verificar o papel do usuário atual
const getUserRole = async (userId: string): Promise<string> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return userDoc.data().role || 'user';
        }
        return 'user'; // Padrão se não encontrado
    } catch (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        return 'user'; // Por segurança, retorna papel básico em caso de erro
    }
}

// Verificar se o usuário é administrador
const isAdmin = async (userId: string): Promise<boolean> => {
    const role = await getUserRole(userId);
    return role === 'admin';
}

// Atualizar papel do usuário (somente admins devem poder executar isto)
const updateUserRole = async (targetUserId: string, newRole: 'user' | 'admin') => {
    try {
        // Verificar se o usuário atual é admin (em um ambiente real, você deve verificar isso)
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Nenhum usuário autenticado');
        }

        const isCurrentUserAdmin = await isAdmin(currentUser.uid);
        if (!isCurrentUserAdmin) {
            throw new Error('Permissão negada: apenas administradores podem alterar papéis');
        }

        // Atualizar o papel
        await setDoc(doc(db, 'users', targetUserId), { role: newRole }, { merge: true });
        return true;
    } catch (error) {
        console.error("Erro ao atualizar papel:", error);
        throw error;
    }
}

const recuperarSenha = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        console.error("Erro ao recuperar senha:", error);
        throw error;
    }
}

const logout = () => {
    return signOut(auth);
}

const signWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;

        // Verificar se o usuário já existe
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Se não existir, criar com papel 'user'
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                role: 'user'
            });
        }

        return user;
    } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
        throw error;
    }
}

// Hook para monitorar estado de autenticação
const useAuth = (callback: (user: User | null) => void) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}

export {
    auth,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    recuperarSenha,
    logout,
    signWithGoogle,
    getUserRole,
    isAdmin,
    updateUserRole,
    useAuth
}
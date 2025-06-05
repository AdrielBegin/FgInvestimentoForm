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

const getUserRole = async (userId: string): Promise<string> => {
    try {       
        const userDoc = await getDoc(doc(db, 'users', userId));       

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.role || 'user';
        }
        return 'user'; 
    } catch (error) {
        console.error("Erro ao verificar papel do usuário:", error);
        return 'user'; 
    }
}

const isAdmin = async (userId: string): Promise<boolean> => {
    const role = await getUserRole(userId);
    return role === 'admin';
}

const updateUserRole = async (targetUserId: string, newRole: 'user' | 'admin') => {
    try {        
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Nenhum usuário autenticado');
        }

        const isCurrentUserAdmin = await isAdmin(currentUser.uid);
        if (!isCurrentUserAdmin) {
            throw new Error('Permissão negada: apenas administradores podem alterar papéis');
        }
        
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
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {            
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                role: 'user',
                createdAt: new Date().toISOString()
            });
        }

        return user;
    } catch (error) {
        console.error("Erro ao fazer login com Google:", error);
        await auth.signOut();
        throw error;
    }
}

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
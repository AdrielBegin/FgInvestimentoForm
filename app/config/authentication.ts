import { app } from './firebaseClient'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth'

import {
    addDoc,
    collection,
    getFirestore,
    query,
    where,
    getDocs
} from 'firebase/firestore'


const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const loginWithEmailAndPassword = async (email: string, pwd: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, pwd);
    } catch (error) {

    }
}

const registerWithEmailAndPassword = async (name: string, email: string, pwd: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pwd);
        const user = res.user;

        await addDoc(collection(db, 'Users'), {
            uId: user.uid,
            name,
            authProvider: 'local',
            email
        });

    } catch (error) {

    }
}

const recuperarSenha = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Email para recuperação da senha enviado")
    } catch (error) {

    }
}

const logout = () => {
    signOut(auth);
}

const signWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const queryUserId = query(collection(db, "Users"), where("uid", "==", user.uid));
        const docs = await getDocs(queryUserId);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "Users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email
            });
        }
        return user; // Retornar o usuário para que possamos usar na página de login
    } catch (error) {

    }
}

export {
    auth,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    recuperarSenha,
    logout,
    signWithGoogle
}


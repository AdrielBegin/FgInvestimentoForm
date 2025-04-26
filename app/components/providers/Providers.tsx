"use client";
import React, { createContext, useState, useEffect, ReactNode, FC } from "react";
import { app } from '@/app/config/firebaseClient'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import { doc, getDoc, getFirestore } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

interface User {
    uid?: string;
    name?: string | null;
    email?: string | null;
    passWord?: string;
    role?: string | null;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
}
const defaultUserContext: UserContextType = {
    user: null,
    loading: true,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const { uid, email, displayName } = firebaseUser;

                try {                    
                    const userDocRef = doc(db, "users", uid);
                    const userDocSnapshot = await getDoc(userDocRef);
                    
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();

                        setUser({
                            uid,
                            email: email ?? null,
                            name: userData.name ?? displayName ?? null,
                            role: userData.role ?? null,
                        });
                    } else {
                        console.warn(`O usuário com uid ${uid} não foi encontrado na coleção 'users'.`);                        
                        setUser({
                            uid,
                            email: email ?? null,
                            name: displayName ?? null,
                            role: null, // Role não encontrada
                        });
                    }
                } catch (error) {
                    console.error("Erro ao buscar informações do usuário no Firestore:", error);
                    setUser({
                        uid,
                        email: email ?? null,
                        name: displayName ?? null,
                        role: null, // Role não encontrada devido ao erro
                    });
                }
            } else {
                setUser(null); // Usuário não autenticado
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };

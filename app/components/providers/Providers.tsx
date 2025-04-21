"use client";
import React, { createContext, useState, useEffect, ReactNode, FC } from "react";
import { app } from '@/app/config/firebaseClient'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
const auth = getAuth(app);

interface User {
    uid?: string;
    name?: string | null;
    email?: string | null;
    passWord?: string;
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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                const { uid, email, displayName } = firebaseUser;
                setUser({
                    uid,
                    email: email ?? null,
                    name: displayName ?? null,
                });
            } else {
                setUser(null);
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

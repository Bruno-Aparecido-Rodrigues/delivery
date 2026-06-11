import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://lnh1dhp1mj.execute-api.us-east-1.amazonaws.com/api-pokemon/auth/v1';

const STORAGE_KEY_USER  = '@Auth:user';
const STORAGE_KEY_TOKEN = '@Auth:token';
const STORAGE_KEY_ID    = '@Auth:id';

type AuthContextData = {
    isAuthenticated: boolean;
    user: string | null;
    userId: string | null;
    token: string | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<boolean>;
    signUp: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,   setUser]   = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [token,  setToken]  = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const [storedUser, storedToken, storedId] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_USER),
                AsyncStorage.getItem(STORAGE_KEY_TOKEN),
                AsyncStorage.getItem(STORAGE_KEY_ID),
            ]);
            if (storedUser && storedToken) {
                setUser(storedUser);
                setToken(storedToken);
                setUserId(storedId);
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        loadStorageData();
    }, []);

    async function signIn(username: string, password: string): Promise<boolean> {
        if (!username.trim() || !password.trim()) return false;

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });

            const data = await response.json();

            if (!response.ok) return false;

            const receivedUserId = data.userId ?? data.id ?? data.user_id ?? null;
            const receivedUser   = username.trim();

            setUser(receivedUser);
            setToken('authenticated');
            setUserId(receivedUserId);
            setIsAuthenticated(true);

            await AsyncStorage.multiSet([
                [STORAGE_KEY_USER,  receivedUser],
                [STORAGE_KEY_TOKEN, 'authenticated'],
                [STORAGE_KEY_ID,    receivedUserId ?? ''],
            ]);

            return true;
        } catch (e) {
            console.error('[signIn] Erro de rede:', e);
            return false;
        }
    }

    async function signUp(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
        if (!username.trim() || !password.trim()) {
            return { ok: false, error: '► PREENCHA TODOS OS CAMPOS' };
        }

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() }),
            });

            if (response.status === 409) return { ok: false, error: '► USUÁRIO JÁ EXISTE' };
            if (!response.ok)           return { ok: false, error: '► ERRO AO CRIAR CONTA' };

            const logged = await signIn(username, password);
            if (!logged) return { ok: true };
            return { ok: true };
        } catch (e) {
            console.error('[signUp] Erro de rede:', e);
            return { ok: false, error: '► SEM CONEXÃO COM O SERVIDOR' };
        }
    }

    async function signOut() {
        setUser(null);
        setToken(null);
        setUserId(null);
        setIsAuthenticated(false);
        await AsyncStorage.multiRemove([STORAGE_KEY_USER, STORAGE_KEY_TOKEN, STORAGE_KEY_ID]);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userId, token, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
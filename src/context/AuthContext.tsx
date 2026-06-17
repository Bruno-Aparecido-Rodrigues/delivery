import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiLogin, apiRegister } from '@/integration/authIntegration';

// Chaves para salvar o usuário e o id
const STORAGE_KEY_USER  = '@Auth:user';
const STORAGE_KEY_ID    = '@Auth:id';

type AuthContextData = {
    isAuthenticated: boolean;                
    user: string | null;                    
    userId: string | null;                
    isLoading: boolean;                    
    signIn: (username: string, password: string) => Promise<boolean>; // função para login
    signUp: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>; // função para registro
    signOut: () => void; // desloga e limpa storage
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider que vai envolver a api e provê o estado de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user,   setUser]   = useState<string | null>(null);    
    const [userId, setUserId] = useState<string | null>(null);   
    const [isLoading, setIsLoading] = useState(true);     

    // Ao montar, tenta carregar usuário/id do AsyncStorage para manter sessão
    useEffect(() => {
        async function loadStorageData() {
            const [storedUser, storedId] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_USER),
                AsyncStorage.getItem(STORAGE_KEY_ID),
            ]);
            if (storedUser) {
                // Se houver usuário salvo, atualiza o estado para sessão ativa
                setUser(storedUser);
                setUserId(storedId);
                setIsAuthenticated(true);
            }
            // Finaliza o carregamento inicial
            setIsLoading(false);
        }
        loadStorageData();
    }, []);

    // Realiza login: chama a API, atualiza estado e salva no storage
    async function signIn(username: string, password: string): Promise<boolean> {
        if (!username.trim() || !password.trim()) return false; // validação simples
        try {
            const data = await apiLogin(username.trim(), password.trim()); // chama backend
            setUser(username.trim());
            setUserId(data.userId ?? null);
            setIsAuthenticated(true);
            // Salva os dados localmente para persistir a sessão
            await AsyncStorage.multiSet([
                [STORAGE_KEY_USER, username.trim()],
                [STORAGE_KEY_ID,   data.userId ?? ''],
            ]);
            return true;
        } catch (e) {
            // Em caso de erro (credenciais inválidas, rede, etc) apenas loga e retorna false
            console.error('[signIn]', e);
            return false;
        }
    }

    // Realiza cadastro chama a API e faz login automático
    async function signUp(username: string, password: string): Promise<{ ok: boolean; error?: string }> {
        if (!username.trim() || !password.trim()) {
            return { ok: false, error: '► PREENCHA TODOS OS CAMPOS' };
        }
        try {
            await apiRegister(username.trim(), password.trim()); // cria conta no backend
            await signIn(username, password); // faz login automático após registro
            return { ok: true };
        } catch (e: any) {
            // Se der erro (usuário já existe, rede, etc), captura a mensagem e retorna para a UI
            const msg = e?.message ?? 'ERRO AO CRIAR CONTA';
            return { ok: false, error: `► ${msg.toUpperCase()}` };
        }
    }

    // Desloga, limpa estado e remove dados do storage
    async function signOut() {
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        await AsyncStorage.multiRemove([STORAGE_KEY_USER, STORAGE_KEY_ID]);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, userId, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para consumir o contexto de autenticação com mais conveniência
export const useAuth = () => useContext(AuthContext);

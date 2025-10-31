import React, { createContext, useState, useContext, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import api from '../services/api';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dni?: string;
  birthdate?: string;
  is_verified_dni: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void; // ← NUEVO
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USE_MOCK = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (USE_MOCK) {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('access_token', 'mock-token');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockUser: User = {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'test@example.com',
          name: 'Usuario de Prueba',
          phone: '987654321',
          dni: '12345678',
          is_verified_dni: true
        };
        
        console.log('✅ [AuthContext] Usuario mock cargado:', mockUser);
        setUser(mockUser);
      } else {
        const token = localStorage.getItem('access_token');
        if (token) {
          console.log('🔍 [AuthContext] Token encontrado, obteniendo usuario...');
          try {
            const { data } = await api.get('/api/v1/auth/me');
            console.log('✅ [AuthContext] Usuario obtenido desde API:', data);
            setUser(data);
          } catch (error) {
            console.error('❌ [AuthContext] Error al obtener usuario, limpiando token:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          console.log('ℹ️ [AuthContext] No hay token, usuario no autenticado');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error checking user:', error);
      if (!USE_MOCK) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando login con Google...');
      const { data } = await api.post('/api/v1/auth/google', { id_token: idToken });
      
      console.log('✅ [AuthContext] Login exitoso, guardando token...');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token', data.access_token);
      
      console.log('👤 [AuthContext] Usuario autenticado:', data.user);
      setUser(data.user);
    } catch (error) {
      console.error('❌ [AuthContext] Error logging in with Google:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 [AuthContext] Cerrando sesión...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    setUser(null);
    supabase.auth.signOut();
  };

  const refreshUser = async () => {
    console.log('🔄 [AuthContext] Refrescando usuario...');
    await checkUser();
  };

  // ← NUEVO MÉTODO
  const updateUser = (userData: Partial<User>) => {
    console.log('🔄 [AuthContext] Actualizando usuario en contexto:', userData);
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      logout, 
      refreshUser,
      updateUser // ← EXPORTAR
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
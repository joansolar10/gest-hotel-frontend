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
  role?: string; // ← NUEVO
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: boolean; // ← NUEVO
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USE_MOCK = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ← NUEVO: Computed property
  const isAdmin = user?.role === 'admin' || user?.role === 'receptionist';

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
          is_verified_dni: true,
          role: 'user'
        };
        
        setUser(mockUser);
      } else {
        const token = localStorage.getItem('access_token');
        if (token) {
          try {
            const { data } = await api.get('/api/v1/auth/me');
            console.log('✅ [AuthContext] Usuario obtenido:', data);
            setUser(data);
          } catch (error) {
            console.error('❌ [AuthContext] Error:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ [AuthContext] Error:', error);
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
      const { data } = await api.post('/api/v1/auth/google', { id_token: idToken });
      
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('token', data.access_token);
      
      setUser(data.user);
    } catch (error) {
      console.error('❌ Error login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    setUser(null);
    supabase.auth.signOut();
  };

  const refreshUser = async () => {
    await checkUser();
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      logout, 
      refreshUser,
      updateUser,
      isAdmin // ← NUEVO
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
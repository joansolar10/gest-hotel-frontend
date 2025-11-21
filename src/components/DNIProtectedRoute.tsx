import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface DNIProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * DNIProtectedRoute - Verifica autenticación Y DNI verificado
 * 
 * Usar SOLO para rutas que requieren DNI verificado:
 * - Crear nueva reserva
 * - Realizar pago
 * - Acciones que requieren identidad verificada
 * 
 * NO usar para:
 * - Ver reservas existentes
 * - Ver habitaciones
 * - Ver perfil
 */
export const DNIProtectedRoute: React.FC<DNIProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // Verificar autenticación primero
      if (!user) {
        console.log('❌ [DNIProtectedRoute] No autenticado, redirigiendo a /login');
        navigate('/login', { replace: true });
        return;
      }

      // Verificar DNI
      if (!user.is_verified_dni) {
        console.log('❌ [DNIProtectedRoute] DNI no verificado, redirigiendo a /verify-dni');
        
        toast.error('Debes verificar tu DNI para acceder a esta función', {
          duration: 3000,
          icon: '🔒'
        });

        // Guardar la URL para volver después de verificar
        localStorage.setItem('redirect_after_verification', location.pathname);
        
        navigate('/verify-dni', { replace: true });
        return;
      }

      console.log('✅ [DNIProtectedRoute] Autenticado y DNI verificado');
    }
  }, [user, loading, navigate, location.pathname]);

  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Verificando acceso...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Si no está autenticado o no tiene DNI, no mostrar nada (el useEffect redirigirá)
  if (!user || !user.is_verified_dni) {
    return null;
  }

  // Usuario autenticado y con DNI verificado, mostrar contenido
  return <>{children}</>;
};
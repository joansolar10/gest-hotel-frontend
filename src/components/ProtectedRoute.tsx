import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVerification } from '../hooks/useVerification';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isVerified, isLoading } = useVerification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔒 [ProtectedRoute] Verificando acceso:', {
      isVerified,
      isLoading,
      path: location.pathname
    });

    // Solo redirigir si ya terminó de cargar Y no está verificado
    if (!isLoading && !isVerified) {
      console.log('❌ [ProtectedRoute] Usuario NO verificado, redirigiendo a /verify-dni');
      
      toast.error('Debes verificar tu DNI antes de continuar', {
        duration: 3000,
        icon: '🔒'
      });

      // Guardar la URL para volver después de verificar
      localStorage.setItem('redirect_after_verification', location.pathname);
      
      navigate('/verify-dni', { replace: true });
    } else if (!isLoading && isVerified) {
      console.log('✅ [ProtectedRoute] Usuario verificado, permitiendo acceso');
    }
  }, [isVerified, isLoading, location.pathname, navigate]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    console.log('⏳ [ProtectedRoute] Cargando estado de verificación...');
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

  // Si no está verificado, no mostrar nada (el useEffect redirigirá)
  if (!isVerified) {
    console.log('🚫 [ProtectedRoute] No verificado, no renderizando contenido');
    return null;
  }

  // Usuario verificado, mostrar contenido
  console.log('✅ [ProtectedRoute] Renderizando contenido protegido');
  return <>{children}</>;
};
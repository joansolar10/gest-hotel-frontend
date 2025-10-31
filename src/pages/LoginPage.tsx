import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Si ya está logueado, redirigir
  React.useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/rooms';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      console.log('🔐 Iniciando login con Google...');
      await loginWithGoogle(credentialResponse.credential);
      
      toast.success('¡Bienvenido!', {
        icon: '👋',
        duration: 3000,
      });

      // Redirigir a la página anterior o a /rooms
      const from = (location.state as any)?.from?.pathname || '/rooms';
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      toast.error(error.response?.data?.error || 'Error al iniciar sesión', {
        duration: 4000,
      });
    }
  };

  const handleError = () => {
    toast.error('Error al conectar con Google', {
      duration: 3000,
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem 2rem', 
        borderRadius: '16px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        {/* Logo/Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
          }}>
            🏨
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            marginBottom: '0.5rem',
            color: '#1f2937',
            letterSpacing: '-0.5px'
          }}>
            Hotel Los Andes
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            Ingresa con tu cuenta de Google para reservar
          </p>
        </div>

        {/* Información */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem', marginTop: '2px' }}>ℹ️</span>
            <div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem', 
                color: '#1e40af',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}>
                Primera vez aquí
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '0.8rem', 
                color: '#3b82f6',
                lineHeight: '1.4'
              }}>
                Al iniciar sesión con Google, se creará automáticamente tu cuenta. 
                Luego deberás verificar tu DNI para poder hacer reservas.
              </p>
            </div>
          </div>
        </div>

        {/* Botón de Google */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            text="continue_with"
            shape="pill"
            size="large"
            width="300"
          />
        </div>

        {/* Divider */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: '500' }}>
            SEGURO Y RÁPIDO
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
        </div>

        {/* Beneficios */}
        <div style={{ 
          display: 'grid', 
          gap: '0.75rem',
          textAlign: 'left',
          marginBottom: '1.5rem'
        }}>
          {[
            { icon: '✓', text: 'No necesitas crear contraseña' },
            { icon: '🔒', text: 'Inicio de sesión seguro con Google' },
            { icon: '⚡', text: 'Acceso inmediato a reservas' }
          ].map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              padding: '0.5rem',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#d1fae5',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#4b5563',
                fontWeight: '500'
              }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ 
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#9ca3af',
            lineHeight: '1.5',
            margin: 0
          }}>
            Al continuar, aceptas nuestros{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Términos de Servicio
            </a>
            {' '}y{' '}
            <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
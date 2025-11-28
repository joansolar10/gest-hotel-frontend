import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100vh',
      width: '100vw',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      overflow: 'hidden',
      zIndex: 9999,
      margin: 0,
      padding: 0
    }}>
      {/* Lado Izquierdo - Formulario */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: '20px',
        overflow: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px'
        }}>
          {/* Logo/Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L3 9V23L16 30L29 23V9L16 2Z" fill="#FF385C"/>
                <path d="M16 10C13.7909 10 12 11.7909 12 14V18H20V14C20 11.7909 18.2091 10 16 10Z" fill="white"/>
                <rect x="11" y="17" width="10" height="8" fill="white"/>
              </svg>
            </div>
            <h1 style={{
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--gray-600)',
              letterSpacing: '-0.5px'
            }}>
              Bienvenido a Hotel Los Andes
            </h1>
            <p style={{
              color: 'var(--gray-500)',
              fontSize: '13px',
              lineHeight: '1.4',
              margin: 0
            }}>
              Inicia sesión para reservar tu habitación perfecta
            </p>
          </div>

          {/* Información */}
          <div style={{
            backgroundColor: 'var(--gray-50)',
            border: '1px solid var(--gray-100)',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'start',
              gap: '10px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '16px' }}>ℹ️</span>
              </div>
              <div>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '13px',
                  color: 'var(--gray-600)',
                  fontWeight: '600'
                }}>
                  Primera vez aquí
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: 'var(--gray-500)',
                  lineHeight: '1.4'
                }}>
                  Al iniciar sesión con Google, crearemos automáticamente tu cuenta. Después deberás verificar tu DNI para realizar reservas.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Google */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap={false}
              text="continue_with"
              shape="rectangular"
              size="large"
              width="350"
            />
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: 'var(--gray-200)'
            }} />
            <span style={{
              color: 'var(--gray-400)',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Seguro y confiable
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: 'var(--gray-200)'
            }} />
          </div>

          {/* Beneficios */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {[
              { icon: '🔒', text: 'Inicio de sesión seguro con Google' },
              { icon: '⚡', text: 'Acceso inmediato sin contraseña' },
              { icon: '✓', text: 'Gestiona tus reservas fácilmente' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--gray-50)',
                  border: '1px solid var(--gray-100)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                  border: '1px solid var(--gray-100)'
                }}>
                  {item.icon}
                </div>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--gray-600)',
                  fontWeight: '500',
                  lineHeight: '1.3'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            paddingTop: '14px',
            borderTop: '1px solid var(--gray-100)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '11px',
              color: 'var(--gray-400)',
              lineHeight: '1.4',
              margin: 0
            }}>
              Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
            </p>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Imagen */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/hotel-reg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Overlay con gradiente */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)'
          }}>
            {/* Texto sobre la imagen */}
            <div style={{
              position: 'absolute',
              bottom: '40px',
              left: '40px',
              right: '40px',
              color: 'white'
            }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                Lujo y Confort
              </h2>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.5',
                margin: 0,
                textShadow: '0 1px 6px rgba(0,0,0,0.5)'
              }}>
                Experimenta una estadía inolvidable en el corazón de los Andes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
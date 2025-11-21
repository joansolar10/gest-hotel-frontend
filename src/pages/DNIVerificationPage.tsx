import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reniecService } from '../services/reniec.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const DNIVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [dni, setDni] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!dni || dni.length !== 8) {
      setError('El DNI debe tener 8 dígitos');
      toast.error('DNI inválido');
      return;
    }

    if (!birthdate) {
      setError('Debes ingresar tu fecha de nacimiento');
      toast.error('Fecha de nacimiento requerida');
      return;
    }

    // Validar mayoría de edad
    const age = calculateAge(birthdate);
    if (age < 18) {
      setError('Debes ser mayor de 18 años para registrarte');
      toast.error('No cumples con la edad mínima (18 años)', {
        duration: 5000,
        icon: '🔞'
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Verificando DNI:', dni, 'Edad:', age, 'años');
      
      const response = await reniecService.verifyDNI(dni, birthdate);
      
      if (response.success) {
        toast.success('¡DNI verificado exitosamente!', {
          duration: 3000,
          icon: '✅'
        });

        // Refrescar usuario inmediatamente
        console.log('🔄 Refrescando usuario después de verificar DNI...');
        await refreshUser();
        
        // ✨ Redirigir a donde venía el usuario o a /rooms por defecto
        const redirectUrl = localStorage.getItem('redirect_after_verification') || '/rooms';
        localStorage.removeItem('redirect_after_verification'); // Limpiar
        
        console.log('🔀 Redirigiendo a:', redirectUrl);
        
        setTimeout(() => {
          navigate(redirectUrl, { replace: true });
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ Error en verificación:', error);
      const errorMsg = error.response?.data?.error || 'Error al verificar DNI';
      setError(errorMsg);
      toast.error(errorMsg, {
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      padding: '2rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪪</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Verificación de Identidad
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Ingresa tus datos para continuar
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {/* DNI */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Número de DNI
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setDni(value.slice(0, 8));
                  setError('');
                }}
                placeholder="12345678"
                maxLength={8}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Ingresa tu número de DNI de 8 dígitos
              </p>
            </div>

            {/* Fecha de nacimiento */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => {
                  setBirthdate(e.target.value);
                  setError('');
                }}
                max={new Date().toISOString().split('T')[0]}
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2563eb'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
              />
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Debes ser mayor de 18 años
              </p>
            </div>

            {/* Mostrar edad calculada */}
            {birthdate && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: calculateAge(birthdate) >= 18 ? '#d1fae5' : '#fee2e2',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {calculateAge(birthdate) >= 18 ? '✅' : '❌'}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: calculateAge(birthdate) >= 18 ? '#065f46' : '#991b1b'
                }}>
                  Edad: {calculateAge(birthdate)} años {calculateAge(birthdate) >= 18 ? '(Mayor de edad)' : '(Menor de edad)'}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'start',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>❌</span>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#991b1b', fontSize: '0.875rem' }}>
                    Error de Verificación
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#dc2626', fontSize: '0.875rem' }}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading || !dni || !birthdate || (birthdate && calculateAge(birthdate) < 18)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading || (birthdate && calculateAge(birthdate) < 18) ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading || (birthdate && calculateAge(birthdate) < 18) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading && birthdate && calculateAge(birthdate) >= 18) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading && birthdate && calculateAge(birthdate) >= 18) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Verificando...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.25rem' }}>🔍</span>
                  Verificar Identidad
                </>
              )}
            </button>
          </form>

          {/* Información */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '6px'
          }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e40af', fontWeight: '500', marginBottom: '0.5rem' }}>
              ℹ️ Información importante:
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.75rem', color: '#3b82f6', lineHeight: '1.6' }}>
              <li>Debes ser mayor de 18 años para realizar reservas</li>
              <li>Tu DNI y fecha de nacimiento serán guardados de forma segura</li>
              <li>Esta información es necesaria para completar tu reserva</li>
            </ul>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
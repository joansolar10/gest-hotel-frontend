import React, { useState } from 'react';
import { reniecService, ReniecVerifyResponse } from '../services/reniec.service';
import toast from 'react-hot-toast';

interface DNIVerificationProps {
  onVerified: () => void;
}

export const DNIVerification: React.FC<DNIVerificationProps> = ({ onVerified }) => {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReniecVerifyResponse | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formato
    if (!/^\d{8}$/.test(dni)) {
      toast.error('El DNI debe tener 8 dígitos numéricos');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await reniecService.verifyDNI(dni);

      if (response.success) {
        toast.success('¡DNI verificado exitosamente!');
        setResult(response);
        
        // Esperar 2 segundos y ejecutar callback
        setTimeout(() => {
          onVerified();
        }, 2000);
      } else {
        toast.error(response.error || 'No se pudo verificar el DNI');
        setResult(response);
      }
    } catch (error) {
      toast.error('Error al verificar DNI');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪪</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Verificación de Identidad
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Verifica tu DNI con RENIEC para continuar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleVerify}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Número de DNI
          </label>
          <input
            type="text"
            value={dni}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 8);
              setDni(value);
            }}
            placeholder="12345678"
            maxLength={8}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              backgroundColor: loading ? '#f3f4f6' : 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            required
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Ingresa tu número de DNI de 8 dígitos
          </p>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading || dni.length !== 8}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading || dni.length !== 8 ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading || dni.length !== 8 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!loading && dni.length === 8) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && dni.length === 8) {
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
              Verificando con RENIEC...
            </>
          ) : (
            <>
              🔍 Verificar DNI
            </>
          )}
        </button>
      </form>

      {/* Resultado */}
      {result && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '6px',
          backgroundColor: result.success ? '#d1fae5' : '#fee2e2'
        }}>
          {result.success ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>✅</span>
                <span style={{ fontWeight: '600', color: '#065f46' }}>
                  Verificación Exitosa
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Nombres:</strong> {result.data?.nombres}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Apellidos:</strong> {result.data?.apellido_paterno} {result.data?.apellido_materno}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  <strong>Edad:</strong> {result.data?.age} años
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>❌</span>
                <span style={{ fontWeight: '600', color: '#991b1b' }}>
                  {result.isAdult === false ? 'Menor de Edad' : 'Error de Verificación'}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>
                {result.error}
                {result.age && ` (${result.age} años)`}
              </p>
            </>
          )}
        </div>
      )}

      {/* Info adicional */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#1e40af'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
          ℹ️ Información importante:
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Debes ser mayor de 18 años para realizar reservas</li>
          <li>La verificación se realiza con RENIEC</li>
          <li>Tus datos están protegidos</li>
        </ul>
      </div>

      {/* Animación */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
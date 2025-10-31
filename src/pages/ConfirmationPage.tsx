import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    console.log('🎉 Reserva confirmada!');
  }, []);

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      console.log('📍 Descargando PDF para reserva:', id);
      
      const response = await api.get(`/api/v1/reservations/${id}/pdf`, {
        responseType: 'blob'
      });

      console.log('📦 PDF recibido, tamaño:', response.data.size);
      
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reserva-${id?.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ PDF descargado exitosamente');
    } catch (error: any) {
      console.error('❌ Error al descargar PDF:', error);
      alert('Hubo un error al descargar el PDF. Por favor intenta nuevamente.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#10b981', 
        color: 'white', 
        padding: '2rem 0' 
      }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto', 
          padding: '0 1rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            ¡Pago Exitoso!
          </h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            Tu reserva ha sido confirmada
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#d1fae5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2.5rem'
          }}>
            ✓
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Reserva Confirmada
          </h2>

          <p style={{ color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
            Hemos enviado un correo de confirmación con todos los detalles de tu reserva.
            Recuerda presentar tu DNI al momento del check-in.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Botón de descarga de PDF */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: downloadingPDF ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: downloadingPDF ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                opacity: downloadingPDF ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!downloadingPDF) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                if (!downloadingPDF) {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }
              }}
            >
              {downloadingPDF ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Descargando...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.25rem' }}>📄</span>
                  Descargar Comprobante PDF
                </>
              )}
            </button>

            <button
              onClick={() => navigate(`/reservations/${id}`)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Ver detalles de la reserva
            </button>

            <button
              onClick={() => navigate('/rooms')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          borderRadius: '8px', 
          padding: '1.5rem',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
            Información importante
          </h3>
          <ul style={{ color: '#1e40af', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li>Check-in: A partir de las 14:00 hrs</li>
            <li>Check-out: Hasta las 12:00 hrs</li>
            <li>Documentación requerida: DNI o pasaporte</li>
            <li>Políticas de cancelación aplican según términos</li>
          </ul>
        </div>
      </div>

      {/* Animación de spin */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
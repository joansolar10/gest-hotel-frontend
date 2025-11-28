import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
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
    <div style={{
      height: 'calc(100vh - 64px)',
      backgroundColor: 'var(--gray-50)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: 'var(--gray-50)',
        padding: '20px 40px 0',
        flexShrink: 0
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '12px 12px 0 0',
          color: 'white',
          padding: '24px 32px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'scaleIn 0.6s ease-out'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px'
            }}>
              🎉
            </div>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: '0 0 6px 0',
            letterSpacing: '-0.5px'
          }}>
            ¡Reserva Confirmada!
          </h1>
          <p style={{
            fontSize: '15px',
            opacity: 0.95,
            margin: 0,
            fontWeight: '400'
          }}>
            Tu aventura está a punto de comenzar
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div style={{
        flex: 1,
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px 20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Card principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 12px 12px',
          padding: '20px 28px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--gray-100)',
          borderTop: 'none'
        }}>
          {/* Mensaje de confirmación */}
          <div style={{
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#D1FAE5',
              margin: '0 auto 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '6px',
              color: 'var(--gray-600)',
              letterSpacing: '-0.5px'
            }}>
              ¡Todo listo!
            </h2>

            <p style={{
              fontSize: '13px',
              color: 'var(--gray-500)',
              lineHeight: '1.5',
              margin: '0 0 12px 0'
            }}>
              Hemos enviado un correo de confirmación con todos los detalles de tu reserva.
              Recuerda presentar tu DNI al momento del check-in.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: '20px',
              fontSize: '12px',
              color: 'var(--gray-600)'
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontWeight: '600' }}>Email enviado</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {/* Botón principal - Descargar PDF */}
            <Button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: downloadingPDF ? '#94a3b8' : 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: downloadingPDF ? 'none' : '0 4px 16px rgba(255, 56, 92, 0.3)'
              }}
            >
              {downloadingPDF ? (
                <>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Descargando...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Descargar PDF
                </>
              )}
            </Button>

            {/* Botón secundario - Ver detalles */}
            <Button
              onClick={() => navigate('/my-reservations')}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 2px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              Ver detalles
            </Button>

            {/* Botón terciario - Volver al inicio */}
            <Button
              onClick={() => navigate('/rooms')}
              variant="outline"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              Volver al inicio
            </Button>
          </div>

          {/* Información importante en grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {[
              { icon: '🕐', label: 'Check-in', value: '14:00 hrs' },
              { icon: '🕐', label: 'Check-out', value: '12:00 hrs' },
              { icon: '🪪', label: 'DNI', value: 'Requerido' },
              { icon: '🔄', label: 'Cancelación', value: '24hrs antes' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  backgroundColor: 'var(--gray-50)',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-100)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: '22px',
                  marginBottom: '4px'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'var(--gray-500)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '2px'
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '500',
                  color: 'var(--gray-600)'
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensaje de agradecimiento */}
        <div style={{
          textAlign: 'center',
          marginTop: '12px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '6px'
          }}>
            🏨
          </div>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            marginBottom: '4px',
            color: 'var(--gray-600)'
          }}>
            ¡Gracias por elegir Hotel Los Andes!
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--gray-500)',
            lineHeight: '1.5',
            margin: 0
          }}>
            Estamos emocionados de recibirte. Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
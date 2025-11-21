import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ContactPage - HU 3.4: Ver contactos de soporte
 * 
 * Esta página muestra la información de contacto del hotel de manera clara y accesible.
 * No requiere autenticación para permitir que cualquier persona pueda contactar al hotel.
 * 
 * Características:
 * - Diseño visual profesional con iconos y colores
 * - Información organizada por tipo de contacto
 * - Enlaces directos (tel:, mailto:, maps)
 * - Horarios de atención claramente visibles
 * - Formulario de consulta rápida (opcional)
 * - Responsive y accesible
 */
export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Información de contacto del hotel (esto idealmente vendría de una configuración o base de datos)
  const contactInfo = {
    hotel: {
      name: 'Hotel Los Andes',
      slogan: 'Tu hogar lejos de casa'
    },
    phone: {
      main: '+51 44 123 4567',
      whatsapp: '+51 987 654 321',
      emergency: '+51 44 123 4568'
    },
    email: {
      general: 'contacto@hotellosandes.com',
      reservations: 'reservas@hotellosandes.com',
      support: 'soporte@hotellosandes.com'
    },
    address: {
      street: 'Av. Los Conquistadores 456',
      district: 'Trujillo',
      city: 'La Libertad',
      country: 'Perú',
      zipCode: '13001'
    },
    hours: {
      reception: '24 horas, 7 días a la semana',
      email: 'Lunes a Viernes: 9:00 AM - 6:00 PM',
      whatsapp: 'Lunes a Domingo: 8:00 AM - 10:00 PM'
    },
    social: {
      facebook: 'https://facebook.com/hotellosandes',
      instagram: 'https://instagram.com/hotellosandes',
      twitter: 'https://twitter.com/hotellosandes'
    }
  };

  /**
   * Copia texto al portapapeles y muestra feedback visual
   */
  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header con gradiente */}
      <div style={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white', 
        padding: '4rem 0',
        marginBottom: '3rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📞</div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            margin: 0,
            marginBottom: '1rem'
          }}>
            Contáctanos
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            margin: '0 auto',
            opacity: 0.95,
            maxWidth: '600px'
          }}>
            Estamos aquí para ayudarte. Comunícate con nosotros por el medio que prefieras.
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1.5rem 4rem' 
      }}>
        {/* Cards de contacto principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {/* Card: Teléfono */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #e5e7eb'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: '#dbeafe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1.5rem'
            }}>
              📞
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Teléfono
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Recepción Principal
                </div>
                <a
                  href={`tel:${contactInfo.phone.main}`}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#2563eb',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                >
                  {contactInfo.phone.main}
                </a>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  WhatsApp
                </div>
                <a
                  href={`https://wa.me/${contactInfo.phone.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#25D366',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#128C7E'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#25D366'}
                >
                  <span style={{ fontSize: '1.5rem' }}>💬</span>
                  {contactInfo.phone.whatsapp}
                </a>
              </div>

              <div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Emergencias 24/7
                </div>
                <a
                  href={`tel:${contactInfo.phone.emergency}`}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#dc2626',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#991b1b'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#dc2626'}
                >
                  <span style={{ fontSize: '1.25rem' }}>🚨</span>
                  {contactInfo.phone.emergency}
                </a>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <strong style={{ color: '#374151' }}>Horario:</strong> {contactInfo.hours.reception}
            </div>

            <button
              onClick={() => copyToClipboard(contactInfo.phone.main, 'phone')}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: copiedPhone ? '#10b981' : '#f3f4f6',
                color: copiedPhone ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {copiedPhone ? (
                <>
                  <span>✓</span>
                  ¡Copiado!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copiar número principal
                </>
              )}
            </button>
          </div>

          {/* Card: Email */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #e5e7eb'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1.5rem'
            }}>
              ✉️
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Correo Electrónico
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Consultas Generales
                </div>
                <a
                  href={`mailto:${contactInfo.email.general}`}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#2563eb',
                    textDecoration: 'none',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                >
                  {contactInfo.email.general}
                </a>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Reservas
                </div>
                <a
                  href={`mailto:${contactInfo.email.reservations}`}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#2563eb',
                    textDecoration: 'none',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                >
                  {contactInfo.email.reservations}
                </a>
              </div>

              <div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Soporte Técnico
                </div>
                <a
                  href={`mailto:${contactInfo.email.support}`}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#2563eb',
                    textDecoration: 'none',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#2563eb'}
                >
                  {contactInfo.email.support}
                </a>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <strong style={{ color: '#374151' }}>Tiempo de respuesta:</strong> 24-48 horas
            </div>

            <button
              onClick={() => copyToClipboard(contactInfo.email.general, 'email')}
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: copiedEmail ? '#10b981' : '#f3f4f6',
                color: copiedEmail ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {copiedEmail ? (
                <>
                  <span>✓</span>
                  ¡Copiado!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copiar email general
                </>
              )}
            </button>
          </div>

          {/* Card: Dirección */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #e5e7eb'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              marginBottom: '1.5rem'
            }}>
              📍
            </div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Dirección
            </h3>

            <div style={{ 
              fontSize: '1.125rem',
              color: '#374151',
              lineHeight: '1.8',
              marginBottom: '1.5rem'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>
                {contactInfo.address.street}
              </p>
              <p style={{ margin: 0 }}>
                {contactInfo.address.district}, {contactInfo.address.city}
              </p>
              <p style={{ margin: 0 }}>
                {contactInfo.address.country}
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                {contactInfo.address.zipCode}
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1rem'
            }}>
              <strong style={{ color: '#374151' }}>Cómo llegar:</strong> A 5 minutos de la Plaza de Armas
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${contactInfo.address.street}, ${contactInfo.address.district}, ${contactInfo.address.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>🗺️</span>
              Abrir en Google Maps
            </a>
          </div>
        </div>

        {/* Sección de redes sociales */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Síguenos en Redes Sociales
          </h3>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <a
              href={contactInfo.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: '#1877f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'transform 0.2s',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              📘
            </a>

            <a
              href={contactInfo.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'transform 0.2s',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              📷
            </a>

            <a
              href={contactInfo.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: '#1DA1F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'transform 0.2s',
                textDecoration: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🐦
            </a>
          </div>
        </div>

        {/* Sección de preguntas frecuentes */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            ¿Necesitas Ayuda Rápida?
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>❓</div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Preguntas Frecuentes
              </h4>
              <p style={{ 
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 1rem 0'
              }}>
                Encuentra respuestas a las dudas más comunes
              </p>
              <button
                onClick={() => navigate('/faq')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Ver FAQ →
              </button>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏨</div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Explorar Habitaciones
              </h4>
              <p style={{ 
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 1rem 0'
              }}>
                Conoce nuestras opciones de alojamiento
              </p>
              <button
                onClick={() => navigate('/rooms')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Ver Habitaciones →
              </button>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</div>
              <h4 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Mis Reservas
              </h4>
              <p style={{ 
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: '0 0 1rem 0'
              }}>
                Gestiona tus reservas existentes
              </p>
              <button
                onClick={() => navigate('/my-reservations')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              >
                Ver Reservas →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
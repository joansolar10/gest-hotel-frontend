import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AboutPage - Página "Acerca de" del hotel
 * Información sobre el hotel, su historia, servicios y valores
 */
export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏨</div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            margin: 0,
            marginBottom: '1rem'
          }}>
            Acerca de Hotel Los Andes
          </h1>
          <p style={{ 
            fontSize: '1.25rem',
            margin: '0 auto',
            opacity: 0.95,
            maxWidth: '600px'
          }}>
            Tu hogar lejos de casa desde 2020
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1.5rem 4rem' 
      }}>
        {/* Nuestra Historia */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1.5rem'
          }}>
            Nuestra Historia
          </h2>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: '#374151',
            margin: '0 0 1rem 0'
          }}>
            Hotel Los Andes nació en 2020 con una visión clara: ofrecer hospitalidad excepcional 
            en el corazón de Trujillo. Combinamos la calidez del servicio peruano con las 
            comodidades modernas que todo viajero espera.
          </p>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: '#374151',
            margin: 0
          }}>
            Ubicados estratégicamente cerca de los principales puntos de interés de la ciudad, 
            nos hemos convertido en el destino preferido tanto para viajeros de negocios como 
            para turistas que buscan explorar la rica cultura de La Libertad.
          </p>
        </div>

        {/* Nuestros Valores */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Calidad
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0
            }}>
              Cada detalle cuenta. Nos comprometemos a ofrecer servicios de la más alta calidad 
              en todas nuestras instalaciones.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💚</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Hospitalidad
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0
            }}>
              Tratamos a cada huésped como parte de nuestra familia, brindando atención 
              personalizada y cálida.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.75rem'
            }}>
              Seguridad
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0
            }}>
              Tu tranquilidad es nuestra prioridad. Contamos con sistemas de seguridad 
              24/7 para garantizar tu bienestar.
            </p>
          </div>
        </div>

        {/* Servicios Destacados */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Servicios Destacados
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: '📶', title: 'WiFi Gratuito', desc: 'Internet de alta velocidad en todas las áreas' },
              { icon: '🍳', title: 'Desayuno Incluido', desc: 'Buffet continental todos los días' },
              { icon: '🚗', title: 'Estacionamiento', desc: 'Parking privado y seguro' },
              { icon: '🏋️', title: 'Gimnasio', desc: 'Equipamiento moderno disponible 24/7' },
              { icon: '💼', title: 'Centro de Negocios', desc: 'Salas de reuniones y servicios ejecutivos' },
              { icon: '🧹', title: 'Servicio de Habitación', desc: 'Limpieza diaria y room service' }
            ].map((service, idx) => (
              <div key={idx} style={{
                padding: '1.5rem',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                  {service.icon}
                </div>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '0.5rem'
                }}>
                  {service.title}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            ¿Listo para tu próxima aventura?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Explora nuestras habitaciones y encuentra el espacio perfecto para tu estadía
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/rooms')}
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Ver Habitaciones
            </button>

            <button
              onClick={() => navigate('/contact')}
              style={{
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#2563eb',
                border: '2px solid #2563eb',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#2563eb';
              }}
            >
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
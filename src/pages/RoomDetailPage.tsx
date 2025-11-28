import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService, Room } from '../services/room.service';
import toast from 'react-hot-toast';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadRoom();
  }, [id]);

  const loadRoom = async () => {
    if (!id) {
      toast.error('ID de habitación inválido');
      navigate('/rooms');
      return;
    }

    try {
      setLoading(true);
      const data = await roomService.getRoomById(id);
      setRoom(data);
    } catch (error: any) {
      console.error('Error cargando habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--gray-100)',
          borderTopColor: 'var(--gray-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!room) return null;

  const isAvailable = room.status === 'available';
  const images = room.images && room.images.length > 0 ? room.images : [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'
  ];

  const services = [];
  if (room.services) {
    if (room.services.wifi) services.push({ icon: '📶', label: 'WiFi gratuito', desc: 'Conexión de alta velocidad' });
    if (room.services.ac) services.push({ icon: '❄️', label: 'Aire acondicionado', desc: 'Control de temperatura' });
    if (room.services.tv) services.push({ icon: '📺', label: 'Televisión', desc: 'TV por cable' });
    if (room.services.minibar) services.push({ icon: '🍷', label: 'Minibar', desc: 'Bebidas y snacks' });
    if (room.services.jacuzzi) services.push({ icon: '🛁', label: 'Jacuzzi', desc: 'Tina de hidromasaje' });
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      single: 'Habitación Individual',
      double: 'Habitación Doble',
      suite: 'Suite Premium'
    };
    return types[type] || type;
  };

  const rating = 4.87;
  const reviewCount = 142;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)', paddingBottom: '120px' }}>
      {/* Header con breadcrumb */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gray-100)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1760px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <button
            onClick={() => navigate('/rooms')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              fontSize: '15px',
              color: 'var(--gray-600)',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'background-color 0.2s',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Volver a habitaciones
          </button>
        </div>
      </div>

      {/* Título y rating */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gray-100)'
      }}>
        <div style={{
          maxWidth: '1760px',
          margin: '0 auto',
          padding: '32px 40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'var(--gray-600)',
            letterSpacing: '-0.5px'
          }}>
            Habitación {room.code}
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ fontSize: '16px' }}>⭐</span>
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--gray-600)'
              }}>
                {rating}
              </span>
              <span style={{
                fontSize: '15px',
                color: 'var(--gray-500)'
              }}>
                ({reviewCount} opiniones)
              </span>
            </div>
            <span style={{
              fontSize: '15px',
              color: 'var(--gray-400)'
            }}>
              •
            </span>
            <span style={{
              fontSize: '15px',
              color: 'var(--gray-600)',
              fontWeight: '500'
            }}>
              {getTypeLabel(room.type)}
            </span>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div style={{
        maxWidth: '1760px',
        margin: '0 auto',
        padding: '32px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '8px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          height: '560px'
        }}>
          <div style={{
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden'
          }}>
            <img
              src={images[selectedImage]}
              alt={room.type}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s'
              }}
              onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200'}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateRows: '1fr 1fr',
            gap: '8px'
          }}>
            {images.slice(1, 3).map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}
                onClick={() => setSelectedImage(idx + 1)}
              >
                <img
                  src={img}
                  alt={`${room.type} ${idx + 2}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s'
                  }}
                  onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200'}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{
        maxWidth: '1760px',
        margin: '0 auto',
        padding: '0 40px 80px',
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '80px'
      }}>
        {/* Columna izquierda - Información */}
        <div>
          {/* Información básica */}
          <div style={{
            paddingBottom: '40px',
            borderBottom: '1px solid var(--gray-100)',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: 'var(--gray-600)',
              letterSpacing: '-0.3px'
            }}>
              {getTypeLabel(room.type)}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '16px',
              color: 'var(--gray-500)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>👥</span>
                <span>Hasta {room.capacity} {room.capacity === 1 ? 'huésped' : 'huéspedes'}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div style={{
            paddingBottom: '40px',
            borderBottom: '1px solid var(--gray-100)',
            marginBottom: '40px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'var(--gray-600)'
            }}>
              Acerca de esta habitación
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: 'var(--gray-500)',
              margin: 0
            }}>
              {room.description || 'Habitación cómoda y bien equipada para tu estadía. Cuenta con todas las comodidades necesarias para que disfrutes de una experiencia única en nuestro hotel.'}
            </p>
          </div>

          {/* Servicios */}
          {services.length > 0 && (
            <div style={{
              paddingBottom: '40px',
              borderBottom: '1px solid var(--gray-100)',
              marginBottom: '40px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '24px',
                color: 'var(--gray-600)'
              }}>
                Lo que ofrece este espacio
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}>
                {services.map((service, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px'
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{service.icon}</span>
                    <div>
                      <div style={{
                        fontWeight: '500',
                        color: 'var(--gray-600)',
                        marginBottom: '4px',
                        fontSize: '16px'
                      }}>
                        {service.label}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--gray-400)'
                      }}>
                        {service.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                margin: 0,
                color: 'var(--gray-600)'
              }}>
                {rating} · {reviewCount} opiniones
              </h3>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {[
                { label: 'Limpieza', value: 4.9 },
                { label: 'Ubicación', value: 4.8 },
                { label: 'Atención', value: 4.9 },
                { label: 'Relación calidad-precio', value: 4.7 }
              ].map((cat) => (
                <div key={cat.label}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: 'var(--gray-600)', fontWeight: '500' }}>{cat.label}</span>
                    <span style={{ fontWeight: '600', color: 'var(--gray-600)' }}>{cat.value}</span>
                  </div>
                  <div style={{
                    height: '4px',
                    backgroundColor: 'var(--gray-100)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(cat.value / 5) * 100}%`,
                      height: '100%',
                      backgroundColor: 'var(--gray-600)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha - Card de reserva sticky */}
        <div>
          <div style={{
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--gray-200)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: 'var(--gray-600)'
                  }}>
                    S/ {room.price_per_night}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: 'var(--gray-400)'
                  }}>
                    / noche
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ fontSize: '14px' }}>⭐</span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'var(--gray-600)'
                  }}>
                    {rating}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--gray-400)'
                  }}>
                    ({reviewCount} opiniones)
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/rooms/${room.id}/reserve`)}
                disabled={!isAvailable}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: isAvailable ? 'var(--airbnb-primary)' : 'var(--gray-200)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '17px',
                  fontWeight: '600',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  marginBottom: '16px',
                  transition: 'all 0.2s',
                  boxShadow: isAvailable ? 'var(--shadow-md)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.backgroundColor = 'var(--airbnb-primary-dark)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.backgroundColor = 'var(--airbnb-primary)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isAvailable ? 'Reservar' : 'No disponible'}
              </button>

              <div style={{
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--gray-400)',
                marginBottom: '24px'
              }}>
                No se te hará ningún cargo todavía
              </div>

              <div style={{
                paddingTop: '24px',
                borderTop: '1px solid var(--gray-100)'
              }}>
                {[
                  { icon: '✓', text: 'Cancelación gratuita' },
                  { icon: '✓', text: 'Sin cargos ocultos' },
                  { icon: '✓', text: 'Confirmación inmediata' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: idx < 2 ? '12px' : '0'
                    }}
                  >
                    <span style={{
                      color: 'var(--airbnb-secondary)',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {item.icon}
                    </span>
                    <span style={{
                      fontSize: '15px',
                      color: 'var(--gray-600)'
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante sticky en la parte inferior - CON FONDO OSCURO */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
        borderTop: '2px solid var(--airbnb-primary)',
        padding: '20px 40px',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1760px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white'
            }}>
              S/ {room.price_per_night}
            </span>
            <span style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              / noche
            </span>
          </div>
          <button
            onClick={() => navigate(`/rooms/${room.id}/reserve`)}
            disabled={!isAvailable}
            style={{
              padding: '18px 56px',
              background: isAvailable ? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: isAvailable ? '0 4px 20px rgba(255, 56, 92, 0.4)' : 'none',
              minWidth: '240px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              if (isAvailable) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 56, 92, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (isAvailable) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 56, 92, 0.4)';
              }
            }}
          >
            {isAvailable ? '✨ Reservar ahora' : 'No disponible'}
          </button>
        </div>
      </div>
    </div>
  );
};
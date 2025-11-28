import React from 'react';

import { useNavigate } from 'react-router-dom';

 

interface Room {

  id: string;

  code: string;

  type: string;

  description: string;

  capacity: number;

  price_per_night: number;

  status: string;

  services?: {

    wifi?: boolean;

    ac?: boolean;

    tv?: boolean;

    minibar?: boolean;

    jacuzzi?: boolean;

  };

  images?: string[];

}

 

interface RoomCardHorizontalProps {

  room: Room;

}

 

export const RoomCardHorizontal: React.FC<RoomCardHorizontalProps> = ({ room }) => {

  const navigate = useNavigate();

  const isAvailable = room.status === 'available';

 

  const getTypeLabel = (type: string) => {

    const types: Record<string, string> = {

      single: 'Habitación Individual',

      double: 'Habitación Doble',

      suite: 'Suite Premium'

    };

    return types[type] || type;

  };

 

  const getRating = () => {

    const ratings = { single: 4.78, double: 4.85, suite: 4.92 };

    return ratings[room.type as keyof typeof ratings] || 4.80;

  };

 

  const getReviewCount = () => {

    const counts = { single: 156, double: 241, suite: 89 };

    return counts[room.type as keyof typeof counts] || 100;

  };

 

  const services = [];

  if (room.services) {

    if (room.services.wifi) services.push({ icon: '📶', label: 'WiFi' });

    if (room.services.ac) services.push({ icon: '❄️', label: 'Aire' });

    if (room.services.tv) services.push({ icon: '📺', label: 'TV' });

    if (room.services.minibar) services.push({ icon: '🍷', label: 'Minibar' });

    if (room.services.jacuzzi) services.push({ icon: '🛁', label: 'Jacuzzi' });

  }

 

  const imageUrl = room.images && room.images.length > 0

    ? room.images[0]

    : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';

 

  const rating = getRating();

  const reviewCount = getReviewCount();

 

  return (

    <div

      style={{

        display: 'flex',

        gap: '20px',

        padding: '24px',

        backgroundColor: 'white',

        borderRadius: 'var(--radius-md)',

        border: '1px solid var(--gray-100)',

        cursor: 'pointer',

        transition: 'all 0.2s ease',

        position: 'relative'

      }}

      onClick={() => navigate(`/rooms/${room.id}`)}

      onMouseEnter={(e) => {

        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';

        e.currentTarget.style.transform = 'translateY(-2px)';

      }}

      onMouseLeave={(e) => {

        e.currentTarget.style.boxShadow = 'none';

        e.currentTarget.style.transform = 'translateY(0)';

      }}

    >

      {/* Imagen */}

      <div style={{

        width: '300px',

        height: '200px',

        flexShrink: 0,

        position: 'relative',

        borderRadius: 'var(--radius-md)',

        overflow: 'hidden'

      }}>

        <img

          src={imageUrl}

          alt={room.type}

          style={{

            width: '100%',

            height: '100%',

            objectFit: 'cover',

            transition: 'transform 0.3s ease'

          }}

          onError={(e) => {

            e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';

          }}

          onMouseEnter={(e) => {

            e.currentTarget.style.transform = 'scale(1.05)';

          }}

          onMouseLeave={(e) => {

            e.currentTarget.style.transform = 'scale(1)';

          }}

        />

        {!isAvailable && (

          <div style={{

            position: 'absolute',

            top: '12px',

            left: '12px',

            backgroundColor: 'var(--gray-600)',

            color: 'white',

            padding: '6px 12px',

            borderRadius: 'var(--radius-sm)',

            fontSize: '13px',

            fontWeight: '600'

          }}>

            No disponible

          </div>

        )}

      </div>

 

      {/* Contenido */}

      <div style={{

        flex: 1,

        display: 'flex',

        flexDirection: 'column',

        justifyContent: 'space-between'

      }}>

        {/* Superior */}

        <div>

          {/* Tipo y Rating */}

          <div style={{

            display: 'flex',

            alignItems: 'center',

            justifyContent: 'space-between',

            marginBottom: '8px'

          }}>

            <span style={{

              fontSize: '13px',

              fontWeight: '600',

              color: 'var(--gray-500)',

              textTransform: 'uppercase',

              letterSpacing: '0.5px'

            }}>

              {getTypeLabel(room.type)}

            </span>

            <div style={{

              display: 'flex',

              alignItems: 'center',

              gap: '4px'

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

                ({reviewCount})

              </span>

            </div>

          </div>

 

          {/* Título */}

          <h3 style={{

            fontSize: '20px',

            fontWeight: '600',

            color: 'var(--gray-600)',

            margin: '0 0 12px 0',

            letterSpacing: '-0.3px'

          }}>

            Habitación {room.code}

          </h3>

 

          {/* Descripción */}

          <p style={{

            fontSize: '15px',

            color: 'var(--gray-500)',

            margin: '0 0 16px 0',

            lineHeight: '1.5',

            display: '-webkit-box',

            WebkitLineClamp: 2,

            WebkitBoxOrient: 'vertical',

            overflow: 'hidden'

          }}>

            {room.description}

          </p>

 

          {/* Capacidad */}

          <div style={{

            display: 'flex',

            alignItems: 'center',

            gap: '6px',

            marginBottom: '12px',

            color: 'var(--gray-500)',

            fontSize: '15px'

          }}>

            <span>👥</span>

            <span>{room.capacity} {room.capacity === 1 ? 'huésped' : 'huéspedes'}</span>

          </div>

 

          {/* Servicios */}

          {services.length > 0 && (

            <div style={{

              display: 'flex',

              gap: '16px',

              flexWrap: 'wrap',

              marginBottom: '16px'

            }}>

              {services.slice(0, 5).map((service, idx) => (

                <div

                  key={idx}

                  style={{

                    display: 'flex',

                    alignItems: 'center',

                    gap: '6px',

                    fontSize: '14px',

                    color: 'var(--gray-500)'

                  }}

                >

                  <span style={{ fontSize: '16px' }}>{service.icon}</span>

                  <span>{service.label}</span>

                </div>

              ))}

            </div>

          )}

        </div>

 

        {/* Inferior - Precio */}

        <div style={{

          display: 'flex',

          alignItems: 'flex-end',

          justifyContent: 'space-between',

          borderTop: '1px solid var(--gray-100)',

          paddingTop: '16px'

        }}>

          <div>

            <div style={{

              display: 'flex',

              alignItems: 'baseline',

              gap: '6px'

            }}>

              <span style={{

                fontSize: '22px',

                fontWeight: '600',

                color: 'var(--gray-600)'

              }}>

                S/ {room.price_per_night}

              </span>

              <span style={{

                fontSize: '15px',

                color: 'var(--gray-400)'

              }}>

                / noche

              </span>

            </div>

          </div>

 

          <button

            onClick={(e) => {

              e.stopPropagation();

              navigate(`/rooms/${room.id}`);

            }}

            disabled={!isAvailable}

            style={{

              padding: '10px 24px',

              backgroundColor: isAvailable ? 'var(--gray-600)' : 'var(--gray-200)',

              color: isAvailable ? 'white' : 'var(--gray-400)',

              border: 'none',

              borderRadius: 'var(--radius-sm)',

              fontSize: '15px',

              fontWeight: '600',

              cursor: isAvailable ? 'pointer' : 'not-allowed',

              transition: 'all 0.2s'

            }}

            onMouseEnter={(e) => {

              if (isAvailable) {

                e.currentTarget.style.backgroundColor = 'var(--gray-500)';

                e.currentTarget.style.transform = 'scale(1.02)';

              }

            }}

            onMouseLeave={(e) => {

              if (isAvailable) {

                e.currentTarget.style.backgroundColor = 'var(--gray-600)';

                e.currentTarget.style.transform = 'scale(1)';

              }

            }}

          >

            Ver detalles

          </button>

        </div>

      </div>

    </div>

  );

};
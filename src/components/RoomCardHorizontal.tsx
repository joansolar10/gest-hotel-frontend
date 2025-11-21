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
      single: 'Individual',
      double: 'Doble',
      suite: 'Suite Ejecutiva'
    };
    return types[type] || type;
  };

  const getRating = () => {
    // Simulado - en producción vendría de la BD
    const ratings = { single: 7.8, double: 8.5, suite: 9.2 };
    return ratings[room.type as keyof typeof ratings] || 8.0;
  };

  const getReviewCount = () => {
    // Simulado
    const counts = { single: 156, double: 241, suite: 89 };
    return counts[room.type as keyof typeof counts] || 100;
  };

  const services = [];
  if (room.services) {
    if (room.services.wifi) services.push({ icon: '📶', label: 'WiFi' });
    if (room.services.ac) services.push({ icon: '❄️', label: 'A/C' });
    if (room.services.tv) services.push({ icon: '📺', label: 'TV' });
    if (room.services.minibar) services.push({ icon: '🍷', label: 'Minibar' });
    if (room.services.jacuzzi) services.push({ icon: '🛁', label: 'Jacuzzi' });
  }

  const imageUrl = room.images && room.images.length > 0 
    ? room.images[0] 
    : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';

  const rating = getRating();
  const reviewCount = getReviewCount();

  const getRatingLabel = (score: number) => {
    if (score >= 9) return 'Excelente';
    if (score >= 8) return 'Muy bueno';
    if (score >= 7) return 'Bueno';
    return 'Agradable';
  };

  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.3s',
        cursor: 'pointer',
        height: '240px',
        border: '1px solid #e5e7eb'
      }}
      onClick={() => navigate(`/rooms/${room.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Imagen */}
      <div style={{ width: '280px', flexShrink: 0, position: 'relative' }}>
        <img
          src={imageUrl}
          alt={room.type}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';
          }}
        />
        {room.type === 'suite' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.375rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            Premium
          </div>
        )}
      </div>

      {/* Información */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {/* Tipo de habitación */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px'
            }}>
              {getTypeLabel(room.type)}
            </span>
            {!isAvailable && (
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#dc2626',
                backgroundColor: '#fee2e2',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}>
                No disponible
              </span>
            )}
          </div>

          {/* Nombre */}
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            Habitación {room.code}
          </h3>

          {/* Descripción */}
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: '0 0 1rem 0',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {room.description}
          </p>

          {/* Capacidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1rem' }}>👥</span>
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
            </span>
          </div>

          {/* Servicios */}
          {services.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {services.slice(0, 4).map((service, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    backgroundColor: '#f9fafb',
                    padding: '0.375rem 0.625rem',
                    borderRadius: '6px'
                  }}
                >
                  <span>{service.icon}</span>
                  <span>{service.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Precio y Rating */}
      <div style={{
        width: '200px',
        flexShrink: 0,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderLeft: '1px solid #e5e7eb'
      }}>
        {/* Rating */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#111827' }}>
                {getRatingLabel(rating)}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                {reviewCount} opiniones
              </div>
            </div>
            <div style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 0.625rem',
              borderRadius: '6px',
              fontSize: '0.95rem',
              fontWeight: 'bold'
            }}>
              {rating}
            </div>
          </div>
        </div>

        {/* Precio */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Desde
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>
            S/ {room.price_per_night}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
            por noche
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/rooms/${room.id}`);
            }}
            disabled={!isAvailable}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: isAvailable ? '#2563eb' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isAvailable ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (isAvailable) e.currentTarget.style.backgroundColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              if (isAvailable) e.currentTarget.style.backgroundColor = '#2563eb';
            }}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};
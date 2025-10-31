import React from 'react';
import { Link } from 'react-router-dom';
import { Room } from '../../types';
import { useVerification } from '../../hooks/useVerification';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  const { isVerified, loading } = useVerification();

  return (
    <Link
      to={`/rooms/${room.id}`}
      onClick={() => {
        // Guardar habitación para volver después de verificar
        if (!isVerified) {
          localStorage.setItem('intended_room', room.id);
        }
      }}
      style={{
        textDecoration: 'none',
        display: 'block'
      }}
    >
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}>
        {/* Badge de verificación requerida */}
        {!loading && !isVerified && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#fbbf24',
            color: '#78350f',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ⚠️ Verificación requerida
          </div>
        )}

        {/* Imagen */}
        <div style={{
          width: '100%',
          height: '200px',
          overflow: 'hidden',
          backgroundColor: '#f3f4f6'
        }}>
          <img
            src={room.images?.[0] || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
            alt={`Habitación ${room.code}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Contenido */}
        <div style={{ padding: '1.5rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Habitación {room.code}
              </h3>
              <span style={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {room.type === 'single' ? 'Individual' : room.type === 'double' ? 'Doble' : 'Suite'}
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
              {room.description}
            </p>
          </div>

          {/* Detalles */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#4b5563' }}>
              <span>👥 {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</span>
              {room.services?.wifi && <span>📶 WiFi</span>}
              {room.services?.tv && <span>📺 TV</span>}
              {room.services?.ac && <span>❄️ A/C</span>}
            </div>
          </div>

          {/* Precio y botón visual */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#2563eb' }}>
                S/ {room.price_per_night}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                por noche
              </div>
            </div>

            <div style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#9ca3af' : (!isVerified ? '#fbbf24' : '#2563eb'),
              color: loading ? '#6b7280' : (!isVerified ? '#78350f' : 'white'),
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              {loading ? 'Cargando...' : (!isVerified ? '🔒 Verificar DNI' : 'Ver detalles')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
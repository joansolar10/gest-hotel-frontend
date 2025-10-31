import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomFilters } from '../components/rooms/RoomFilters';
import { RoomCard } from '../components/rooms/RoomCard';
import { roomService } from '../services/room.service';
import { Room, RoomFilters as RoomFiltersType } from '../types';
import { useVerification } from '../hooks/useVerification';
import toast from 'react-hot-toast';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const { isVerified } = useVerification();
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async (newFilters?: RoomFiltersType) => {
    try {
      setLoading(true);
      const response = await roomService.getRooms(newFilters || filters);
      
      const roomsData = response.data?.data || response.data || [];
      
      console.log('📊 Habitaciones cargadas:', roomsData.length);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (error) {
      toast.error('Error al cargar habitaciones');
      console.error('Error loading rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: RoomFiltersType) => {
    setFilters(newFilters);
    loadRooms(newFilters);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '2rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem' 
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            Hotel Los Andes
          </h1>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>
            Encuentra la habitación perfecta para tu estadía
          </p>
        </div>
      </div>

      {/* 🧪 BOTÓN DE PRUEBA - TEMPORAL */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto 2rem', 
        padding: '0 1rem',
        textAlign: 'center'
      }}>
        <button
          onClick={() => {
            console.log('🧪 TEST: Click en botón de prueba');
            console.log('🧪 TEST: isVerified =', isVerified);
            console.log('🧪 TEST: Navegando a /verify-dni...');
            
            toast.success('Navegando a verificación...', { duration: 1000 });
            
            setTimeout(() => {
              navigate('/verify-dni');
            }, 500);
          }}
          style={{
            padding: '1.5rem 3rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: '4px solid #dc2626',
            borderRadius: '8px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#ef4444';
          }}
        >
          🧪 TEST: IR A VERIFICACIÓN DNI
        </button>
        <p style={{ 
          marginTop: '0.5rem', 
          color: '#6b7280', 
          fontSize: '0.875rem' 
        }}>
          ⬆️ Este botón es temporal para probar la navegación
        </p>
      </div>

      {/* Banner de verificación */}
      {!isVerified && (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 2rem', 
          padding: '0 1rem' 
        }}>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>🪪</span>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#78350f' }}>
                  Verificación de identidad pendiente
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#92400e', fontSize: '0.875rem' }}>
                  Para realizar una reserva, primero debes verificar tu DNI con RENIEC
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                console.log('🔵 Click en botón del banner');
                navigate('/verify-dni');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              Verificar ahora →
            </button>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 1rem 2rem' 
      }}>
        {/* Filtros */}
        <RoomFilters onFilterChange={handleFilterChange} />

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Cargando habitaciones...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Lista de habitaciones */}
        {!loading && rooms.length > 0 && (
          <>
            <div style={{ marginBottom: '1rem', color: '#6b7280' }}>
              Encontradas {rooms.length} habitación(es)
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {rooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onSelect={() => {}}
                />
              ))}
            </div>
          </>
        )}

        {/* Sin resultados */}
        {!loading && rooms.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No se encontraron habitaciones
            </h3>
            <p style={{ color: '#6b7280' }}>
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

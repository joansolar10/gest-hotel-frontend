import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { RoomCardHorizontal } from '../components/RoomCardHorizontal';
import { roomService } from '../services/room.service';
import { Room, RoomFilters as RoomFiltersType } from '../types';
import { useVerification } from '../hooks/useVerification';
import toast from 'react-hot-toast';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RoomFiltersType>({});
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
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

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price_per_night - b.price_per_night;
    if (sortBy === 'price_desc') return b.price_per_night - a.price_per_night;
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header moderno */}
      <div style={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1.5rem 0'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
              Encuentra tu habitación ideal
            </h1>
            <p style={{ marginTop: '0.25rem', color: '#6b7280', fontSize: '0.95rem' }}>
              {rooms.length} propiedades en Hotel Los Andes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: 'white'
              }}
            >
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valoradas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Banner de verificación */}
      {!isVerified && (
        <div style={{ 
          maxWidth: '1400px', 
          margin: '1.5rem auto 0', 
          padding: '0 2rem' 
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
              onClick={() => navigate('/verify-dni')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
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

      {/* Layout principal */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '2rem auto', 
        padding: '0 2rem 0.5rem',
        display: 'flex',
        gap: '1.5rem'
      }}>
        {/* Sidebar izquierdo */}
        <FilterSidebar onFilterChange={handleFilterChange} />

        {/* Contenido principal */}
        <div style={{ flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{
                display: 'inline-block',
                width: '50px',
                height: '50px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                Buscando las mejores opciones...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!loading && sortedRooms.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {sortedRooms.map((room) => (
                <RoomCardHorizontal key={room.id} room={room} />
              ))}
            </div>
          )}

          {!loading && sortedRooms.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
                No encontramos habitaciones
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Intenta ajustar los filtros de búsqueda o las fechas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
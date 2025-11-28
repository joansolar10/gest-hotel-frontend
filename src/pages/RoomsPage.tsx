import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
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

  const sortOptions = [
    { value: 'price_asc', label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'rating', label: 'Mejor valoradas' }
  ];

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

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      single: 'Individual',
      double: 'Doble',
      suite: 'Suite Premium'
    };
    return types[type] || type;
  };

  const getSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : 'Precio: menor a mayor';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Hero Section */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gray-100)'
      }}>
        <div style={{
          maxWidth: '1760px',
          margin: '0 auto',
          padding: '48px 40px 40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            margin: '0 0 12px 0',
            color: 'var(--gray-600)',
            letterSpacing: '-0.5px'
          }}>
            Encuentra tu estadía perfecta
          </h1>
          <p style={{
            margin: 0,
            color: 'var(--gray-500)',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            {rooms.length} habitaciones disponibles en Hotel Los Andes
          </p>
        </div>
      </div>

      {/* Banner de verificación */}
      {!isVerified && (
        <div style={{
          backgroundColor: '#FFF4E6',
          borderBottom: '1px solid #FFE4B5'
        }}>
          <div style={{
            maxWidth: '1760px',
            margin: '0 auto',
            padding: '24px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}>
                🪪
              </div>
              <div>
                <p style={{
                  margin: 0,
                  fontWeight: '600',
                  color: 'var(--gray-600)',
                  fontSize: '16px'
                }}>
                  Verifica tu identidad para reservar
                </p>
                <p style={{
                  margin: '4px 0 0 0',
                  color: 'var(--gray-500)',
                  fontSize: '14px'
                }}>
                  Necesitas verificar tu DNI con RENIEC antes de hacer una reserva
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/verify-dni')}
              style={{
                backgroundColor: 'var(--gray-600)',
                color: 'white',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-500)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-600)'}
            >
              Verificar ahora
            </Button>
          </div>
        </div>
      )}

      {/* Layout principal */}
      <div style={{
        maxWidth: '1760px',
        margin: '0 auto',
        padding: '40px 40px 60px',
        display: 'flex',
        gap: '40px'
      }}>
        {/* Sidebar de filtros */}
        <FilterSidebar onFilterChange={handleFilterChange} />

        {/* Contenido principal */}
        <div style={{ flex: 1 }}>
          {/* Barra de ordenamiento */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: 'var(--gray-500)'
            }}>
              {loading ? 'Cargando...' : `${sortedRooms.length} habitaciones`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{
                fontSize: '14px',
                color: 'var(--gray-600)',
                fontWeight: '600'
              }}>
                Ordenar por:
              </label>
              
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="outline"
                    style={{
                      justifyContent: 'space-between',
                      minWidth: '220px',
                      padding: '10px 12px',
                      fontSize: '15px'
                    }}
                  >
                    <span>{getSortLabel()}</span>
                    <ChevronDownIcon
                      aria-hidden="true"
                      size={16}
                      style={{ opacity: 0.6 }}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-100)'
            }}>
              <div style={{
                display: 'inline-block',
                width: '48px',
                height: '48px',
                border: '4px solid var(--gray-100)',
                borderTopColor: 'var(--gray-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{
                marginTop: '20px',
                color: 'var(--gray-500)',
                fontSize: '15px'
              }}>
                Buscando las mejores opciones...
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Lista de habitaciones */}
          {!loading && sortedRooms.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {sortedRooms.map((room) => {
                const isAvailable = room.status === 'available';
                const roomImage = room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';
                
                return (
                  <div
                    key={room.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '320px 1fr',
                      gap: 0
                    }}>
                      {/* Imagen */}
                      <div
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        style={{
                          position: 'relative',
                          height: '240px',
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={roomImage}
                          alt={`Habitación ${room.code}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s'
                          }}
                          onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        {!isAvailable && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            padding: '6px 12px',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
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
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div onClick={() => navigate(`/rooms/${room.id}`)}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px'
                          }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--gray-500)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {getTypeLabel(room.type)}
                            </span>
                            <span style={{ color: 'var(--gray-200)' }}>•</span>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              <span style={{ fontSize: '14px' }}>⭐</span>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'var(--gray-600)'
                              }}>
                                4.87
                              </span>
                            </div>
                          </div>

                          <h3 style={{
                            fontSize: '22px',
                            fontWeight: '600',
                            margin: '0 0 12px 0',
                            color: 'var(--gray-600)',
                            letterSpacing: '-0.3px'
                          }}>
                            Habitación {room.code}
                          </h3>

                          <p style={{
                            fontSize: '15px',
                            color: 'var(--gray-500)',
                            lineHeight: '1.6',
                            margin: '0 0 16px 0'
                          }}>
                            {room.description || 'Habitación cómoda y bien equipada para tu estadía perfecta.'}
                          </p>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '14px',
                            color: 'var(--gray-500)',
                            marginBottom: '20px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>👥</span>
                              <span>{room.capacity} huéspedes</span>
                            </div>
                          </div>
                        </div>

                        {/* Precio y botón */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '6px'
                            }}>
                              <span style={{
                                fontSize: '28px',
                                fontWeight: '700',
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

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/rooms/${room.id}`);
                            }}
                            disabled={!isAvailable}
                            style={{
                              padding: '14px 32px',
                              background: isAvailable ? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' : '#cbd5e1',
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '700',
                              boxShadow: isAvailable ? '0 4px 16px rgba(255, 56, 92, 0.3)' : 'none',
                              whiteSpace: 'nowrap',
                              cursor: isAvailable ? 'pointer' : 'not-allowed'
                            }}
                            onMouseEnter={(e) => {
                              if (isAvailable) {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 56, 92, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (isAvailable) {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 56, 92, 0.3)';
                              }
                            }}
                          >
                            {isAvailable ? 'Ver detalles' : 'No disponible'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Estado vacío */}
          {!loading && sortedRooms.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-100)'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '24px',
                opacity: 0.5
              }}>
                🔍
              </div>
              <h3 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'var(--gray-600)'
              }}>
                No encontramos habitaciones
              </h3>
              <p style={{
                color: 'var(--gray-500)',
                fontSize: '16px',
                lineHeight: '1.5',
                marginBottom: '24px'
              }}>
                Intenta ajustar los filtros de búsqueda o las fechas para ver más opciones
              </p>
              <Button
                onClick={() => handleFilterChange({})}
                style={{
                  backgroundColor: 'var(--gray-600)',
                  color: 'white',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-500)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-600)'}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
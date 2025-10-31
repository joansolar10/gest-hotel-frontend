import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../services/room.service';
import { Room } from '../types';
import toast from 'react-hot-toast';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('🏨 [RoomDetailPage] Montando componente, ID:', id);
    loadRoom();
  }, [id]);

  useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!room) return;
    
    if (e.key === 'ArrowLeft') {
      setSelectedImage(prev => prev === 0 ? room.images.length - 1 : prev - 1);
    } else if (e.key === 'ArrowRight') {
      setSelectedImage(prev => prev === room.images.length - 1 ? 0 : prev + 1);
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [room]);

  const loadRoom = async () => {
    try {
      console.log('📡 [RoomDetailPage] Cargando habitación:', id);
      setLoading(true);
      if (id) {
        const data = await roomService.getRoomById(id);
        console.log('✅ [RoomDetailPage] Habitación cargada:', data);
        setRoom(data);
      }
    } catch (error) {
      console.error('❌ [RoomDetailPage] Error:', error);
      toast.error('Error al cargar la habitación');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error('Selecciona las fechas de check-in y check-out');
      return;
    }

    if (!id) return;

    try {
      setCheckingAvailability(true);
      const available = await roomService.checkAvailability(id, checkIn, checkOut);
      setIsAvailable(available);
      
      if (available) {
        toast.success('¡Habitación disponible!');
      } else {
        toast.error('Habitación no disponible para estas fechas');
      }
    } catch (error) {
      toast.error('Error al verificar disponibilidad');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleReserve = () => {
  if (!checkIn || !checkOut) {
    toast.error('Selecciona las fechas primero');
    return;
  }

  if (isAvailable === false) {
    toast.error('La habitación no está disponible para estas fechas');
    return;
  }

  // Navegar a página de reserva con parámetros
  navigate(`/reservations/new?room=${id}&checkIn=${checkIn}&checkOut=${checkOut}`);
};

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room) return 0;
    return calculateNights() * room.price_per_night;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
        <h2>Habitación no encontrada</h2>
        <button
          onClick={() => navigate('/rooms')}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Volver a habitaciones
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '1.5rem 0' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/rooms')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
            Habitación {room.code}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '2rem auto', 
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem'
      }}>
        {/* Columna izquierda */}
        <div>
          {/* Galería de imágenes */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Imagen principal */}
          <div style={{ position: 'relative' }}>
            <img
              src={room.images[selectedImage] || 'https://via.placeholder.com/800x500?text=Habitacion'}
              alt={`Habitación ${room.code}`}
              style={{
                width: '100%',
                height: '500px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem',
                transition: 'transform 0.3s ease',
                cursor: 'zoom-in'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            
            {/* Contador de imágenes */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              right: '1.5rem',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              {selectedImage + 1} / {room.images.length}
            </div>

            {/* Botones de navegación */}
            {room.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImage(prev => prev === 0 ? room.images.length - 1 : prev - 1)}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
                
                <button
                  onClick={() => setSelectedImage(prev => prev === room.images.length - 1 ? 0 : prev + 1)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Miniaturas mejoradas */}
          {room.images.length > 1 && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '0.75rem',
              maxHeight: '150px',
              overflowY: 'auto'
            }}>
              {room.images.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: selectedImage === index ? '3px solid #2563eb' : '2px solid #e5e7eb',
                    transition: 'all 0.2s'
                  }}
                >
                  <img
                    src={img || `https://via.placeholder.com/150x100?text=Img${index + 1}`}
                    alt={`Vista ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      opacity: selectedImage === index ? 1 : 0.7,
                      transition: 'opacity 0.2s'
                    }}
                  />
                  {selectedImage === index && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(37, 99, 235, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ 
                        color: 'white', 
                        fontSize: '1.5rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}>
                        ✓
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
          {/* Descripción */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                {room.type === 'single' ? 'Habitación Individual' : 
                 room.type === 'double' ? 'Habitación Doble' : 'Suite Ejecutiva'}
              </h2>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '4px',
                fontWeight: '600'
              }}>
                {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
              </span>
            </div>

            <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
              {room.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
                S/ {room.price_per_night}
              </span>
              <span style={{ color: '#6b7280' }}>por noche</span>
            </div>
          </div>

          {/* Servicios */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Servicios incluidos
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem' 
            }}>
              {room.services.wifi && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📶</span>
                  <span>WiFi gratuito</span>
                </div>
              )}
              {room.services.tv && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>📺</span>
                  <span>TV por cable</span>
                </div>
              )}
              {room.services.ac && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>❄️</span>
                  <span>Aire acondicionado</span>
                </div>
              )}
              {room.services.minibar && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🍹</span>
                  <span>Minibar</span>
                </div>
              )}
              {room.services.jacuzzi && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🛁</span>
                  <span>Jacuzzi</span>
                </div>
              )}
              {room.services.room_service && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🍽️</span>
                  <span>Servicio a la habitación</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Reserva */}
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Reserva tu estadía
            </h3>

            {/* Fechas */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setIsAvailable(null);
                }}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem' 
              }}>
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setIsAvailable(null);
                }}
                min={checkIn || new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}
              />
            </div>

            {/* Resumen */}
            {checkIn && checkOut && (
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f9fafb', 
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span>S/ {room.price_per_night} × {calculateNights()} noches</span>
                  <span>S/ {calculateTotal()}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #e5e7eb',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  <span>Total</span>
                  <span>S/ {calculateTotal()}</span>
                </div>
              </div>
            )}

            {/* Botón verificar disponibilidad */}
            <button
              onClick={handleCheckAvailability}
              disabled={!checkIn || !checkOut || checkingAvailability}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !checkIn || !checkOut || checkingAvailability ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                marginBottom: '0.5rem',
                opacity: !checkIn || !checkOut || checkingAvailability ? 0.5 : 1
              }}
            >
              {checkingAvailability ? 'Verificando...' : 'Verificar disponibilidad'}
            </button>

            {/* Estado de disponibilidad */}
            {isAvailable !== null && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '0.5rem',
                backgroundColor: isAvailable ? '#d1fae5' : '#fee2e2',
                color: isAvailable ? '#065f46' : '#991b1b',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {isAvailable ? '✓ Disponible' : '✗ No disponible'}
              </div>
            )}

            {/* Botón reservar */}
            <button
              onClick={handleReserve}
              disabled={!checkIn || !checkOut || isAvailable === false}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !checkIn || !checkOut || isAvailable === false ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: !checkIn || !checkOut || isAvailable === false ? 0.5 : 1
              }}
            >
              Reservar ahora
            </button>

            <p style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280', 
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              No se realizará ningún cargo todavía
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
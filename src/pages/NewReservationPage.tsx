import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/room.service';
import { Room } from '../types';
import toast from 'react-hot-toast';
import api from '../services/api';

export const NewReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const roomId = searchParams.get('room');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Datos del formulario
  const [checkIn, setCheckIn] = useState(checkInParam || '');
  const [checkOut, setCheckOut] = useState(checkOutParam || '');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDni, setGuestDni] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  useEffect(() => {
    // Verificar autenticación
    if (!user) {
      toast.error('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    if (!roomId) {
      toast.error('No se especificó la habitación');
      navigate('/rooms');
      return;
    }

    loadRoom();
  }, [roomId, user]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      if (roomId) {
        const data = await roomService.getRoomById(roomId);
        setRoom(data);
        
        // Pre-llenar datos del usuario
        if (user) {
          setGuestName(user.name || '');
          setGuestDni(user.dni || '');
          setGuestPhone(user.phone || '');
        }
      }
    } catch (error) {
      toast.error('Error al cargar la habitación');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!checkIn || !checkOut) {
      toast.error('Selecciona las fechas de estadía');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('La fecha de salida debe ser posterior a la de entrada');
      return;
    }

    if (!guestName || !guestPhone || !guestDni) {
      toast.error('Completa todos los datos del huésped');
      return;
    }

    if (guestDni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return;
    }

    if (guests < 1 || (room && guests > room.capacity)) {
      toast.error(`Número de huéspedes inválido (máx: ${room?.capacity})`);
      return;
    }

    try {
      setSubmitting(true);

      // Verificar disponibilidad una última vez
      if (roomId) {
        const available = await roomService.checkAvailability(roomId, checkIn, checkOut);
        if (!available) {
          toast.error('La habitación ya no está disponible para estas fechas');
          return;
        }
      }

      // Crear reserva
      const response = await api.post('/api/v1/reservations', {
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        guest_details: {
          name: guestName,
          phone: guestPhone,
          dni: guestDni,
          special_requests: specialRequests
        }
      });

      toast.success('¡Reserva creada! Procede al pago'); // ← ✅ CAMBIADO
      navigate(`/payments/${response.data.id}`); // ← ✅ CAMBIADO: Redirige a pago
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al crear la reserva';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
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
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!room) {
    return null;
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
            onClick={() => navigate(`/rooms/${roomId}`)}
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
            Nueva Reserva
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 350px', 
          gap: '2rem' 
        }}>
          {/* Formulario */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Información de la reserva
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Check-in *
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Check-out *
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              {/* Número de huéspedes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Número de huéspedes * (máx: {room.capacity})
                </label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  min={1}
                  max={room.capacity}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Datos del huésped principal
              </h3>

              {/* Nombre */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="Ej: Juan Pérez García"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                />
              </div>

              {/* Teléfono y DNI */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="987654321"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    DNI *
                  </label>
                  <input
                    type="text"
                    value={guestDni}
                    onChange={(e) => setGuestDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    required
                    placeholder="12345678"
                    maxLength={8}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>

              {/* Solicitudes especiales */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Solicitudes especiales (opcional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Ej: Cama adicional, piso alto, vista al mar..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.5 : 1
                }}
              >
                {submitting ? 'Creando reserva...' : 'Confirmar reserva'}
              </button>
            </form>
          </div>

          {/* Resumen */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Resumen
              </h3>

              <img
                src={room.images[0] || 'https://via.placeholder.com/300x200'}
                alt={`Habitación ${room.code}`}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />

              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Habitación {room.code}
              </h4>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {room.type === 'single' ? 'Individual' : room.type === 'double' ? 'Doble' : 'Suite'}
              </p>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              {checkIn && checkOut && (
                <>
                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Check-in:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(checkIn).toLocaleDateString('es-PE')}</span>
                  </div>
                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Check-out:</span>
                    <span style={{ fontWeight: '500' }}>{new Date(checkOut).toLocaleDateString('es-PE')}</span>
                  </div>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>Huéspedes:</span>
                    <span style={{ fontWeight: '500' }}>{guests}</span>
                  </div>

                  <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                  <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>S/ {room.price_per_night} × {calculateNights()} noches</span>
                    <span>S/ {calculateTotal()}</span>
                  </div>

                  <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <span>Total</span>
                    <span style={{ color: '#2563eb' }}>S/ {calculateTotal()}</span>
                  </div>
                </>
              )}
            </div>

            <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', marginTop: '1rem' }}>
              Al confirmar la reserva, se bloqueará la habitación por 15 minutos para proceder con el pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
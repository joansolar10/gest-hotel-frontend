import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/room.service';
import { Room } from '../types';
import toast from 'react-hot-toast';
import api from '../services/api';
import { ServicesSelector } from '../components/ServicesSelector';
import { DiscountSelector } from '../components/DiscountSelector';

export const NewReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: roomId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [checkIn, setCheckIn] = useState(checkInParam || '');
  const [checkOut, setCheckOut] = useState(checkOutParam || '');
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDni, setGuestDni] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [validations, setValidations] = useState({
    name: false,
    phone: false,
    dni: false
  });

  useEffect(() => {
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

  useEffect(() => {
    setValidations({
      name: guestName.length >= 3,
      phone: guestPhone.length >= 9,
      dni: guestDni.length === 8
    });
  }, [guestName, guestPhone, guestDni]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      if (roomId) {
        const data = await roomService.getRoomById(roomId);
        setRoom(data);
        
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
    const roomTotal = calculateNights() * room.price_per_night;
    const servicesTotal = selectedServices.reduce((sum, s) => sum + s.subtotal, 0);
    const subtotal = roomTotal + servicesTotal;
    return Math.max(0, subtotal - discountAmount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      toast.error('Selecciona las fechas de estadía');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('La fecha de salida debe ser posterior a la de entrada');
      return;
    }

    if (!validations.name || !validations.phone || !validations.dni) {
      toast.error('Completa correctamente todos los datos');
      return;
    }

    if (guests < 1 || (room && guests > room.capacity)) {
      toast.error(`Número de huéspedes inválido (máx: ${room?.capacity})`);
      return;
    }

    try {
      setSubmitting(true);

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
        },
        services: selectedServices,
        discount_id: selectedDiscount
      });

      toast.success('¡Reserva creada! Procede al pago');
      navigate(`/payment/${response.data.id}`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al crear la reserva';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!room) return null;

  const roomImage = room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';
  const nights = calculateNights();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', marginLeft: '-54px', paddingBottom: '3rem' }}>
      {/* Stepper */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 0 calc(2rem + 54px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {[
              { step: 1, label: 'Fechas & Habitación', active: true, completed: true },
              { step: 2, label: 'Detalles', active: true, completed: false },
              { step: 3, label: 'Pago', active: false, completed: false },
              { step: 4, label: 'Confirmación', active: false, completed: false }
            ].map((item, idx) => (
              <React.Fragment key={idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: item.completed ? '#10b981' : item.active ? '#2563eb' : '#e5e7eb',
                    color: item.active || item.completed ? 'white' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {item.completed ? '✓' : item.step}
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: item.active ? '600' : '500',
                    color: item.active ? '#111827' : '#6b7280'
                  }}>
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: item.completed ? '#10b981' : '#e5e7eb',
                    maxWidth: '60px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto 2rem 54px', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Columna izquierda */}
          <div>
            {/* Card de habitación */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
                <img
                  src={roomImage}
                  alt={`Habitación ${room.code}`}
                  style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '600', marginBottom: '0.25rem' }}>
                    {room.type === 'single' ? 'INDIVIDUAL' : room.type === 'double' ? 'DOBLE' : 'SUITE'}
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#111827' }}>
                    Habitación {room.code}
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    <div><strong>Área:</strong> {room.capacity * 15} m²</div>
                    <div><strong>Camas:</strong> {room.capacity}</div>
                    <div><strong>Huéspedes:</strong> {room.capacity}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Good to know */}
            <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #86efac' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem', color: '#166534' }}>
                Información importante
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#166534', margin: 0 }}>
                ✓ Cancelación gratuita hasta 11:59 del {checkIn ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() - 1)).toLocaleDateString('es-PE', { day: 'numeric', month: 'long' }) : '...'}
                <br />✓ No se te cobrará en este momento. Tendrás que pagar en el alojamiento.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                  Ingresa tus datos
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      placeholder="Nombre"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        paddingRight: '2.5rem',
                        border: `2px solid ${validations.name ? '#10b981' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {validations.name && (
                      <div style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '2.2rem',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
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
                        padding: '0.75rem',
                        paddingRight: '2.5rem',
                        border: `2px solid ${validations.dni ? '#10b981' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {validations.dni && (
                      <div style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '2.2rem',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    placeholder="+51 987 654 321"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingRight: '2.5rem',
                      border: `2px solid ${validations.phone ? '#10b981' : '#d1d5db'}`,
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {validations.phone && (
                    <div style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '2.2rem',
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
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
                      padding: '0.75rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      transition: 'border-color 0.2s',
                      marginBottom: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
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
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', textTransform: 'uppercase' }}>
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
                        padding: '0.75rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        transition: 'border-color 0.2s'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Add to your stay */}
              {checkIn && checkOut && nights > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                    Agrega a tu estadía
                  </h2>
                  
                  <ServicesSelector 
                    onServicesChange={setSelectedServices}
                    nights={nights}
                  />
                  
                  <div style={{ marginTop: '1.5rem' }}>
                    <DiscountSelector
                      nights={nights}
                      subtotal={calculateTotal() + discountAmount}
                      onDiscountApplied={(amount, id) => {
                        setDiscountAmount(amount);
                        setSelectedDiscount(id);
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !validations.name || !validations.phone || !validations.dni || !checkIn || !checkOut}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: (submitting || !validations.name || !validations.phone || !validations.dni || !checkIn || !checkOut) ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (submitting || !validations.name || !validations.phone || !validations.dni || !checkIn || !checkOut) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!submitting && validations.name && validations.phone && validations.dni && checkIn && checkOut) {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting && validations.name && validations.phone && validations.dni && checkIn && checkOut) {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }
                }}
              >
                {submitting ? 'Procesando...' : 'Proceder al pago'}
              </button>
            </form>
          </div>

          {/* Columna derecha - Resumen */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                Resumen de reserva
              </h3>

              {/* Fechas */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Check-in</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: checkIn ? '#111827' : '#9ca3af', marginBottom: '0.125rem' }}>
                      {checkIn ? new Date(checkIn).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Desde 14:00</div>
                  </div>
                  
                  <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.25rem' }}>Check-out</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: checkOut ? '#111827' : '#9ca3af', marginBottom: '0.125rem' }}>
                      {checkOut ? new Date(checkOut).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Seleccionar'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Hasta 11:00</div>
                  </div>
                </div>

                {nights > 0 && (
                  <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '6px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500' }}>
                      Duración total: <strong>{nights} {nights === 1 ? 'noche' : 'noches'}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Has seleccionado */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Has seleccionado
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827' }}>
                  Habitación {room.code}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
                </div>
              </div>

              {/* Resumen de precio - SIEMPRE VISIBLE */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                  Resumen de precio
                </div>

                {nights > 0 ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                      <span style={{ color: '#6b7280' }}>Habitación ({nights} {nights === 1 ? 'noche' : 'noches'})</span>
                      <span style={{ fontWeight: '500', color: '#111827' }}>S/ {(room.price_per_night * nights).toFixed(2)}</span>
                    </div>

                    {selectedServices.length > 0 && selectedServices.map((service, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#6b7280' }}>Servicio × {service.quantity}</span>
                        <span style={{ fontWeight: '500', color: '#111827' }}>S/ {service.subtotal.toFixed(2)}</span>
                      </div>
                    ))}

                    {discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{ color: '#10b981', fontWeight: '500' }}>Descuento</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}>- S/ {discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div style={{ borderTop: '2px solid #e5e7eb', marginTop: '1rem', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#111827' }}>Precio total</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>S/ {calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                      Selecciona las fechas para ver el precio
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                      Precio desde S/ {room.price_per_night}/noche
                    </div>
                  </div>
                )}
              </div>

              {/* Nota informativa */}
              <div style={{ marginTop: '1.5rem', backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '0.75rem', color: '#92400e', margin: 0, lineHeight: '1.5' }}>
                  💡 Se reservará la habitación por 15 minutos para proceder con el pago.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
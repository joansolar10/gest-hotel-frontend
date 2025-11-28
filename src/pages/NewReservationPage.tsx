import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomService } from '../services/room.service';
import { Room } from '../types';
import toast from 'react-hot-toast';
import api from '../services/api';
import { ServicesSelector } from '../components/ServicesSelector';
import { DiscountSelector } from '../components/DiscountSelector';
import { RangeCalendar } from '../components/ui/calendar-rac';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { NumberField } from '../components/ui/number-field';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import type { DateRange } from 'react-aria-components';

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

  const now = today(getLocalTimeZone());
  const [dateRange, setDateRange] = useState<DateRange | null>(
    checkInParam && checkOutParam
      ? {
          start: parseDate(checkInParam),
          end: parseDate(checkOutParam)
        }
      : {
          start: now,
          end: now.add({ days: 3 })
        }
  );

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

  React.useEffect(() => {
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

  React.useEffect(() => {
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
    if (!dateRange?.start || !dateRange?.end) return 0;
    const start = new Date(dateRange.start.toString());
    const end = new Date(dateRange.end.toString());
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

    if (!dateRange?.start || !dateRange?.end) {
      toast.error('Selecciona las fechas de estadía');
      return;
    }

    const checkIn = dateRange.start.toString();
    const checkOut = dateRange.end.toString();

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

  const roomImage = room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';
  const nights = calculateNights();
  const isFormValid = validations.name && validations.phone && validations.dni && dateRange?.start && dateRange?.end && !submitting;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)', paddingBottom: '140px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gray-100)',
        padding: '24px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <button
            onClick={() => navigate(`/rooms/${roomId}`)}
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
              fontWeight: '600'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← Volver
          </button>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            margin: '16px 0 0 0',
            color: 'var(--gray-600)',
            letterSpacing: '-0.5px'
          }}>
            Confirma y paga
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{
        maxWidth: '1400px',
        margin: '48px auto',
        padding: '0 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 480px',
        gap: '80px'
      }}>
        {/* Columna izquierda - Formulario */}
        <div style={{ paddingBottom: '40px' }}>
          <form onSubmit={handleSubmit}>
            {/* Información de contacto */}
            <div style={{ marginBottom: '48px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '600',
                marginBottom: '32px',
                color: 'var(--gray-600)'
              }}>
                Tu información
              </h2>

              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Nombre completo */}
                <div>
                  <Label htmlFor="guest-name">
                    Nombre completo
                  </Label>
                  <Input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Joaan"
                    required
                  />
                </div>

                {/* Grid de DNI y Teléfono */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  {/* DNI */}
                  <div>
                    <Label htmlFor="guest-dni">
                      DNI
                    </Label>
                    <Input
                      id="guest-dni"
                      type="text"
                      value={guestDni}
                      onChange={(e) => setGuestDni(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      placeholder="75268273"
                      maxLength={8}
                      required
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <Label htmlFor="guest-phone">
                      Teléfono
                    </Label>
                    <Input
                      id="guest-phone"
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+51 987 654 321"
                      required
                    />
                  </div>
                </div>

                {/* Solicitudes especiales (opcional) */}
                <div>
                  <Label htmlFor="special-requests">
                    Solicitudes especiales (Opcional)
                  </Label>
                  <textarea
                    id="special-requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="¿Tienes alguna solicitud especial? Ej: Piso alto, cama extra, almohadas adicionales..."
                    rows={4}
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '15px',
                      color: 'var(--gray-600)',
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  />
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--gray-400)',
                    marginTop: '6px'
                  }}>
                    {specialRequests.length}/500 caracteres
                  </div>
                </div>
              </div>
            </div>

            {/* Calendario de rango */}
            <div style={{
              marginBottom: '48px',
              padding: '32px',
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '24px',
                color: 'var(--gray-600)'
              }}>
                Selecciona tus fechas
              </h3>

              <RangeCalendar
                value={dateRange}
                onChange={setDateRange}
                minValue={now}
              />

              <div style={{ marginTop: '24px' }}>
                <NumberField
                  label={`Huéspedes (máx: ${room.capacity})`}
                  value={guests}
                  onChange={(value) => setGuests(value)}
                  minValue={1}
                  maxValue={room.capacity}
                />
              </div>
            </div>

            {/* Servicios adicionales */}
            {dateRange?.start && dateRange?.end && nights > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <ServicesSelector
                  onServicesChange={setSelectedServices}
                  nights={nights}
                />

                <div style={{ marginTop: '24px' }}>
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
          </form>
        </div>

        {/* Columna derecha - Resumen sticky */}
        <div>
          <div style={{
            position: 'sticky',
            top: '100px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              border: '1px solid var(--gray-200)',
              boxShadow: 'var(--shadow-lg)'
            }}>
              {/* Card de habitación */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '32px',
                paddingBottom: '32px',
                borderBottom: '1px solid var(--gray-100)'
              }}>
                <img
                  src={roomImage}
                  alt={`Habitación ${room.code}`}
                  style={{
                    width: '120px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0
                  }}
                  onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--gray-500)',
                    fontWeight: '600',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {room.type === 'single' ? 'Individual' : room.type === 'double' ? 'Doble' : 'Suite Premium'}
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'var(--gray-600)'
                  }}>
                    Habitación {room.code}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--gray-400)'
                  }}>
                    Hasta {room.capacity} huéspedes
                  </div>
                </div>
              </div>

              {/* Detalles de precios */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'var(--gray-600)'
                }}>
                  Detalles del precio
                </h3>

                {nights > 0 ? (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      fontSize: '15px'
                    }}>
                      <span style={{ color: 'var(--gray-500)' }}>
                        S/ {room.price_per_night} × {nights} {nights === 1 ? 'noche' : 'noches'}
                      </span>
                      <span style={{ fontWeight: '500', color: 'var(--gray-600)' }}>
                        S/ {(room.price_per_night * nights).toFixed(2)}
                      </span>
                    </div>

                    {selectedServices.length > 0 && selectedServices.map((service, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '12px',
                          fontSize: '15px'
                        }}
                      >
                        <span style={{ color: 'var(--gray-500)' }}>
                          Servicios × {service.quantity}
                        </span>
                        <span style={{ fontWeight: '500', color: 'var(--gray-600)' }}>
                          S/ {service.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {discountAmount > 0 && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        fontSize: '15px'
                      }}>
                        <span style={{ color: '#10B981', fontWeight: '500' }}>Descuento</span>
                        <span style={{ color: '#10B981', fontWeight: '600' }}>
                          - S/ {discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div style={{
                      borderTop: '1px solid var(--gray-100)',
                      marginTop: '20px',
                      paddingTop: '20px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'var(--gray-600)'
                        }}>
                          Total
                        </span>
                        <span style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: 'var(--gray-600)'
                        }}>
                          S/ {calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--gray-500)',
                      fontWeight: '500'
                    }}>
                      Selecciona las fechas para ver el precio
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón flotante oscuro - SIEMPRE VISIBLE */}
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
          maxWidth: '1400px',
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
              S/ {calculateTotal().toFixed(2)}
            </span>
            <span style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              total
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            style={{
              padding: '18px 56px',
              background: isFormValid ? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: isFormValid ? '0 4px 20px rgba(255, 56, 92, 0.4)' : 'none',
              minWidth: '240px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: isFormValid ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 56, 92, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 56, 92, 0.4)';
              }
            }}
          >
            {submitting ? '⏳ Procesando...' : '💳 Continuar al pago'}
          </button>
        </div>
      </div>
    </div>
  );
};
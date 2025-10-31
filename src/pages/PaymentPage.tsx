import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  total_amount: number;
  status: string;
  rooms: {
    code: string;
    type: string;
  };
}

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'yape' | 'card' | null>(null);
  const [processing, setProcessing] = useState(false);

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    loadReservation();
  }, [id, user]);

  const loadReservation = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/v1/reservations/${id}`);
      
      if (data.status !== 'pending_payment') {
        toast.error('Esta reserva ya fue procesada');
        navigate(`/reservations/${id}`);
        return;
      }

      setReservation(data);
    } catch (error: any) {
      toast.error('Error al cargar la reserva');
      navigate('/reservations');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: 'yape' | 'card') => {
    setSelectedMethod(method);
  };

  const handleYapePayment = async () => {
    if (!id) return;

    try {
      setProcessing(true);

      // Iniciar pago
      const { data: payment } = await api.post('/api/v1/payments/initiate', {
        reservation_id: id,
        method: 'yape'
      });

      toast.success('Procesando pago con Yape...');

      // Simular pago (en producción esto sería un webhook real)
      setTimeout(async () => {
        try {
          await api.post(`/api/v1/payments/simulate/yape/${payment.payment_id}?force=success`);
          
          toast.success('¡Pago exitoso!');
          navigate(`/reservations/${id}/confirmation`);
        } catch (error) {
          toast.error('Error al procesar el pago');
          setProcessing(false);
        }
      }, 3000);

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al iniciar pago');
      setProcessing(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      toast.error('Completa todos los campos de la tarjeta');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Número de tarjeta inválido');
      return;
    }

    if (!id) return;

    try {
      setProcessing(true);

      // Iniciar pago
      const { data: payment } = await api.post('/api/v1/payments/initiate', {
        reservation_id: id,
        method: 'card',
        card_data: {
          masked_pan: `****${cardNumber.slice(-4)}`,
          expiry: cardExpiry
        }
      });

      toast.success('Procesando pago...');

      // Simular pago
      setTimeout(async () => {
        try {
          await api.post(`/api/v1/payments/simulate/card/${payment.payment_id}?force=success`);
          
          toast.success('¡Pago exitoso!');
          navigate(`/reservations/${id}/confirmation`);
        } catch (error) {
          toast.error('Error al procesar el pago');
          setProcessing(false);
        }
      }, 2000);

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al procesar pago');
      setProcessing(false);
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

  if (!reservation) {
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
            onClick={() => navigate(`/reservations/${id}`)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            disabled={processing}
          >
            ←
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
            Procesar Pago
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        {/* Resumen */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Resumen del pago
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Habitación {reservation.rooms.code}</span>
            <span style={{ fontWeight: '500' }}>{reservation.rooms.type}</span>
          </div>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span>Total a pagar</span>
            <span style={{ color: '#2563eb' }}>S/ {reservation.total_amount}</span>
          </div>
        </div>

        {/* Métodos de pago */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Selecciona método de pago
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {/* Yape */}
            <button
              onClick={() => handlePaymentMethodSelect('yape')}
              disabled={processing}
              style={{
                padding: '1.5rem',
                border: selectedMethod === 'yape' ? '3px solid #2563eb' : '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: selectedMethod === 'yape' ? '#eff6ff' : 'white',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: processing ? 0.5 : 1
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💜</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>Yape</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Pago instantáneo
              </div>
            </button>

            {/* Tarjeta */}
            <button
              onClick={() => handlePaymentMethodSelect('card')}
              disabled={processing}
              style={{
                padding: '1.5rem',
                border: selectedMethod === 'card' ? '3px solid #2563eb' : '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: selectedMethod === 'card' ? '#eff6ff' : 'white',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: processing ? 0.5 : 1
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💳</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>Tarjeta</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                Crédito o débito
              </div>
            </button>
          </div>

          {/* Formulario de Yape */}
          {selectedMethod === 'yape' && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Pagar con Yape
              </h3>
              <div style={{ 
                width: '200px', 
                height: '200px', 
                backgroundColor: '#fff',
                margin: '0 auto 1rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '4rem' }}>📱</div>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Escanea el código QR con tu app de Yape
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Monto: <strong>S/ {reservation.total_amount}</strong>
              </p>
              <button
                onClick={handleYapePayment}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: '500',
                  cursor: processing ? 'not-allowed' : 'pointer',
                  opacity: processing ? 0.5 : 1
                }}
              >
                {processing ? 'Procesando...' : 'Confirmar pago con Yape'}
              </button>
            </div>
          )}

          {/* Formulario de Tarjeta */}
          {selectedMethod === 'card' && (
            <form onSubmit={handleCardPayment}>
              <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Datos de la tarjeta
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted);
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                    disabled={processing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                    Nombre del titular
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="NOMBRE APELLIDO"
                    required
                    disabled={processing}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Vencimiento
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardExpiry(value);
                      }}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                      disabled={processing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      required
                      disabled={processing}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: '500',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    marginTop: '1.5rem',
                    opacity: processing ? 0.5 : 1
                  }}
                >
                  {processing ? 'Procesando pago...' : `Pagar S/ ${reservation.total_amount}`}
                </button>
              </div>
            </form>
          )}

          {processing && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #bfdbfe',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '0.5rem'
              }} />
              <p style={{ color: '#1e40af', fontWeight: '500' }}>
                Procesando tu pago de forma segura...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useId } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCardIcon, QrCodeIcon } from 'lucide-react';
import { usePaymentInputs } from 'react-payment-inputs';
import images, { type CardImages } from 'react-payment-inputs/images';
import { Input } from '../components/ui/input';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  total_amount: number;
  status: string;
  check_in: string;
  check_out: string;
  rooms: {
    code: string;
    type: string;
    price_per_night: number;
  };
  services?: any[];
  discounts?: any[];
}

export const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputId = useId();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'yape' | 'card' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cardStarted, setCardStarted] = useState(false);

  // React Payment Inputs
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    if (!id) {
      toast.error('ID de reserva no válido');
      navigate('/rooms');
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

      const { data: servicesData } = await api.get(`/api/v1/services/reservation/${id}`);
      const { data: discountsData } = await api.get(`/api/v1/reservations/${id}/discounts`);

      setReservation({
        ...data,
        services: servicesData?.services || [],
        discounts: discountsData?.discounts || []
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al cargar la reserva');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!reservation) return 0;
    const start = new Date(reservation.check_in);
    const end = new Date(reservation.check_out);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleYapePayment = async () => {
    if (!id) return;

    try {
      setProcessing(true);

      const { data: payment } = await api.post('/api/v1/payments/initiate', {
        reservation_id: id,
        method: 'yape'
      });

      toast.success('Procesando pago con Yape...');

      setTimeout(async () => {
        try {
          await api.post(`/api/v1/payments/simulate/yape/${payment.payment_id}?force=success`);
          toast.success('¡Pago exitoso!');
          navigate(`/confirmation/${id}`);
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

    if (meta.error) {
      toast.error('Completa correctamente los datos de la tarjeta');
      return;
    }

    if (!id) return;

    try {
      setProcessing(true);

      const { data: payment } = await api.post('/api/v1/payments/initiate', {
        reservation_id: id,
        method: 'card',
        card_data: {
          masked_pan: '****',
          expiry: '**/**'
        }
      });

      toast.success('Procesando pago...');

      setTimeout(async () => {
        try {
          await api.post(`/api/v1/payments/simulate/card/${payment.payment_id}?force=success`);
          toast.success('¡Pago exitoso!');
          navigate(`/confirmation/${id}`);
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
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--gray-100)',
          borderTopColor: 'var(--gray-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!reservation) return null;

  const nights = calculateNights();
  const roomSubtotal = reservation.rooms.price_per_night * nights;
  const servicesTotal = reservation.services?.reduce((sum, s) => sum + s.subtotal, 0) || 0;
  const discountTotal = reservation.discounts?.reduce((sum, d) => sum + d.discount_amount, 0) || 0;
  const canProceed = selectedMethod !== null && !processing;

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      backgroundColor: 'var(--gray-50)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header compacto */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--gray-100)',
        padding: '12px 0',
        flexShrink: 0
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <button
              onClick={() => navigate('/rooms')}
              disabled={processing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                fontSize: '14px',
                color: processing ? 'var(--gray-300)' : 'var(--gray-600)',
                cursor: processing ? 'not-allowed' : 'pointer',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                transition: 'background-color 0.2s',
                fontWeight: '600',
                marginBottom: '4px'
              }}
              onMouseEnter={(e) => {
                if (!processing) e.currentTarget.style.backgroundColor = 'var(--gray-50)';
              }}
              onMouseLeave={(e) => {
                if (!processing) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ← Volver
            </button>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: 0,
              color: 'var(--gray-600)',
              letterSpacing: '-0.5px'
            }}>
              Paga tu estadía
            </h1>
          </div>
          <div style={{
            fontSize: '22px',
            fontWeight: '700',
            color: 'var(--airbnb-primary)'
          }}>
            S/ {reservation.total_amount.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '16px 32px 0',
        display: 'grid',
        gridTemplateColumns: '340px 1fr',
        gap: '20px',
        overflow: 'hidden'
      }}>
        {/* Resumen compacto */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-sm)',
          height: 'fit-content'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--gray-600)'
          }}>
            Resumen
          </h2>

          <div style={{
            fontSize: '13px',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--gray-100)'
          }}>
            <div style={{ fontWeight: '600', color: 'var(--gray-600)', marginBottom: '2px' }}>
              Habitación {reservation.rooms.code}
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: '12px' }}>
              {reservation.rooms.type} • {nights} {nights === 1 ? 'noche' : 'noches'}
            </div>
          </div>

          <div style={{ marginBottom: '10px', fontSize: '13px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px'
            }}>
              <span style={{ color: 'var(--gray-500)' }}>Alojamiento</span>
              <span style={{ fontWeight: '500', color: 'var(--gray-600)' }}>
                S/ {roomSubtotal.toFixed(2)}
              </span>
            </div>

            {reservation.services && reservation.services.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{ color: 'var(--gray-500)' }}>Servicios</span>
                <span style={{ fontWeight: '500', color: 'var(--gray-600)' }}>
                  S/ {servicesTotal.toFixed(2)}
                </span>
              </div>
            )}

            {reservation.discounts && reservation.discounts.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <span style={{ color: '#10B981', fontWeight: '500' }}>Descuento</span>
                <span style={{ color: '#10B981', fontWeight: '600' }}>
                  - S/ {discountTotal.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div style={{
            borderTop: '2px solid var(--gray-200)',
            marginTop: '10px',
            paddingTop: '10px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--gray-600)'
              }}>
                Total
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--airbnb-primary)'
              }}>
                S/ {reservation.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#F0FDF4',
            borderRadius: '8px',
            border: '1px solid #BBF7D0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '14px' }}>🔒</span>
              <span style={{
                fontSize: '12px',
                color: '#166534',
                fontWeight: '500'
              }}>
                Pago 100% seguro
              </span>
            </div>
          </div>
        </div>

        {/* Métodos de pago */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'auto'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--gray-600)'
          }}>
            Método de pago
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setSelectedMethod('yape')}
              disabled={processing}
              style={{
                padding: '14px',
                border: selectedMethod === 'yape' ? '2px solid var(--airbnb-primary)' : '2px solid var(--gray-200)',
                borderRadius: '8px',
                backgroundColor: selectedMethod === 'yape' ? '#FFF5F7' : 'white',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>💜</div>
              <div style={{
                fontWeight: '600',
                fontSize: '15px',
                color: 'var(--gray-600)',
                marginBottom: '2px'
              }}>
                Yape
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--gray-500)'
              }}>
                Instantáneo
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('card')}
              disabled={processing}
              style={{
                padding: '14px',
                border: selectedMethod === 'card' ? '2px solid var(--airbnb-primary)' : '2px solid var(--gray-200)',
                borderRadius: '8px',
                backgroundColor: selectedMethod === 'card' ? '#FFF5F7' : 'white',
                cursor: processing ? 'not-allowed' : 'pointer',
                opacity: processing ? 0.5 : 1,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>💳</div>
              <div style={{
                fontWeight: '600',
                fontSize: '15px',
                color: 'var(--gray-600)',
                marginBottom: '2px'
              }}>
                Tarjeta
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--gray-500)'
              }}>
                Crédito/Débito
              </div>
            </button>
          </div>

          {selectedMethod === 'yape' && (
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#fff',
                margin: '0 auto 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <QrCodeIcon size={64} style={{ color: 'var(--gray-600)' }} />
              </div>
              <p style={{
                color: 'var(--gray-600)',
                fontSize: '13px',
                marginBottom: '2px',
                fontWeight: '600'
              }}>
                Monto: S/ {reservation.total_amount.toFixed(2)}
              </p>
              <p style={{
                color: 'var(--gray-500)',
                fontSize: '12px',
                marginBottom: 0
              }}>
                Escanea con tu app de Yape
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <form onSubmit={handleCardPayment}>
              <div style={{
                padding: '16px',
                backgroundColor: 'var(--gray-50)',
                borderRadius: '8px'
              }}>
                <legend style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--gray-600)',
                  marginBottom: '8px'
                }}>
                  Card Details
                </legend>
                <div style={{
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'relative' }}>
                    <Input
                      {...getCardNumberProps()}
                      id={`number-${inputId}`}
                      autoComplete="off"
                      style={{
                        borderRadius: '6px 6px 0 0',
                        paddingRight: '40px',
                        borderBottom: 'none'
                      }}
                      disabled={processing}
                      onChange={(e) => {
                        getCardNumberProps().onChange(e);
                        if (e.target.value.length > 0) {
                          setCardStarted(true);
                        }
                      }}
                    />
                    <div style={{
                      pointerEvents: 'none',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingRight: '12px',
                      color: 'var(--gray-400)'
                    }}>
                      {meta.cardType ? (
                        <svg
                          {...getCardImageProps({
                            images: images as unknown as CardImages,
                          })}
                          width={24}
                          style={{
                            overflow: 'hidden',
                            borderRadius: '2px'
                          }}
                        />
                      ) : (
                        <CreditCardIcon aria-hidden="true" size={16} />
                      )}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    marginTop: '-1px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        {...getExpiryDateProps()}
                        id={`expiry-${inputId}`}
                        autoComplete="off"
                        style={{
                          borderRadius: '0 0 0 6px',
                          borderRight: 'none'
                        }}
                        disabled={processing}
                      />
                    </div>
                    <div style={{ flex: 1, marginLeft: '-1px' }}>
                      <Input
                        {...getCVCProps()}
                        id={`cvc-${inputId}`}
                        autoComplete="off"
                        style={{
                          borderRadius: '0 0 6px 0'
                        }}
                        disabled={processing}
                      />
                    </div>
                  </div>
                </div>

                {!cardStarted && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '6px',
                    border: '1px solid #FECACA'
                  }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#991B1B',
                      margin: 0
                    }}>
                      La opción de autocompletado de los métodos de pago está inhabilitada porque este formulario no utiliza una conexión segura.
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}

          {processing && (
            <div style={{
              marginTop: '12px',
              padding: '14px',
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-block',
                width: '28px',
                height: '28px',
                border: '3px solid #BFDBFE',
                borderTopColor: 'var(--airbnb-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '6px'
              }} />
              <p style={{
                color: 'var(--gray-600)',
                fontWeight: '600',
                fontSize: '13px',
                margin: 0
              }}>
                Procesando pago seguro...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Botón flotante */}
      <div style={{
        flexShrink: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
        borderTop: '2px solid var(--airbnb-primary)',
        padding: '14px 32px',
        boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1200px',
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
              fontSize: '22px',
              fontWeight: '700',
              color: 'white'
            }}>
              S/ {reservation.total_amount.toFixed(2)}
            </span>
            <span style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)'
            }}>
              total
            </span>
          </div>
          <button
            onClick={selectedMethod === 'yape' ? handleYapePayment : handleCardPayment}
            disabled={!canProceed}
            style={{
              padding: '14px 40px',
              background: canProceed ? 'linear-gradient(135deg, #FF385C 0%, #E61E4D 100%)' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: canProceed ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: canProceed ? '0 4px 20px rgba(255, 56, 92, 0.4)' : 'none',
              minWidth: '200px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: canProceed ? 1 : 0.6
            }}
            onMouseEnter={(e) => {
              if (canProceed) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 56, 92, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (canProceed) {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 56, 92, 0.4)';
              }
            }}
          >
            {processing ? '⏳ Procesando...' : selectedMethod ? '✨ Confirmar pago' : '⚠️ Elige método'}
          </button>
        </div>
      </div>
    </div>
  );
};
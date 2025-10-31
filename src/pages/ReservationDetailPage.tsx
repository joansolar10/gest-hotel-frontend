import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDateSafe, calculateNights } from '../utils/dateUtils';

interface Reservation {
  id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_details: any;
  total_amount: number;
  status: string;
  created_at: string;
  rooms: {
    code: string;
    type: string;
    description: string;
    price_per_night: number;
    images: string[];
  };
}

export const ReservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

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
      setReservation(data);
    } catch (error: any) {
      toast.error('Error al cargar la reserva');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#d1fae5', color: '#065f46', text: 'Confirmada' };
      case 'pending_payment':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente de pago' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelada' };
      case 'completed':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Completada' };
      default:
        return { bg: '#f3f4f6', color: '#374151', text: status };
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

  const statusStyle = getStatusColor(reservation.status);
  const nights = calculateNights(reservation.check_in, reservation.check_out);

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
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
              Reserva #{reservation.id.substring(0, 8).toUpperCase()}
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>
              Creada el {new Date(reservation.created_at).toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ 
        maxWidth: '900px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        {/* Estado */}
        <div style={{
          backgroundColor: statusStyle.bg,
          color: statusStyle.color,
          padding: '1rem',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '1.125rem',
          marginBottom: '2rem'
        }}>
          {statusStyle.text}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 350px', 
          gap: '2rem' 
        }}>
          {/* Información principal */}
          <div>
            {/* Habitación */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Información de la habitación
              </h2>

              <img
                src={reservation.rooms.images[0] || 'https://via.placeholder.com/600x300'}
                alt={`Habitación ${reservation.rooms.code}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}
              />

              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Habitación {reservation.rooms.code}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                {reservation.rooms.type === 'single' ? 'Individual' : 
                 reservation.rooms.type === 'double' ? 'Doble' : 'Suite'}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {reservation.rooms.description}
              </p>
            </div>

            {/* Fechas */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Detalles de la estadía
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>CHECK-IN</p>
                  <p style={{ fontWeight: '600' }}>
                    {formatDateSafe(reservation.check_in)}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>A partir de las 14:00</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>CHECK-OUT</p>
                  <p style={{ fontWeight: '600' }}>
                    {formatDateSafe(reservation.check_out)}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Hasta las 12:00</p>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f9fafb', 
                borderRadius: '4px' 
              }}>
                <p style={{ fontWeight: '600' }}>
                  {nights} {nights === 1 ? 'noche' : 'noches'} • {reservation.guests} {reservation.guests === 1 ? 'huésped' : 'huéspedes'}
                </p>
              </div>
            </div>

            {/* Datos del huésped */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Datos del huésped
              </h2>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Nombre</p>
                  <p style={{ fontWeight: '500' }}>{reservation.guest_details.name}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Teléfono</p>
                  <p style={{ fontWeight: '500' }}>{reservation.guest_details.phone}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>DNI</p>
                  <p style={{ fontWeight: '500' }}>{reservation.guest_details.dni}</p>
                </div>
                {reservation.guest_details.special_requests && (
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Solicitudes especiales</p>
                    <p style={{ fontWeight: '500' }}>{reservation.guest_details.special_requests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumen de pago */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Resumen de pago
              </h3>

              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>S/ {reservation.rooms.price_per_night} × {nights} noches</span>
                <span>S/ {reservation.total_amount}</span>
              </div>

              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: '#2563eb' }}>S/ {reservation.total_amount}</span>
              </div>

              {reservation.status === 'pending_payment' && (
                <>
                  <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                  <button
                    onClick={() => navigate(`/payments/${reservation.id}`)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Proceder al pago
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
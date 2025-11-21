import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyReservations } from '../hooks/useMyReservations';

type FilterTab = 'all' | 'upcoming' | 'past' | 'cancelled';

export const MyReservationsPage: React.FC = () => {
  const { reservations, loading, refresh, cancelReservation, downloadPDF } = useMyReservations();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const navigate = useNavigate();

  const handleCancelReservation = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    setCancellingId(id);
    const success = await cancelReservation(id);
    setCancellingId(null);
    if (success) refresh();
  };

  const handleDownloadPDF = async (id: string) => {
    await downloadPDF(id);
  };

  const getStatusInfo = (status: string) => {
    const statuses: Record<string, any> = {
      confirmed: { bg: '#dcfce7', color: '#166534', label: 'Confirmada', icon: '✓' },
      pending_payment: { bg: '#fef3c7', color: '#78350f', label: 'Pendiente de pago', icon: '⏳' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Cancelada', icon: '✕' },
      completed: { bg: '#e0e7ff', color: '#3730a3', label: 'Completada', icon: '★' }
    };
    return statuses[status] || { bg: '#f3f4f6', color: '#374151', label: status, icon: '•' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    return Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoomImage = (room: any) => {
    if (room?.images && Array.isArray(room.images) && room.images.length > 0) return room.images[0];
    const placeholders: Record<string, string> = {
      'single': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'double': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'suite': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    };
    return placeholders[room?.type?.toLowerCase()] || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800';
  };

  const filteredReservations = useMemo(() => {
    const now = new Date();
    return reservations.filter(r => {
      if (activeTab === 'all') return true;
      if (activeTab === 'cancelled') return r.status === 'cancelled';
      if (activeTab === 'past') return new Date(r.check_out) < now || r.status === 'completed';
      if (activeTab === 'upcoming') return new Date(r.check_in) >= now && r.status !== 'cancelled';
      return true;
    });
  }, [reservations, activeTab]);

  const tabs = [
    { key: 'all', label: 'Todas', count: reservations.length },
    { key: 'upcoming', label: 'Próximas', count: reservations.filter(r => new Date(r.check_in) >= new Date() && r.status !== 'cancelled').length },
    { key: 'past', label: 'Pasadas', count: reservations.filter(r => new Date(r.check_out) < new Date() || r.status === 'completed').length },
    { key: 'cancelled', label: 'Canceladas', count: reservations.filter(r => r.status === 'cancelled').length }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>Mis Reservas</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.95rem' }}>
              {filteredReservations.length} {filteredReservations.length === 1 ? 'reserva' : 'reservas'}
            </p>
          </div>
          <button
            onClick={() => navigate('/rooms')}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            <span>🏨</span>
            Nueva reserva
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', display: 'flex', gap: '2rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as FilterTab)}
              style={{
                padding: '1rem 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '3px solid #2563eb' : '3px solid transparent',
                color: activeTab === tab.key ? '#2563eb' : '#6b7280',
                fontWeight: activeTab === tab.key ? '600' : '500',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  backgroundColor: activeTab === tab.key ? '#eff6ff' : '#f3f4f6',
                  color: activeTab === tab.key ? '#2563eb' : '#6b7280',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 2rem 3rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '4px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.95rem' }}>Cargando reservas...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && filteredReservations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredReservations.map((reservation) => {
              const statusInfo = getStatusInfo(reservation.status);
              const nights = calculateNights(reservation.check_in, reservation.check_out);
              const isPaid = reservation.payments?.some(p => p.status === 'completed');
              const roomImage = getRoomImage(reservation.rooms);

              return (
                <div
                  key={reservation.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    border: '1px solid #e5e7eb',
                    display: 'flex',
                    height: '220px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Imagen */}
                  <div style={{ width: '280px', flexShrink: 0, position: 'relative' }}>
                    <img
                      src={roomImage}
                      alt={reservation.rooms?.type}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      color: 'white',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {reservation.rooms?.type}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                          Habitación {reservation.rooms?.code}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span>{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', fontSize: '0.875rem' }}>
                        <div>
                          <div style={{ color: '#6b7280', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span>📅</span>Check-in
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{formatDate(reservation.check_in)}</div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span>📅</span>Check-out
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{formatDate(reservation.check_out)}</div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span>🌙</span>Noches
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{nights}</div>
                        </div>
                        <div>
                          <div style={{ color: '#6b7280', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span>👥</span>Huéspedes
                          </div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{reservation.guests}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Código: {reservation.id.substring(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                          S/ {reservation.total_amount.toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {isPaid && (
                          <button
                            onClick={() => handleDownloadPDF(reservation.id)}
                            style={{
                              padding: '0.625rem 1rem',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                          >
                            <span>📄</span>PDF
                          </button>
                        )}
                        
                        {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            disabled={cancellingId === reservation.id}
                            style={{
                              padding: '0.625rem 1rem',
                              backgroundColor: cancellingId === reservation.id ? '#9ca3af' : 'white',
                              color: cancellingId === reservation.id ? 'white' : '#dc2626',
                              border: '2px solid #dc2626',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              cursor: cancellingId === reservation.id ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              if (cancellingId !== reservation.id) {
                                e.currentTarget.style.backgroundColor = '#dc2626';
                                e.currentTarget.style.color = 'white';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (cancellingId !== reservation.id) {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.color = '#dc2626';
                              }
                            }}
                          >
                            {cancellingId === reservation.id ? 'Cancelando...' : 'Cancelar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredReservations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#111827' }}>
              No hay reservas
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>
              {activeTab === 'all' ? 'Aún no has realizado ninguna reserva.' : `No tienes reservas ${tabs.find(t => t.key === activeTab)?.label.toLowerCase()}.`}
            </p>
            <button
              onClick={() => navigate('/rooms')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <span>🏨</span>
              Explorar habitaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
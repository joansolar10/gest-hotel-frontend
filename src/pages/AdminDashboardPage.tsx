import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRightIcon } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Stats {
  totalReservations: number;
  pendingPayments: number;
  confirmedToday: number;
  totalRooms: number;
  availableRooms: number;
}

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Acceso denegado');
      navigate('/');
      return;
    }
    loadStats();
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/api/v1/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
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

  return (
    <div style={{
      height: 'calc(100vh - 64px)',
      backgroundColor: 'var(--gray-50)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--gray-50)',
        padding: '20px 40px 0',
        flexShrink: 0
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          backgroundColor: '#334155',
          borderRadius: '12px 12px 0 0',
          color: 'white',
          padding: '20px 32px',
        }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-0.5px'
          }}>
            Panel de Administración
          </h1>
          <p style={{
            marginTop: '2px',
            opacity: 0.9,
            fontSize: '14px',
            margin: 0
          }}>
            Bienvenido, {user?.name}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '0 40px 20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Card principal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 12px 12px',
          padding: '20px 28px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--gray-100)',
          borderTop: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid var(--gray-100)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>📊</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#2563eb',
                marginBottom: '2px'
              }}>
                {stats?.totalReservations}
              </div>
              <div style={{
                color: 'var(--gray-500)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Reservas
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid var(--gray-100)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>⏳</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#f59e0b',
                marginBottom: '2px'
              }}>
                {stats?.pendingPayments}
              </div>
              <div style={{
                color: 'var(--gray-500)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Pagos Pendientes
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid var(--gray-100)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>📅</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '2px'
              }}>
                {stats?.confirmedToday}
              </div>
              <div style={{
                color: 'var(--gray-500)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Check-ins Hoy
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--gray-50)',
              borderRadius: '8px',
              padding: '14px',
              border: '1px solid var(--gray-100)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🏨</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#8b5cf6',
                marginBottom: '2px'
              }}>
                {stats?.availableRooms}/{stats?.totalRooms}
              </div>
              <div style={{
                color: 'var(--gray-500)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Habitaciones Disponibles
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              marginBottom: '12px',
              color: 'var(--gray-600)'
            }}>
              Acciones Rápidas
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {/* Ver Reservas */}
              <button
                onClick={() => navigate('/admin/reservations')}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    Ver Todas las Reservas
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.3'
                  }}>
                    Consultar y filtrar reservas
                  </div>
                </div>
                <ChevronRightIcon
                  size={14}
                  style={{
                    color: '#94a3b8',
                    flexShrink: 0
                  }}
                />
              </button>

              {/* Gestionar Habitaciones */}
              <button
                onClick={() => navigate('/admin/rooms')}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    Gestionar Habitaciones
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.3'
                  }}>
                    Agregar, editar o cambiar estados
                  </div>
                </div>
                <ChevronRightIcon
                  size={14}
                  style={{
                    color: '#94a3b8',
                    flexShrink: 0
                  }}
                />
              </button>

              {/* Volver al Sitio */}
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1e293b';
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '2px'
                  }}>
                    Volver al Sitio
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.3'
                  }}>
                    Ver sitio como cliente
                  </div>
                </div>
                <ChevronRightIcon
                  size={14}
                  style={{
                    color: '#94a3b8',
                    flexShrink: 0
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
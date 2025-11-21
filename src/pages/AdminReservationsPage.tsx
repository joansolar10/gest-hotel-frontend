import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Reservation {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: string;
  created_at: string;
  rooms: { code: string; type: string };
  users: { name: string; email: string; dni: string };
}

export const AdminReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Acceso denegado');
      navigate('/');
      return;
    }
    loadReservations();
  }, [isAdmin, filterStatus, filterDate]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      let url = '/api/v1/admin/reservations';
      const params = new URLSearchParams();
      
      if (filterStatus) params.append('status', filterStatus);
      if (filterDate) params.append('date', filterDate);
      
      if (params.toString()) url += `?${params.toString()}`;

      const { data } = await api.get(url);
      setReservations(data.reservations);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      pending_payment: { bg: '#fef3c7', color: '#92400e', text: 'Pendiente de pago' },
      confirmed: { bg: '#d1fae5', color: '#065f46', text: 'Confirmada' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: 'Cancelada' },
      completed: { bg: '#e0e7ff', color: '#3730a3', text: 'Completada' }
    };
    const style = styles[status] || { bg: '#f3f4f6', color: '#374151', text: status };
    
    return (
      <span style={{ backgroundColor: style.bg, color: style.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
        {style.text}
      </span>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
            ←
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Gestión de Reservas</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Filtros */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Estado</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', minWidth: '180px' }}
            >
              <option value="">Todos</option>
              <option value="pending_payment">Pendiente de pago</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Completada</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Fecha Check-in</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => { setFilterStatus(''); setFilterDate(''); }}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando...</div>
          ) : reservations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>No hay reservas</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Código</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Cliente</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Habitación</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Check-in</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Check-out</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', borderBottom: '1px solid #e5e7eb' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                        {reservation.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{reservation.users?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{reservation.users?.email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>DNI: {reservation.users?.dni}</div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {reservation.rooms?.code} - {reservation.rooms?.type}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {new Date(reservation.check_in).toLocaleDateString('es-PE')}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {new Date(reservation.check_out).toLocaleDateString('es-PE')}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600' }}>
                        S/ {reservation.total_amount.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {getStatusBadge(reservation.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
          Total: {reservations.length} reservas
        </div>
      </div>
    </div>
  );
};
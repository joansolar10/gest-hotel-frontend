import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { RangeCalendar } from '../components/ui/calendar-rac';
import { ChevronDownIcon, CalendarIcon } from 'lucide-react';
import { getLocalTimeZone, today } from '@internationalized/date';
import type { DateRange } from 'react-aria-components';
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
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  const now = today(getLocalTimeZone());
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending_payment', label: 'Pendiente de pago' },
    { value: 'confirmed', label: 'Confirmada' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'completed', label: 'Completada' }
  ];

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Acceso denegado');
      navigate('/');
      return;
    }
    loadReservations();
  }, [isAdmin, filterStatus, dateRange]);

  // Click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      let url = '/api/v1/admin/reservations';
      const params = new URLSearchParams();
      
      if (filterStatus) params.append('status', filterStatus);
      if (dateRange?.start) params.append('date', dateRange.start.toString());
      
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
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '600'
      }}>
        {style.text}
      </span>
    );
  };

  const getTotalAmount = () => {
    return reservations.reduce((sum, res) => sum + res.total_amount, 0);
  };

  const getSelectedStatusLabel = () => {
    const selected = statusOptions.find(opt => opt.value === filterStatus);
    return selected ? selected.label : 'Todos';
  };

  const getDateRangeLabel = () => {
    if (!dateRange?.start) return 'Seleccionar fechas';
    if (!dateRange?.end) return dateRange.start.toString();
    return `${dateRange.start.toString()} - ${dateRange.end.toString()}`;
  };

  const handleClearFilters = () => {
    setFilterStatus('');
    setDateRange(null);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--gray-50)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid var(--gray-200)',
              backgroundColor: 'white',
              color: 'var(--gray-600)',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            ←
          </button>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 4px 0',
              color: 'var(--gray-600)',
              letterSpacing: '-0.5px'
            }}>
              Gestión de Reservas
            </h1>
            <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '15px' }}>
              Administra todas las reservas del hotel
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid var(--gray-200)',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'var(--gray-600)'
            }}>
              Estado
            </label>
            
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    fontSize: '15px'
                  }}
                >
                  <span>{getSelectedStatusLabel()}</span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    size={16}
                    style={{ opacity: 0.6 }}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setFilterStatus(option.value)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }} ref={calendarRef}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'var(--gray-600)'
            }}>
              Fecha Check-in
            </label>
            
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '10px 12px',
                fontSize: '15px'
              }}
            >
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: dateRange?.start ? 'var(--gray-600)' : 'var(--gray-400)'
              }}>
                <CalendarIcon size={16} />
                {getDateRangeLabel()}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                size={16}
                style={{ opacity: 0.6 }}
              />
            </Button>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <>
                <div
                  onClick={() => setShowCalendar(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  zIndex: 1000,
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--gray-200)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
                }}>
                  <RangeCalendar
                    value={dateRange}
                    onChange={setDateRange}
                    minValue={now}
                  />
                </div>
              </>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleClearFilters}
          >
            Limpiar filtros
          </Button>
        </div>

        {/* Tabla */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid var(--gray-200)'
        }}>
          {loading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: 'var(--gray-400)'
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid var(--gray-100)',
                borderTopColor: 'var(--gray-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '16px', fontSize: '15px' }}>Cargando reservas...</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : reservations.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: 'var(--gray-400)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0' }}>
                No hay reservas
              </p>
              <p style={{ fontSize: '14px', margin: 0 }}>
                Las reservas aparecerán aquí cuando se realicen
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Habitación</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead style={{ textAlign: 'right' }}>Total</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>

                {/* Spacer */}
                <tbody>
                  <tr style={{ height: '8px' }} />
                </tbody>

                <TableBody>
                  {reservations.map((reservation, index) => {
                    const hasBackground = index % 2 === 0;
                    
                    return (
                      <TableRow
                        key={reservation.id}
                        style={{
                          backgroundColor: hasBackground ? '#e5e7eb' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <TableCell
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: '600',
                            fontSize: '13px',
                            color: '#6b7280',
                            borderTopLeftRadius: '8px',
                            borderBottomLeftRadius: '8px'
                          }}
                        >
                          {reservation.id.substring(0, 8).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '2px' }}>
                            {reservation.users?.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {reservation.users?.email}
                          </div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                            DNI: {reservation.users?.dni}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>
                            {reservation.rooms?.code}
                          </div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>
                            {reservation.rooms?.type}
                          </div>
                        </TableCell>
                        <TableCell style={{ fontSize: '14px' }}>
                          {new Date(reservation.check_in).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell style={{ fontSize: '14px' }}>
                          {new Date(reservation.check_out).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell style={{ textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                          S/ {reservation.total_amount.toFixed(2)}
                        </TableCell>
                        <TableCell style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                          {getStatusBadge(reservation.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                {/* Spacer */}
                <tbody>
                  <tr style={{ height: '8px' }} />
                </tbody>

                <TableFooter>
                  <TableRow style={{ borderTop: '1px solid var(--gray-100)' }}>
                    <TableCell colSpan={5} style={{ fontWeight: '600', fontSize: '15px' }}>
                      Total
                    </TableCell>
                    <TableCell style={{ textAlign: 'right', fontWeight: '700', fontSize: '15px' }}>
                      S/ {getTotalAmount().toFixed(2)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>

              <p style={{
                marginTop: '16px',
                textAlign: 'center',
                color: 'var(--gray-400)',
                fontSize: '14px'
              }}>
                Total: {reservations.length} {reservations.length === 1 ? 'reserva' : 'reservas'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  code: string;
  type: string;
  description: string;
  capacity: number;
  price_per_night: number;
  status: string;
  amenities: string[];
}

export const AdminRoomsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'single',
    description: '',
    capacity: 1,
    price_per_night: 0,
    amenities: [] as string[]
  });

  const statusOptions = [
    { value: 'available', label: 'Disponible' },
    { value: 'occupied', label: 'Ocupada' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'cleaning', label: 'Limpieza' }
  ];

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Acceso denegado');
      navigate('/');
      return;
    }
    loadRooms();
  }, [isAdmin]);

  const loadRooms = async () => {
    try {
      const { data } = await api.get('/api/v1/admin/rooms');
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error('Error al cargar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/api/v1/admin/rooms/${editingRoom.id}`, formData);
        toast.success('Habitación actualizada');
      } else {
        await api.post('/api/v1/admin/rooms', formData);
        toast.success('Habitación creada');
      }
      setShowModal(false);
      resetForm();
      loadRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al guardar');
    }
  };

  const handleStatusChange = async (roomId: string, newStatus: string) => {
    try {
      await api.patch(`/api/v1/admin/rooms/${roomId}/status`, { status: newStatus });
      toast.success('Estado actualizado');
      loadRooms();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta habitación?')) return;
    try {
      await api.delete(`/api/v1/admin/rooms/${roomId}`);
      toast.success('Habitación eliminada');
      loadRooms();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      code: room.code,
      type: room.type,
      description: room.description,
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      amenities: room.amenities || []
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingRoom(null);
    setFormData({ code: '', type: 'single', description: '', capacity: 1, price_per_night: 0, amenities: [] });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; text: string }> = {
      available: { bg: '#d1fae5', color: '#065f46', text: 'Disponible' },
      occupied: { bg: '#fee2e2', color: '#991b1b', text: 'Ocupada' },
      maintenance: { bg: '#fef3c7', color: '#92400e', text: 'Mantenimiento' },
      cleaning: { bg: '#e0e7ff', color: '#3730a3', text: 'Limpieza' }
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

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--gray-50)', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                Gestión de Habitaciones
              </h1>
              <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '15px' }}>
                Administra las habitaciones del hotel
              </p>
            </div>
          </div>
          <Button
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              fontWeight: '600',
              padding: '12px 24px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            + Nueva Habitación
          </Button>
        </div>

        {/* Grid de habitaciones */}
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: 'var(--gray-400)',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid var(--gray-200)'
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
            <p style={{ marginTop: '16px', fontSize: '15px' }}>Cargando habitaciones...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '24px'
          }}>
            {rooms.map((room) => (
              <div
                key={room.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid var(--gray-200)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '700',
                      margin: 0,
                      color: 'var(--gray-600)'
                    }}>
                      {room.code}
                    </h3>
                    <p style={{
                      color: 'var(--gray-400)',
                      fontSize: '14px',
                      margin: '4px 0 0',
                      textTransform: 'capitalize'
                    }}>
                      {room.type}
                    </p>
                  </div>
                  {getStatusBadge(room.status)}
                </div>

                <p style={{
                  fontSize: '14px',
                  color: 'var(--gray-600)',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}>
                  {room.description}
                </p>

                <div style={{
                  fontSize: '14px',
                  marginBottom: '20px',
                  padding: '12px',
                  backgroundColor: 'var(--gray-50)',
                  borderRadius: '8px'
                }}>
                  <div style={{ marginBottom: '6px' }}>
                    <strong style={{ color: 'var(--gray-600)' }}>Capacidad:</strong>
                    <span style={{ color: 'var(--gray-500)', marginLeft: '8px' }}>
                      {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--gray-600)' }}>Precio:</strong>
                    <span style={{ color: 'var(--gray-500)', marginLeft: '8px' }}>
                      S/ {room.price_per_night.toFixed(2)}/noche
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                    color: 'var(--gray-600)'
                  }}>
                    Cambiar estado:
                  </label>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="outline"
                        style={{
                          width: '100%',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          fontSize: '14px'
                        }}
                      >
                        <span>{getStatusLabel(room.status)}</span>
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
                          onClick={() => handleStatusChange(room.id, option.value)}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    onClick={() => openEditModal(room)}
                    style={{
                      flex: 1,
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(room.id)}
                    variant="destructive"
                    style={{ flex: 1 }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '90%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
            }}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              color: 'var(--gray-600)'
            }}>
              {editingRoom ? 'Editar Habitación' : 'Nueva Habitación'}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Código */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)'
                }}>
                  Código <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  placeholder="Ej: 101"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '15px',
                    color: 'var(--gray-600)',
                    backgroundColor: 'white',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
              </div>

              {/* Tipo con Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)'
                }}>
                  Tipo
                </label>
                
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="outline"
                      type="button"
                      style={{
                        width: '100%',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        fontSize: '15px'
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>
                        {formData.type === 'single' ? 'Individual' : formData.type === 'double' ? 'Doble' : 'Suite'}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        size={16}
                        style={{ opacity: 0.6 }}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFormData({ ...formData, type: 'single' })}>
                      Individual
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFormData({ ...formData, type: 'double' })}>
                      Doble
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFormData({ ...formData, type: 'suite' })}>
                      Suite
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Descripción con Textarea */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'var(--gray-600)'
                }}>
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  maxLength={500}
                  placeholder="Describe la habitación..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    resize: 'vertical',
                    fontSize: '15px',
                    color: 'var(--gray-600)',
                    backgroundColor: 'white',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                />
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray-400)',
                  marginTop: '6px'
                }}>
                  Escribe una breve descripción. Máximo 500 caracteres.
                </p>
              </div>

              {/* Capacidad y Precio */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'var(--gray-600)'
                  }}>
                    Capacidad <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    required
                    placeholder="1"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '15px',
                      color: 'var(--gray-600)',
                      backgroundColor: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: 'var(--gray-600)'
                  }}>
                    Precio/noche (S/) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })}
                    required
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '15px',
                      color: 'var(--gray-600)',
                      backgroundColor: 'white',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                  {editingRoom ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
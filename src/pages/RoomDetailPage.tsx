import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService, Room } from '../services/room.service';
import toast from 'react-hot-toast';

export const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'services' | 'reviews'>('description');

  useEffect(() => {
    loadRoom();
  }, [id]);

  const loadRoom = async () => {
    if (!id) {
      toast.error('ID de habitación inválido');
      navigate('/rooms');
      return;
    }

    try {
      setLoading(true);
      const data = await roomService.getRoomById(id);
      setRoom(data);
    } catch (error: any) {
      console.error('Error cargando habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <div style={{ width: '60px', height: '60px', border: '5px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!room) return null;

  const isAvailable = room.status === 'available';
  const images = room.images && room.images.length > 0 ? room.images : ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'];

  const services = [];
  if (room.services) {
    if (room.services.wifi) services.push({ icon: '📶', label: 'WiFi gratuito', desc: 'Conexión de alta velocidad' });
    if (room.services.ac) services.push({ icon: '❄️', label: 'Aire acondicionado', desc: 'Control de temperatura' });
    if (room.services.tv) services.push({ icon: '📺', label: 'Televisión', desc: 'TV por cable' });
    if (room.services.minibar) services.push({ icon: '🍷', label: 'Minibar', desc: 'Bebidas y snacks' });
    if (room.services.jacuzzi) services.push({ icon: '🛁', label: 'Jacuzzi', desc: 'Tina de hidromasaje' });
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      single: 'Habitación Individual',
      double: 'Habitación Doble',
      suite: 'Suite Ejecutiva'
    };
    return types[type] || type;
  };

  // Reviews simulados
  const reviews = [
    {
      name: 'María González',
      avatar: 'MG',
      rating: 9.5,
      date: '15 Nov 2024',
      comment: 'Excelente habitación, muy limpia y cómoda. El personal fue muy amable y atento. La vista es espectacular.',
      likes: 12,
      categories: { cleanliness: 9.5, location: 9.0, staff: 10, comfort: 9.5 }
    },
    {
      name: 'Carlos Ramírez',
      avatar: 'CR',
      rating: 8.7,
      date: '10 Nov 2024',
      comment: 'Muy buena relación calidad-precio. Las instalaciones están impecables y la ubicación es perfecta.',
      likes: 8,
      categories: { cleanliness: 9.0, location: 9.5, staff: 8.5, comfort: 8.5 }
    }
  ];

  const overallRating = 9.2;
  const totalReviews = 89;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header con breadcrumb */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            <span onClick={() => navigate('/rooms')} style={{ cursor: 'pointer', color: '#2563eb' }}>Habitaciones</span>
            <span>›</span>
            <span>{getTypeLabel(room.type)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                Habitación {room.code}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    {overallRating}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '600' }}>Excelente</span>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>· {totalReviews} opiniones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
          <img
            src={images[selectedImage]}
            alt={room.type}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
            onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
          />
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.5rem' }}>
            {images.slice(1, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${room.type} ${idx + 2}`}
                onClick={() => setSelectedImage(idx + 1)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                onError={(e) => e.currentTarget.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem 3rem', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3rem' }}>
        {/* Columna izquierda */}
        <div>
          {/* Info básica */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.375rem 0.75rem', borderRadius: '6px' }}>
                {getTypeLabel(room.type)}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.125rem' }}>👥</span>
                <span style={{ fontSize: '0.95rem', color: '#374151' }}>
                  Hasta {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
              {[
                { key: 'description', label: 'Descripción' },
                { key: 'services', label: 'Servicios' },
                { key: 'reviews', label: 'Opiniones' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? '3px solid #2563eb' : '3px solid transparent',
                    color: activeTab === tab.key ? '#2563eb' : '#6b7280',
                    fontWeight: activeTab === tab.key ? '600' : '500',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '2rem' }}>
              {activeTab === 'description' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
                    Acerca de esta habitación
                  </h3>
                  <p style={{ fontSize: '1rem', lineHeight: '1.8', color: '#374151', margin: 0 }}>
                    {room.description || 'Habitación cómoda y bien equipada para tu estadía. Cuenta con todas las comodidades necesarias para que disfrutes de una experiencia única en nuestro hotel.'}
                  </p>
                </div>
              )}

              {activeTab === 'services' && (
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                    Lo que ofrece esta habitación
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {services.map((service, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '1.75rem' }}>{service.icon}</span>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                            {service.label}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {service.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '1rem', borderRadius: '8px', fontSize: '2rem', fontWeight: 'bold' }}>
                        {overallRating}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>Excelente</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Basado en {totalReviews} opiniones</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {[
                        { label: 'Limpieza', value: 9.5 },
                        { label: 'Ubicación', value: 9.0 },
                        { label: 'Personal', value: 9.8 },
                        { label: 'Comodidad', value: 9.2 }
                      ].map((cat) => (
                        <div key={cat.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: '#374151' }}>{cat.label}</span>
                            <span style={{ fontWeight: '600', color: '#111827' }}>{cat.value}</span>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(cat.value / 10) * 100}%`, height: '100%', backgroundColor: '#2563eb' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {reviews.map((review, idx) => (
                      <div key={idx} style={{ paddingBottom: '1.5rem', borderBottom: idx < reviews.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}>
                            {review.avatar}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div>
                                <div style={{ fontWeight: '600', color: '#111827' }}>{review.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{review.date}</div>
                              </div>
                              <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                                {review.rating}
                              </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#374151' }}>
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha - Card de reserva */}
        <div>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.25rem' }}>
              S/ {room.price_per_night}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>por noche</div>

            <button
              onClick={() => navigate(`/rooms/${room.id}/reserve`)}
              disabled={!isAvailable}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: isAvailable ? '#2563eb' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isAvailable ? 'pointer' : 'not-allowed',
                marginBottom: '1rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => { if (isAvailable) e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
              onMouseLeave={(e) => { if (isAvailable) e.currentTarget.style.backgroundColor = '#2563eb'; }}
            >
              {isAvailable ? 'Reservar ahora' : 'No disponible'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              No se te cobrará en este momento
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.125rem' }}>✓</span>
                <span style={{ color: '#374151' }}>Cancelación gratuita</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.125rem' }}>✓</span>
                <span style={{ color: '#374151' }}>Sin cargos ocultos</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.125rem' }}>✓</span>
                <span style={{ color: '#374151' }}>Confirmación inmediata</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

interface ServicesSelectorProps {
  onServicesChange: (services: any[]) => void;
  nights: number;
}

export const ServicesSelector: React.FC<ServicesSelectorProps> = ({ 
  onServicesChange, 
  nights 
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await api.get('/api/v1/services');
      setServices(data.services);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleService = (serviceId: string, price: number) => {
    const newSelected = { ...selectedServices };
    
    if (newSelected[serviceId]) {
      delete newSelected[serviceId];
    } else {
      newSelected[serviceId] = 1;
    }
    
    setSelectedServices(newSelected);
    
    const servicesArray = Object.entries(newSelected).map(([id, qty]) => {
      const service = services.find(s => s.id === id);
      return {
        service_id: id,
        quantity: qty,
        subtotal: service!.price * qty * nights
      };
    });
    
    onServicesChange(servicesArray);
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    
    const newSelected = { ...selectedServices, [serviceId]: quantity };
    setSelectedServices(newSelected);
    
    const servicesArray = Object.entries(newSelected).map(([id, qty]) => {
      const service = services.find(s => s.id === id);
      return {
        service_id: id,
        quantity: qty,
        subtotal: service!.price * qty * nights
      };
    });
    
    onServicesChange(servicesArray);
  };

  const getServiceTotal = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    const quantity = selectedServices[serviceId] || 0;
    return service ? service.price * quantity * nights : 0;
  };

  if (loading) return <div>Cargando servicios...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Servicios Adicionales (Opcional)
      </h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {services.map(service => (
          <div
            key={service.id}
            style={{
              border: selectedServices[service.id] ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: selectedServices[service.id] ? '#eff6ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <input
                type="checkbox"
                checked={!!selectedServices[service.id]}
                onChange={() => handleToggleService(service.id, service.price)}
                style={{ marginTop: '0.25rem', cursor: 'pointer' }}
              />
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>{service.icon}</span>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>{service.name}</span>
                  <span style={{ color: '#2563eb', fontWeight: '600', marginLeft: 'auto' }}>
                    S/ {service.price.toFixed(2)}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {service.description}
                </p>
                
                {selectedServices[service.id] && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={selectedServices[service.id]}
                      onChange={(e) => handleQuantityChange(service.id, parseInt(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '80px',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px'
                      }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                      Subtotal: S/ {getServiceTotal(service.id).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
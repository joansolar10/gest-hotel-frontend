import React, { useState, useEffect, useId } from 'react';
import { UtensilsCrossed, Coffee, Clock, Shirt, Sparkles, Car } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface Service {
  id: string;
  name: string;
  description: string;
  price_per_unit: number;
  icon: string;
  unit_type: 'per_stay' | 'per_night' | 'per_person';
}

interface ServiceWithQuantity extends Service {
  quantity: number;
  subtotal: number;
}

interface Props {
  onServicesChange: (services: ServiceWithQuantity[]) => void;
  nights: number;
}

const availableServices: Service[] = [
  {
    id: '1',
    name: 'Cena Romántica',
    description: 'Cena especial para dos personas',
    price_per_unit: 120,
    icon: '🍽️',
    unit_type: 'per_stay'
  },
  {
    id: '2',
    name: 'Desayuno Buffet',
    description: 'Buffet completo con opciones nacionales e internacionales',
    price_per_unit: 25,
    icon: '🍳',
    unit_type: 'per_night'
  },
  {
    id: '3',
    name: 'Late Check-out',
    description: 'Salida tardía hasta las 16:00',
    price_per_unit: 35,
    icon: '🕐',
    unit_type: 'per_stay'
  },
  {
    id: '4',
    name: 'Lavandería Express',
    description: 'Servicio de lavandería en 24 horas',
    price_per_unit: 30,
    icon: '👔',
    unit_type: 'per_stay'
  },
  {
    id: '5',
    name: 'Spa y Masajes',
    description: 'Sesión de masajes relajantes (1 hora)',
    price_per_unit: 80,
    icon: '🏆',
    unit_type: 'per_person'
  },
  {
    id: '6',
    name: 'Transporte Aeropuerto',
    description: 'Traslado ida o vuelta al aeropuerto',
    price_per_unit: 45,
    icon: '🚗',
    unit_type: 'per_stay'
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case '🍽️': return UtensilsCrossed;
    case '🍳': return Coffee;
    case '🕐': return Clock;
    case '👔': return Shirt;
    case '🏆': return Sparkles;
    case '🚗': return Car;
    default: return Sparkles;
  }
};

export const ServicesSelector: React.FC<Props> = ({ onServicesChange, nights }) => {
  const id = useId();
  const [selectedServices, setSelectedServices] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const services: ServiceWithQuantity[] = [];
    
    selectedServices.forEach((quantity, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service && quantity > 0) {
        let subtotal = 0;
        if (service.unit_type === 'per_night') {
          subtotal = service.price_per_unit * nights * quantity;
        } else {
          subtotal = service.price_per_unit * quantity;
        }

        services.push({
          ...service,
          quantity,
          subtotal
        });
      }
    });

    onServicesChange(services);
  }, [selectedServices, nights, onServicesChange]);

  const handleToggleService = (serviceId: string, checked: boolean) => {
    setSelectedServices(prev => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(serviceId, 1);
      } else {
        newMap.delete(serviceId);
      }
      return newMap;
    });
  };

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setSelectedServices(prev => {
      const newMap = new Map(prev);
      newMap.set(serviceId, newQuantity);
      return newMap;
    });
  };

  const calculateServicePrice = (service: Service, quantity: number) => {
    if (service.unit_type === 'per_night') {
      return service.price_per_unit * nights * quantity;
    }
    return service.price_per_unit * quantity;
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '32px',
      border: '1px solid var(--gray-200)'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--gray-600)'
      }}>
        Servicios Adicionales (Opcional)
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'var(--gray-500)',
        marginBottom: '24px'
      }}>
        Selecciona los servicios que desees agregar a tu estadía
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {availableServices.map((service) => {
          const IconComponent = getIconComponent(service.icon);
          const isSelected = selectedServices.has(service.id);
          const quantity = selectedServices.get(service.id) || 1;
          const totalPrice = calculateServicePrice(service, quantity);

          return (
            <div
              key={service.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
                border: `2px solid ${isSelected ? '#FF385C' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isSelected ? 'rgba(255, 56, 92, 0.02)' : 'white',
                boxShadow: isSelected ? '0 2px 8px rgba(255, 56, 92, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--gray-300)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--gray-200)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                }
              }}
            >
              {/* Header con checkbox e icono */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '8px'
              }}>
                <Checkbox
                  id={`${id}-${service.id}`}
                  checked={isSelected}
                  onChange={(e) => handleToggleService(service.id, e.target.checked)}
                  style={{
                    order: 1,
                    zIndex: 10
                  }}
                />
                <IconComponent
                  aria-hidden="true"
                  size={20}
                  style={{
                    color: isSelected ? '#FF385C' : 'var(--gray-400)',
                    opacity: 0.8
                  }}
                />
              </div>

              {/* Nombre del servicio */}
              <div>
                <Label
                  htmlFor={`${id}-${service.id}`}
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isSelected ? '#FF385C' : 'var(--gray-600)',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  {service.name}
                </Label>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray-500)',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {service.description}
                </p>
              </div>

              {/* Precio y cantidad */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '12px',
                borderTop: '1px solid var(--gray-100)'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: isSelected ? '#FF385C' : 'var(--gray-600)'
                }}>
                  S/ {isSelected ? totalPrice.toFixed(2) : service.price_per_unit.toFixed(2)}
                </div>

                {isSelected && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '4px'
                  }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(service.id, quantity - 1);
                      }}
                      disabled={quantity <= 1}
                      style={{
                        width: '24px',
                        height: '24px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: quantity <= 1 ? 'var(--gray-200)' : '#FF385C',
                        color: 'white',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: quantity <= 1 ? 0.5 : 1
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--gray-600)',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(service.id, quantity + 1);
                      }}
                      style={{
                        width: '24px',
                        height: '24px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#FF385C',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
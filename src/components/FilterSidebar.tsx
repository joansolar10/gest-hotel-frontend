import React, { useState } from 'react';
import { RangeCalendar } from './ui/calendar-rac';
import { getLocalTimeZone, today } from '@internationalized/date';
import type { DateRange } from 'react-aria-components';
import { ChevronDownIcon, Wifi, AirVent, Tv, Wine, Bath } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const now = today(getLocalTimeZone());
  
  const [dateRange, setDateRange] = useState<DateRange | null>({
    start: now,
    end: now.add({ days: 1 })
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [guests, setGuests] = useState(1);

  const handleApplyFilters = () => {
    const filters: any = {};

    if (dateRange?.start && dateRange?.end) {
      filters.check_in = dateRange.start.toString();
      filters.check_out = dateRange.end.toString();
    }
    if (guests) filters.guests = guests;
    if (selectedType) filters.type = selectedType;
    if (priceRange.max < 1000) filters.max_price = priceRange.max;

    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setDateRange({
      start: now,
      end: now.add({ days: 1 })
    });
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating('');
    setSelectedType('');
    setSelectedServices([]);
    setGuests(1);
    onFilterChange({});
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const guestOptions = [
    { value: 1, label: '1 Huésped' },
    { value: 2, label: '2 Huéspedes' },
    { value: 3, label: '3 Huéspedes' },
    { value: 4, label: '4 Huéspedes' },
  ];

  const roomTypes = [
    { value: '', label: 'Todas' },
    { value: 'single', label: 'Individual' },
    { value: 'double', label: 'Doble' },
    { value: 'suite', label: 'Suite' }
  ];

  const services = [
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'ac', label: 'Aire acondicionado', icon: AirVent },
    { value: 'tv', label: 'Televisión', icon: Tv },
    { value: 'minibar', label: 'Minibar', icon: Wine },
    { value: 'jacuzzi', label: 'Jacuzzi', icon: Bath }
  ];

  const typeId = React.useId();

  return (
    <div style={{
      width: '320px',
      flexShrink: 0,
      position: 'sticky',
      top: '100px',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--gray-100)',
        padding: '32px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '32px',
          color: 'var(--gray-600)',
          letterSpacing: '-0.3px'
        }}>
          Filtros
        </h3>

        {/* Fechas con calendario de rango */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--gray-600)'
          }}>
            Fechas
          </label>

          <div style={{
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--gray-200)'
          }}>
            <RangeCalendar
              value={dateRange}
              onChange={setDateRange}
              minValue={now}
            />
          </div>
        </div>

        <div style={{
          height: '1px',
          backgroundColor: 'var(--gray-100)',
          margin: '24px 0'
        }} />

        {/* Huéspedes con Dropdown */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: 'var(--gray-600)'
          }}>
            Huéspedes
          </label>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  fontSize: '15px'
                }}
              >
                <span>{guestOptions.find(opt => opt.value === guests)?.label || '1 Huésped'}</span>
                <ChevronDownIcon
                  aria-hidden="true"
                  size={16}
                  style={{ opacity: 0.6 }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {guestOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setGuests(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div style={{
          height: '1px',
          backgroundColor: 'var(--gray-100)',
          margin: '24px 0'
        }} />

        {/* Tipo de habitación con RadioGroup */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--gray-600)'
          }}>
            Tipo de habitación
          </h4>
          
          <RadioGroup
            value={selectedType}
            onValueChange={setSelectedType}
          >
            {roomTypes.map((type, index) => (
              <div
                key={type.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <RadioGroupItem
                  value={type.value}
                  id={`${typeId}-${index}`}
                />
                <Label
                  htmlFor={`${typeId}-${index}`}
                  style={{
                    fontSize: '15px',
                    color: 'var(--gray-600)',
                    fontWeight: selectedType === type.value ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div style={{
          height: '1px',
          backgroundColor: 'var(--gray-100)',
          margin: '24px 0'
        }} />

        {/* Precio */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--gray-600)'
            }}>
              Rango de precio
            </h4>
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--gray-600)'
            }}>
              S/ {priceRange.max}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '13px',
            color: 'var(--gray-400)'
          }}>
            <span>S/ 0</span>
            <span>S/ 1000+</span>
          </div>
        </div>

        <div style={{
          height: '1px',
          backgroundColor: 'var(--gray-100)',
          margin: '24px 0'
        }} />

        {/* Servicios */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--gray-600)'
          }}>
            Servicios
          </h4>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {services.map((service) => {
              const serviceId = `service-${service.value}`;
              const isChecked = selectedServices.includes(service.value);
              const IconComponent = service.icon;

              return (
                <label
                  key={service.value}
                  htmlFor={serviceId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ flexShrink: 0 }}>
                    <Checkbox
                      id={serviceId}
                      checked={isChecked}
                      onChange={() => toggleService(service.value)}
                      style={{
                        width: '16px',
                        height: '16px'
                      }}
                    />
                  </div>
                  <IconComponent
                    size={18}
                    style={{
                      flexShrink: 0,
                      color: isChecked ? '#111827' : '#6B7280'
                    }}
                  />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--gray-600)',
                    fontWeight: isChecked ? '600' : '400'
                  }}>
                    {service.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Botones */}
        <div style={{
          display: 'grid',
          gap: '12px',
          marginTop: '32px'
        }}>
          <Button
            onClick={handleApplyFilters}
            style={{
              width: '100%'
            }}
          >
            Aplicar filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilters}
            style={{
              width: '100%'
            }}
          >
            Limpiar todo
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleApplyFilters = () => {
    const filters: any = {};
    
    if (checkIn) filters.check_in = checkIn;
    if (checkOut) filters.check_out = checkOut;
    if (guests) filters.guests = guests;
    if (selectedType) filters.type = selectedType;
    if (priceRange.max < 1000) filters.max_price = priceRange.max;
    
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setSelectedRating('');
    setSelectedType('');
    setSelectedServices([]);
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    onFilterChange({});
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  return (
    <div style={{
      width: '280px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: '100px',
      maxHeight: 'calc(100vh - 120px)',
      overflowY: 'auto'
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
        Buscar
      </h3>

      {/* Fechas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Check-in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          style={{
            width: '100%',
            padding: '0.625rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Huéspedes
        </label>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.625rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}
        >
          <option value={1}>1 Adulto</option>
          <option value={2}>2 Adultos</option>
          <option value={3}>3 Adultos</option>
          <option value={4}>4 Adultos</option>
        </select>
      </div>

      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Tipo de habitación */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
          Tipo de habitación
        </h4>
        {[
          { value: '', label: 'Todas' },
          { value: 'single', label: 'Individual' },
          { value: 'double', label: 'Doble' },
          { value: 'suite', label: 'Suite' }
        ].map((type) => (
          <label key={type.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              checked={selectedType === type.value}
              onChange={() => setSelectedType(type.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{type.label}</span>
          </label>
        ))}
      </div>

      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Precio */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827' }}>Precio</h4>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>S/ 0 - {priceRange.max}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={priceRange.max}
          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

      {/* Servicios */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#111827' }}>
          Servicios
        </h4>
        {[
          { value: 'wifi', label: 'WiFi', icon: '📶' },
          { value: 'ac', label: 'Aire acondicionado', icon: '❄️' },
          { value: 'tv', label: 'TV', icon: '📺' },
          { value: 'minibar', label: 'Minibar', icon: '🍷' },
          { value: 'jacuzzi', label: 'Jacuzzi', icon: '🛁' }
        ].map((service) => (
          <label key={service.value} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedServices.includes(service.value)}
              onChange={() => toggleService(service.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{ marginRight: '0.5rem' }}>{service.icon}</span>
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{service.label}</span>
          </label>
        ))}
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleApplyFilters}
          style={{
            flex: 1,
            padding: '0.75rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Buscar
        </button>
        <button
          onClick={handleClearFilters}
          style={{
            padding: '0.75rem',
            backgroundColor: 'white',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Discount {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface DiscountSelectorProps {
  nights: number;
  subtotal: number;
  onDiscountApplied: (discountAmount: number, discountId: string | null) => void;
}

export const DiscountSelector: React.FC<DiscountSelectorProps> = ({
  nights,
  subtotal,
  onDiscountApplied
}) => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (nights > 0) {
      loadDiscounts();
    }
  }, [nights]);

  const loadDiscounts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/v1/discounts/applicable?nights=${nights}`);
      setDiscounts(data.discounts || []);
    } catch (error) {
      console.error('Error cargando descuentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDiscount = async (discountId: string | null) => {
    if (!discountId) {
      setSelectedDiscount(null);
      onDiscountApplied(0, null);
      return;
    }

    try {
      const { data } = await api.post('/api/v1/discounts/calculate', {
        discount_id: discountId,
        subtotal
      });

      setSelectedDiscount(discountId);
      onDiscountApplied(data.discount_amount, discountId);
    } catch (error) {
      console.error('Error calculando descuento:', error);
    }
  };

  if (loading || discounts.length === 0) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        💰 Descuentos Disponibles
      </h3>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {discounts.map(discount => (
          <div
            key={discount.id}
            onClick={() => handleSelectDiscount(selectedDiscount === discount.id ? null : discount.id)}
            style={{
              border: selectedDiscount === discount.id ? '2px solid #059669' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: selectedDiscount === discount.id ? '#d1fae5' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="radio"
                checked={selectedDiscount === discount.id}
                onChange={() => {}}
                style={{ cursor: 'pointer' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                  {discount.code}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {discount.description}
                </div>
              </div>
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                color: '#059669' 
              }}>
                {discount.type === 'percentage' 
                  ? `-${discount.value}%` 
                  : `-S/ ${discount.value}`
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
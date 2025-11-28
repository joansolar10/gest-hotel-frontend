import React, { useState, useEffect, useId } from 'react';
import { Tag, Percent, DollarSign, Gift } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
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

const getDiscountIcon = (type: string) => {
  switch (type) {
    case 'percentage':
      return Percent;
    case 'fixed':
      return DollarSign;
    default:
      return Tag;
  }
};

export const DiscountSelector: React.FC<DiscountSelectorProps> = ({
  nights,
  subtotal,
  onDiscountApplied
}) => {
  const id = useId();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

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

  const handleSelectDiscount = async (discountId: string, checked: boolean) => {
    if (!checked) {
      setSelectedDiscount(null);
      setCalculatedAmount(0);
      onDiscountApplied(0, null);
      return;
    }

    try {
      const { data } = await api.post('/api/v1/discounts/calculate', {
        discount_id: discountId,
        subtotal
      });

      setSelectedDiscount(discountId);
      setCalculatedAmount(data.discount_amount);
      onDiscountApplied(data.discount_amount, discountId);
    } catch (error) {
      console.error('Error calculando descuento:', error);
      setSelectedDiscount(null);
      setCalculatedAmount(0);
      onDiscountApplied(0, null);
    }
  };

  if (loading || discounts.length === 0) return null;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '32px',
      border: '1px solid var(--gray-200)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px'
      }}>
        <Gift
          size={24}
          style={{
            color: '#10B981'
          }}
        />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: 'var(--gray-600)'
        }}>
          Descuentos Disponibles
        </h3>
      </div>
      <p style={{
        fontSize: '14px',
        color: 'var(--gray-500)',
        marginBottom: '24px',
        marginTop: '8px'
      }}>
        Selecciona un descuento para aplicar a tu reserva
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: discounts.length === 1 ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {discounts.map((discount) => {
          const IconComponent = getDiscountIcon(discount.type);
          const isSelected = selectedDiscount === discount.id;

          return (
            <div
              key={discount.id}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
                border: `2px solid ${isSelected ? '#10B981' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.02)' : 'white',
                boxShadow: isSelected ? '0 2px 8px rgba(16, 185, 129, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)'
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
                  id={`${id}-${discount.id}`}
                  checked={isSelected}
                  onChange={(e) => handleSelectDiscount(discount.id, e.target.checked)}
                  style={{
                    order: 1,
                    zIndex: 10,
                    accentColor: '#10B981'
                  }}
                />
                <IconComponent
                  aria-hidden="true"
                  size={20}
                  style={{
                    color: isSelected ? '#10B981' : 'var(--gray-400)',
                    opacity: 0.8
                  }}
                />
              </div>

              {/* Código del descuento */}
              <div>
                <Label
                  htmlFor={`${id}-${discount.id}`}
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isSelected ? '#10B981' : 'var(--gray-600)',
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  {discount.code}
                </Label>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--gray-500)',
                  lineHeight: '1.4',
                  margin: 0
                }}>
                  {discount.description}
                </p>
              </div>

              {/* Badge de descuento */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '12px',
                borderTop: '1px solid var(--gray-100)'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'var(--gray-50)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: isSelected ? '#10B981' : 'var(--gray-600)'
                }}>
                  {discount.type === 'percentage' ? (
                    <>
                      <Percent size={14} />
                      <span>{discount.value}% OFF</span>
                    </>
                  ) : (
                    <>
                      <span>-S/</span>
                      <span>{discount.value.toFixed(2)}</span>
                    </>
                  )}
                </div>

                {/* Mostrar ahorro calculado si está seleccionado */}
                {isSelected && calculatedAmount > 0 && (
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#10B981'
                  }}>
                    Ahorras S/ {calculatedAmount.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota informativa */}
      {selectedDiscount && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '20px'
          }}>
            ✨
          </div>
          <div style={{
            fontSize: '14px',
            color: '#059669',
            fontWeight: '500'
          }}>
            ¡Genial! Has aplicado un descuento a tu reserva
          </div>
        </div>
      )}
    </div>
  );
};
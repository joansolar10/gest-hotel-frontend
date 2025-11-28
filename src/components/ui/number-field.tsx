import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import {
  Button,
  Group,
  Input,
  NumberField as AriaNumberField,
  NumberFieldProps
} from 'react-aria-components';

interface CustomNumberFieldProps extends NumberFieldProps {
  label?: string;
}

export const NumberField: React.FC<CustomNumberFieldProps> = ({ label, ...props }) => {
  return (
    <AriaNumberField {...props}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--gray-600)',
          marginBottom: '6px'
        }}>
          {label}
        </label>
      )}
      <Group style={{
        position: 'relative',
        display: 'inline-flex',
        width: '100%',
        height: '44px',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        fontSize: '15px',
        transition: 'all 0.2s'
      }}>
        <Button
          slot="decrement"
          style={{
            display: 'flex',
            aspectRatio: '1',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px 0 0 6px',
            border: 'none',
            borderRight: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = 'var(--gray-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <MinusIcon aria-hidden="true" size={16} />
        </Button>
        <Input style={{
          width: '100%',
          flexGrow: 1,
          backgroundColor: 'white',
          padding: '12px 16px',
          textAlign: 'center',
          color: 'var(--gray-600)',
          fontVariantNumeric: 'tabular-nums',
          border: 'none',
          outline: 'none',
          fontSize: '15px',
          fontWeight: '500'
        }} />
        <Button
          slot="increment"
          style={{
            display: 'flex',
            aspectRatio: '1',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0 6px 6px 0',
            border: 'none',
            borderLeft: '1px solid #d1d5db',
            backgroundColor: 'white',
            color: '#6b7280',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = 'var(--gray-600)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <PlusIcon aria-hidden="true" size={16} />
        </Button>
      </Group>
      <style>{`
        button[slot="decrement"]:disabled,
        button[slot="increment"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
    </AriaNumberField>
  );
};
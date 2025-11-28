import React, { createContext, useContext } from 'react';

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  className = '',
  style
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const name = React.useId();

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onChange: handleChange, name }}>
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          ...style
        }}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  disabled = false,
  className = '',
  style
}) => {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup');
  }

  const { value: selectedValue, onChange, name } = context;
  const isChecked = selectedValue === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={() => !disabled && onChange(value)}
      className={className}
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: `2px solid ${isChecked ? '#475569' : '#d1d5db'}`,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isChecked) {
          e.currentTarget.style.borderColor = '#9ca3af';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isChecked) {
          e.currentTarget.style.borderColor = '#d1d5db';
        }
      }}
    >
      {isChecked && (
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#475569'
          }}
        />
      )}
      <input
        type="radio"
        name={name}
        value={value}
        checked={isChecked}
        onChange={() => {}}
        id={id}
        style={{ display: 'none' }}
      />
    </button>
  );
};
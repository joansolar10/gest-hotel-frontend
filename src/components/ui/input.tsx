import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', style, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '15px',
          color: 'var(--gray-600)',
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'inherit',
          ...style
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#9ca3af';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
import React from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={className}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          accentColor: '#FF385C',
          ...props.style
        }}
        {...props}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', style, children, disabled, ...props }, ref) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      fontFamily: 'inherit',
      gap: '8px'
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 16px', fontSize: '13px' },
      md: { padding: '10px 20px', fontSize: '14px' },
      lg: { padding: '12px 24px', fontSize: '15px' }
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: disabled ? '#9ca3af' : '#475569',
        color: 'white'
      },
      outline: {
        backgroundColor: 'transparent',
        border: '1px solid #d1d5db',
        color: '#475569'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#475569'
      },
      destructive: {
        backgroundColor: disabled ? '#fca5a5' : '#EF4444',
        color: 'white'
      }
    };

    return (
      <button
        ref={ref}
        className={className}
        disabled={disabled}
        style={{
          ...baseStyles,
          ...sizeStyles[size],
          ...variantStyles[variant],
          opacity: disabled ? 0.6 : 1,
          ...style
        }}
        onMouseEnter={(e) => {
          if (!disabled && variant === 'default') {
            e.currentTarget.style.backgroundColor = '#334155';
          }
          if (!disabled && variant === 'outline') {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
          if (!disabled && variant === 'destructive') {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && variant === 'default') {
            e.currentTarget.style.backgroundColor = '#475569';
          }
          if (!disabled && variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
          if (!disabled && variant === 'destructive') {
            e.currentTarget.style.backgroundColor = '#EF4444';
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
import React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', style, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={className}
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--gray-600)',
          marginBottom: '6px',
          ...style
        }}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';
import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', style, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '15px',
          color: 'var(--gray-600)',
          backgroundColor: 'white',
          outline: 'none',
          transition: 'border-color 0.2s',
          resize: 'vertical',
          fontFamily: 'inherit',
          ...style
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#9ca3af';
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          props.onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
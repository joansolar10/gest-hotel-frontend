import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className = '', style, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={className}
        style={{
          width: '100%',
          ...style
        }}
        {...props}
      />
    );
  }
);
Form.displayName = 'Form';
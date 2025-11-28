import React from 'react';

interface FieldContextValue {
  id: string;
  error?: string;
  disabled?: boolean;
}

const FieldContext = React.createContext<FieldContextValue | undefined>(undefined);

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  disabled?: boolean;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className = '', style, error, disabled, children, ...props }, ref) => {
    const id = React.useId();

    return (
      <FieldContext.Provider value={{ id, error, disabled }}>
        <div
          ref={ref}
          className={className}
          style={{
            marginBottom: '24px',
            ...style
          }}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  }
);
Field.displayName = 'Field';

export const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', style, children, ...props }, ref) => {
    const context = React.useContext(FieldContext);

    return (
      <label
        ref={ref}
        htmlFor={context?.id}
        className={className}
        style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '6px',
          color: 'var(--gray-600)',
          cursor: 'pointer',
          ...style
        }}
        {...props}
      >
        {children}
      </label>
    );
  }
);
FieldLabel.displayName = 'FieldLabel';

export const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', style, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={className}
        style={{
          fontSize: '13px',
          color: 'var(--gray-400)',
          marginTop: '6px',
          lineHeight: '1.5',
          ...style
        }}
        {...props}
      />
    );
  }
);
FieldDescription.displayName = 'FieldDescription';

export const FieldError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', style, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={className}
        style={{
          fontSize: '13px',
          color: '#EF4444',
          marginTop: '6px',
          lineHeight: '1.5',
          ...style
        }}
        {...props}
      >
        {children}
      </p>
    );
  }
);
FieldError.displayName = 'FieldError';
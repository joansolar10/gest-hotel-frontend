import React from 'react';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = '', style, ...props }, ref) => (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        ref={ref}
        className={className}
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          ...style
        }}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', style, ...props }, ref) => (
    <thead
      ref={ref}
      className={className}
      style={{
        backgroundColor: 'transparent',
        ...style
      }}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={className} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', style, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={className}
      style={{
        backgroundColor: 'transparent',
        ...style
      }}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr ref={ref} className={className} {...props} />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', style, ...props }, ref) => (
    <th
      ref={ref}
      className={className}
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#6b7280',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        ...style
      }}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', style, ...props }, ref) => (
    <td
      ref={ref}
      className={className}
      style={{
        padding: '12px 16px',
        fontSize: '14px',
        color: '#374151',
        ...style
      }}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
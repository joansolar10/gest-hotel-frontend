import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuContextValue {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined);

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div style={{ position: 'relative' }}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  const { isOpen, setIsOpen } = context;

  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
};

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ children, className = '' }) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const { isOpen, setIsOpen } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }}
      />
      <div
        ref={contentRef}
        className={className}
        style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          maxHeight: '240px',
          overflowY: 'auto'
        }}
      >
        {children}
      </div>
    </>
  );
};

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ children, onClick }) => {
  const context = React.useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuItem must be used within DropdownMenu');

  const { setIsOpen } = context;

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        padding: '10px 16px',
        cursor: 'pointer',
        fontSize: '15px',
        color: '#374151',
        transition: 'background-color 0.2s',
        fontWeight: '500'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {children}
    </div>
  );
};
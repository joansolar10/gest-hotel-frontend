import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { icon: '🏠', label: 'Inicio', path: '/' },
    { icon: '🏨', label: 'Habitaciones', path: '/rooms' },
    ...(user ? [
      { icon: '📋', label: 'Mis Reservas', path: '/my-reservations' },
      { icon: '👤', label: 'Mi Perfil', path: '/profile' }
    ] : []),
    { icon: '📞', label: 'Contacto', path: '/contact' },
    { icon: 'ℹ️', label: 'Acerca de', path: '/about' },
    ...(isAdmin ? [
      { icon: '⚙️', label: 'Admin', path: '/admin', isAdmin: true }
    ] : [])
  ];

  const isActive = (path: string) => {
    if (path === '/' || path === '/rooms') {
      return location.pathname === path || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: '70px',
        height: 'calc(100vh - 70px)',
        width: isExpanded ? '220px' : '54px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        transition: 'width 0.3s ease',
        zIndex: 999,
        overflowX: 'hidden',
        overflowY: 'auto'
      }}
    >
      <div style={{ padding: '1rem 0' }}>
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              backgroundColor: isActive(item.path) ? '#eff6ff' : 'transparent',
              border: 'none',
              borderLeft: isActive(item.path) ? '4px solid #2563eb' : '4px solid transparent',
              color: isActive(item.path) ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              fontWeight: isActive(item.path) ? '600' : '500',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ 
              fontSize: '1.5rem',
              minWidth: '28px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              {item.icon}
            </span>
            {isExpanded && (
              <span style={{ 
                opacity: isExpanded ? 1 : 0,
                transition: 'opacity 0.2s ease 0.1s',
                color: item.isAdmin ? '#dc2626' : 'inherit',
                fontWeight: item.isAdmin ? '700' : 'inherit'
              }}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer colapsable */}
      {isExpanded && user && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          opacity: isExpanded ? 1 : 0,
          transition: 'opacity 0.2s ease 0.1s'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            Sesión activa
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.name || user.email}
          </div>
        </div>
      )}
    </div>
  );
};
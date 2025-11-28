import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Info, LogOut, User, Home as HomeIcon, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isDniVerified = user?.is_verified_dni;

  // Enlaces para usuarios autenticados
  const userNavigationLinks = [
    { href: '/rooms', label: 'Habitaciones' },
    { href: '/my-reservations', label: 'Mis Reservas' },
    { href: '/profile', label: 'Perfil' },
  ];

  // Enlaces públicos (siempre visibles)
  const publicNavigationLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contacto' },
  ];

  // Combinar enlaces según si hay usuario o no
  const navigationLinks = user 
    ? [...userNavigationLinks, ...publicNavigationLinks]
    : publicNavigationLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user?.name) return user?.email.charAt(0).toUpperCase() || 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--gray-200)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '16px'
      }}>
        {/* Left side - Navigation Links */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {navigationLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => navigate(link.href)}
              style={{
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: '500',
                color: isActive(link.href) ? '#111827' : '#6B7280',
                backgroundColor: isActive(link.href) ? '#E5E7EB' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#111827';
                e.currentTarget.style.backgroundColor = '#E5E7EB';
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  e.currentTarget.style.color = '#6B7280';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Admin link - solo visible para admins */}
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: '500',
                color: isActive('/admin') ? 'white' : '#9333EA',
                backgroundColor: isActive('/admin') ? '#9333EA' : '#E9D5FF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (!isActive('/admin')) {
                  e.currentTarget.style.backgroundColor = '#D8B4FE';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/admin')) {
                  e.currentTarget.style.backgroundColor = '#E9D5FF';
                }
              }}
            >
              <Shield size={16} />
              Admin
            </button>
          )}
        </div>

        {/* Center - Logo */}
        <div
          onClick={() => navigate(user ? '/rooms' : '/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <img
            src="/logo-andes.png"
            alt="Hotel Los Andes"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain'
            }}
          />
          <span style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap'
          }}>
            Hotel Los Andes
          </span>
        </div>

        {/* Right side - Actions & User */}
        <div style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px'
        }}>
          {user ? (
            <>
              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Info button */}
                <button
                  onClick={() => navigate('/about')}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#6B7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6B7280';
                  }}
                >
                  <Info size={18} />
                </button>

                {/* Notifications */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: showNotifications ? '#E5E7EB' : 'transparent',
                      color: showNotifications ? '#111827' : '#6B7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                      e.currentTarget.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      if (!showNotifications) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6B7280';
                      }
                    }}
                  >
                    <Bell size={18} />
                    <span style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FF385C',
                      border: '2px solid white'
                    }} />
                  </button>

                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '320px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                      border: '1px solid #E5E7EB',
                      padding: '16px',
                      zIndex: 1000
                    }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#111827'
                      }}>
                        Notificaciones
                      </h3>
                      <div style={{
                        textAlign: 'center',
                        padding: '32px 16px',
                        color: '#9CA3AF',
                        fontSize: '14px'
                      }}>
                        No tienes notificaciones nuevas
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* User verification badge */}
              {isDniVerified && (
                <div style={{
                  padding: '4px 12px',
                  backgroundColor: '#D1FAE5',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>✓</span>
                  Verificado
                </div>
              )}

              {/* User name */}
              {user?.name && (
                <span style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#111827',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user.name.split(' ')[0]}
                </span>
              )}

              {/* User menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #E5E7EB',
                    backgroundColor: '#FF385C',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  {getUserInitials()}
                </button>

                {/* User dropdown */}
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                    border: '1px solid #E5E7EB',
                    padding: '8px',
                    zIndex: 1000
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: '12px',
                      borderBottom: '1px solid #F3F4F6',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user?.name || 'Usuario'}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#9CA3AF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user?.email}
                      </div>
                      {/* Badge de rol */}
                      {isAdmin && (
                        <div style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          backgroundColor: '#F3E8FF',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#9333EA',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Shield size={12} />
                          {user.role === 'admin' ? 'Administrador' : 'Recepcionista'}
                        </div>
                      )}
                    </div>

                    {/* Menu items */}
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>

                    <button
                      onClick={() => {
                        navigate('/my-reservations');
                        setShowUserMenu(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#374151',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <HomeIcon size={16} />
                      Mis Reservas
                    </button>

                    {/* Admin menu item */}
                    {isAdmin && (
                      <button
                        onClick={() => {
                          navigate('/admin');
                          setShowUserMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#9333EA',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3E8FF'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Shield size={16} />
                        Panel Admin
                      </button>
                    )}

                    <div style={{
                      height: '1px',
                      backgroundColor: '#F3F4F6',
                      margin: '8px 0'
                    }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#EF4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#FF385C',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E61E4D';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FF385C';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
        />
      )}
    </nav>
  );
};
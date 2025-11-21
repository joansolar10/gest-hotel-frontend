import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * ProfilePage - HU 3.2
 * 
 * Página donde el usuario puede ver y editar su información personal.
 * 
 * Flujo de la página:
 * 1. Al cargar, obtiene los datos actuales del usuario desde el backend
 * 2. Muestra un formulario pre-llenado con esos datos
 * 3. El usuario puede editar y guardar los cambios
 * 4. Valida los datos antes de enviarlos al backend
 * 5. Muestra mensajes de éxito o error
 */
export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Estados para el formulario
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Valores originales para detectar cambios
  const [originalData, setOriginalData] = useState({
    name: '',
    phone: ''
  });

  /**
   * useEffect para cargar los datos del usuario al montar el componente.
   * 
   * Este efecto se ejecuta UNA VEZ cuando la página se carga.
   * Obtiene los datos actuales del usuario y los muestra en el formulario.
   */
  useEffect(() => {
    if (!user) {
      // Si no hay usuario autenticado, redirigir a login
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user]);

  /**
   * useEffect para detectar cambios en el formulario.
   * 
   * Este efecto se ejecuta cada vez que el usuario escribe algo.
   * Compara los valores actuales con los originales para saber
   * si hay cambios pendientes de guardar.
   */
  useEffect(() => {
    const nameChanged = name !== originalData.name;
    const phoneChanged = phone !== originalData.phone;
    
    setHasChanges(nameChanged || phoneChanged);
  }, [name, phone, originalData]);

  /**
   * Carga los datos del perfil desde el backend.
   * 
   * ¿Por qué hacemos esto si ya tenemos "user" del AuthContext?
   * Porque queremos asegurarnos de tener los datos más actualizados
   * directamente desde la base de datos.
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data } = await api.get('/api/v1/users/profile');
      
      const userData = data.user;
      
      // Llenar el formulario con los datos actuales
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setEmail(userData.email || '');
      setDni(userData.dni || '');
      
      // Guardar los valores originales para detectar cambios
      setOriginalData({
        name: userData.name || '',
        phone: userData.phone || ''
      });
      
    } catch (error: any) {
      console.error('Error cargando perfil:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Valida los datos del formulario antes de enviarlos.
   * 
   * Esta validación ocurre en el FRONTEND (antes de enviar al servidor).
   * El backend también valida (validación de seguridad), pero esta
   * validación mejora la experiencia del usuario al dar feedback inmediato.
   */
  const validateForm = (): boolean => {
    // Validar nombre
    if (!name || name.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    // Validar teléfono (si se proporciona)
    if (phone && phone.trim() !== '') {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[0-9]{9,15}$/.test(cleanPhone)) {
        toast.error('El teléfono debe contener entre 9 y 15 dígitos');
        return false;
      }
    }

    return true;
  };

  /**
   * Maneja el envío del formulario.
   * 
   * Este es el flujo completo:
   * 1. Prevenir el comportamiento por defecto del formulario (recargar página)
   * 2. Validar los datos
   * 3. Enviar al backend
   * 4. Actualizar el contexto de autenticación
   * 5. Mostrar mensaje de éxito
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ PASO 1: Validar
    if (!validateForm()) {
      return;
    }

    // ✅ PASO 2: Verificar que haya cambios
    if (!hasChanges) {
      toast('No hay cambios para guardar', { icon: '📝' });
      return;
    }

    try {
      setSaving(true);

      // ✅ PASO 3: Enviar al backend
      const { data } = await api.patch('/api/v1/users/profile', {
        name: name.trim(),
        phone: phone.trim() || null // Si está vacío, enviar null
      });

      // ✅ PASO 4: Actualizar el contexto (para que el navbar muestre el nombre nuevo)
      if (updateUser && data.user) {
        updateUser(data.user);
      }

      // ✅ PASO 5: Actualizar los valores originales
      setOriginalData({
        name: name.trim(),
        phone: phone.trim()
      });

      toast.success('✅ Perfil actualizado exitosamente');
      
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      const errorMessage = error.response?.data?.error || 'Error al actualizar el perfil';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Cancela la edición y restaura los valores originales.
   * 
   * Esto es útil si el usuario empieza a editar pero cambia de opinión.
   */
  const handleCancel = () => {
    setName(originalData.name);
    setPhone(originalData.phone);
    toast('Cambios descartados', { icon: '↩️' });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDERIZADO - Loading State
  // ══════════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDERIZADO - Formulario Principal
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '1.5rem 0' 
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/rooms')}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
              Mi Perfil
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.875rem' }}>
              Gestiona tu información personal
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTENIDO */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '0 1rem' 
      }}>
        <form onSubmit={handleSubmit}>
          {/* ────────────────────────────────────────────────────────────── */}
          {/* TARJETA DEL FORMULARIO */}
          {/* ────────────────────────────────────────────────────────────── */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#1f2937'
            }}>
              Información Personal
            </h2>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* CAMPO: Nombre */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Nombre completo *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: saving ? '#f9fafb' : 'white',
                  cursor: saving ? 'not-allowed' : 'text'
                }}
              />
            </div>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* CAMPO: Teléfono */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Teléfono
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="987654321"
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: saving ? '#f9fafb' : 'white',
                  cursor: saving ? 'not-allowed' : 'text'
                }}
              />
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.25rem' 
              }}>
                Formato: 9-15 dígitos sin espacios
              </p>
            </div>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* CAMPO: Email (Solo lectura) */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'not-allowed',
                  color: '#6b7280'
                }}
              />
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.25rem' 
              }}>
                📧 El email proviene de Google y no se puede modificar
              </p>
            </div>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* CAMPO: DNI (Solo lectura) */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                DNI
              </label>
              <input
                type="text"
                value={dni}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'not-allowed',
                  color: '#6b7280'
                }}
              />
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280', 
                marginTop: '0.25rem' 
              }}>
                ✅ DNI verificado - No se puede modificar
              </p>
            </div>

            {/* ──────────────────────────────────────────────────────────── */}
            {/* BOTONES DE ACCIÓN */}
            {/* ──────────────────────────────────────────────────────────── */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              {/* Botón Cancelar */}
              {hasChanges && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.5 : 1
                  }}
                >
                  Cancelar
                </button>
              )}

              {/* Botón Guardar */}
              <button
                type="submit"
                disabled={saving || !hasChanges}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: (!saving && hasChanges) ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  fontWeight: '500',
                  cursor: (!saving && hasChanges) ? 'pointer' : 'not-allowed',
                  opacity: (!saving && hasChanges) ? 1 : 0.6
                }}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>

            {/* Mensaje de estado */}
            {!hasChanges && !saving && (
              <p style={{ 
                textAlign: 'right',
                fontSize: '0.875rem', 
                color: '#10b981',
                marginTop: '0.75rem',
                fontWeight: '500'
              }}>
                ✓ Perfil actualizado
              </p>
            )}
          </div>
        </form>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* INFORMACIÓN ADICIONAL */}
        {/* ────────────────────────────────────────────────────────────── */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          borderRadius: '8px', 
          padding: '1rem',
          marginTop: '1.5rem',
          border: '1px solid #bfdbfe'
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#1e40af',
            margin: 0,
            lineHeight: '1.5'
          }}>
            <strong>💡 Nota:</strong> Tu información personal está protegida. 
            Solo tú puedes ver y modificar estos datos. El email y DNI no se 
            pueden cambiar por razones de seguridad.
          </p>
        </div>
      </div>
    </div>
  );
};
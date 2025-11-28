import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field, FieldLabel, FieldDescription, FieldError } from '../components/ui/field';
import { Form } from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import api from '../services/api';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({ name: '', phone: '' });

  const [originalData, setOriginalData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/login');
      return;
    }

    loadProfile();
  }, [user]);

  useEffect(() => {
    const nameChanged = name !== originalData.name;
    const phoneChanged = phone !== originalData.phone;
    
    setHasChanges(nameChanged || phoneChanged);
  }, [name, phone, originalData]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const { data } = await api.get('/api/v1/users/profile');
      
      const userData = data.user;
      
      setName(userData.name || '');
      setPhone(userData.phone || '');
      setEmail(userData.email || '');
      setDni(userData.dni || '');
      
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

  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '' };
    let isValid = true;

    if (!name || name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    if (phone && phone.trim() !== '') {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
      if (!/^[0-9]{9,15}$/.test(cleanPhone)) {
        newErrors.phone = 'El teléfono debe contener entre 9 y 15 dígitos';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      toast('No hay cambios para guardar', { icon: '📝' });
      return;
    }

    try {
      setSaving(true);

      const { data } = await api.patch('/api/v1/users/profile', {
        name: name.trim(),
        phone: phone.trim() || null
      });

      if (updateUser && data.user) {
        updateUser(data.user);
      }

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

  const handleCancel = () => {
    setName(originalData.name);
    setPhone(originalData.phone);
    setErrors({ name: '', phone: '' });
    toast('Cambios descartados', { icon: '↩️' });
  };

  if (loading) {
    return (
      <div style={{ 
        height: 'calc(100vh - 64px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'var(--gray-50)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--gray-100)',
          borderTopColor: 'var(--gray-600)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ 
      height: 'calc(100vh - 64px)',
      backgroundColor: 'var(--gray-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div style={{ 
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ 
            fontSize: '26px', 
            fontWeight: '700', 
            margin: '0 0 4px 0',
            color: 'var(--gray-600)',
            letterSpacing: '-0.5px'
          }}>
            Mi Perfil
          </h1>
          <p style={{ 
            margin: 0, 
            color: 'var(--gray-400)', 
            fontSize: '14px' 
          }}>
            Gestiona tu información personal
          </p>
        </div>

        {/* Form Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid var(--gray-200)'
        }}>
          <Form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <Field error={errors.name}>
              <FieldLabel>
                Nombre completo <span style={{ color: '#EF4444' }}>*</span>
              </FieldLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="Joan"
                required
                disabled={saving}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            {/* Phone Field */}
            <Field error={errors.phone}>
              <FieldLabel>Teléfono</FieldLabel>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors(prev => ({ ...prev, phone: '' }));
                }}
                placeholder="987654321"
                disabled={saving}
              />
              {errors.phone ? (
                <FieldError>{errors.phone}</FieldError>
              ) : (
                <FieldDescription>Formato: 9-15 dígitos sin espacios</FieldDescription>
              )}
            </Field>

            {/* Email Field (Read-only) */}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                value={email}
                disabled
                style={{
                  backgroundColor: 'var(--gray-50)',
                  cursor: 'not-allowed',
                  color: 'var(--gray-400)'
                }}
              />
              <FieldDescription>📧 El email proviene de Google y no se puede modificar</FieldDescription>
            </Field>

            {/* DNI Field (Read-only) */}
            <Field>
              <FieldLabel>DNI</FieldLabel>
              <Input
                type="text"
                value={dni}
                disabled
                style={{
                  backgroundColor: 'var(--gray-50)',
                  cursor: 'not-allowed',
                  color: 'var(--gray-400)'
                }}
              />
              <FieldDescription>✅ DNI verificado - No se puede modificar</FieldDescription>
            </Field>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px'
            }}>
              {hasChanges && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              )}

              <Button
                type="submit"
                disabled={saving || !hasChanges}
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>

            {/* Success Message */}
            {!hasChanges && !saving && (
              <p style={{ 
                textAlign: 'right',
                fontSize: '13px', 
                color: '#10b981',
                marginTop: '8px',
                fontWeight: '500'
              }}>
                ✓ Perfil actualizado
              </p>
            )}
          </Form>
        </div>

        {/* Info Card */}
        <div style={{ 
          backgroundColor: '#EFF6FF', 
          borderRadius: '12px', 
          padding: '12px',
          marginTop: '16px',
          border: '1px solid #BFDBFE'
        }}>
          <p style={{ 
            fontSize: '13px', 
            color: '#1E40AF',
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
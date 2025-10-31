import api from './api';

class ReniecServiceClass {
  async verifyDNI(dni: string, birthdate: string) {
    console.log('🔍 [RENIEC SERVICE] Verificando DNI:', dni, 'Fecha:', birthdate);
    try {
      const { data } = await api.post('/api/v1/integrations/reniec/verify', {
        dni,
        birthdate // ← ✅ Enviar fecha de nacimiento
      });
      console.log('✅ [RENIEC SERVICE] DNI verificado:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [RENIEC SERVICE] Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getVerificationStatus() {
    console.log('🔍 [RENIEC SERVICE] Obteniendo estado de verificación');
    try {
      const { data } = await api.get('/api/v1/integrations/reniec/status');
      console.log('✅ [RENIEC SERVICE] Estado obtenido:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [RENIEC SERVICE] Error:', error);
      throw error;
    }
  }
}

export const reniecService = new ReniecServiceClass();
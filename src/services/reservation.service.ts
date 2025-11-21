import api from './api';

export interface Reservation {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  guest_details?: any;
  total_amount: number;
  status: 'pending_payment' | 'confirmed' | 'cancelled' | 'completed';
  locked_until?: string;
  created_at: string;
  updated_at: string;
  rooms?: {
    id: string;
    code: string;
    type: string;
    description: string;
    price_per_night: number;
    images?: string[];
  };
  payments?: Array<{
    id: string;
    method: string;
    amount: number;
    status: string;
    transaction_ref?: string;
  }>;
}

export const reservationService = {
  /**
   * Obtener todas las reservas del usuario autenticado
   */
  async getMyReservations() {
    try {
      console.log('🔍 [RESERVATION SERVICE] Obteniendo mis reservas...');
      
      const { data } = await api.get<Reservation[]>('/api/v1/reservations');
      
      console.log('✅ [RESERVATION SERVICE] Reservas recibidas:', data?.length || 0);
      
      return data;
    } catch (error) {
      console.error('❌ [RESERVATION SERVICE] Error al obtener reservas:', error);
      throw error;
    }
  },

  /**
   * Obtener una reserva específica por ID
   */
  async getReservationById(id: string) {
    try {
      console.log('🔍 [RESERVATION SERVICE] Obteniendo reserva:', id);
      
      const { data } = await api.get<Reservation>(`/api/v1/reservations/${id}`);
      
      console.log('✅ [RESERVATION SERVICE] Reserva recibida:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [RESERVATION SERVICE] Error al obtener reserva:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva reserva
   */
  async createReservation(reservationData: {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    guest_details?: any;
  }) {
    try {
      console.log('🔍 [RESERVATION SERVICE] Creando reserva:', reservationData);
      
      const { data } = await api.post<Reservation>('/api/v1/reservations', reservationData);
      
      console.log('✅ [RESERVATION SERVICE] Reserva creada:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [RESERVATION SERVICE] Error al crear reserva:', error);
      throw error;
    }
  },

  /**
   * Cancelar una reserva
   */
  async cancelReservation(id: string) {
    try {
      console.log('🔍 [RESERVATION SERVICE] Cancelando reserva:', id);
      
      const { data } = await api.patch(`/api/v1/reservations/${id}`, {});
      
      console.log('✅ [RESERVATION SERVICE] Reserva cancelada:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [RESERVATION SERVICE] Error al cancelar reserva:', error);
      throw error;
    }
  },

  /**
   * Descargar PDF de una reserva
   */
  async downloadReservationPDF(id: string) {
    try {
      console.log('🔍 [RESERVATION SERVICE] Descargando PDF de reserva:', id);
      
      const response = await api.get(`/api/v1/reservations/${id}/pdf`, {
        responseType: 'blob'
      });
      
      // Crear un blob y descargarlo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reserva-${id.substring(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ [RESERVATION SERVICE] PDF descargado exitosamente');
      
      return true;
    } catch (error) {
      console.error('❌ [RESERVATION SERVICE] Error al descargar PDF:', error);
      throw error;
    }
  }
};
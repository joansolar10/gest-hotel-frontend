import api from './api';

/**
 * Interface para las habitaciones - ESTRUCTURA REAL DE SUPABASE
 */
export interface Room {
  id: string;
  code: string;
  type: string;
  description: string;
  capacity: number;
  price_per_night: number;
  status: string; // 'available', 'occupied', 'maintenance'
  images: string[]; // Array de URLs
  services?: any; // jsonb con servicios (ac, tv, wifi, minibar, jacuzzi, etc.)
  created_at?: string;
  updated_at?: string;
}

/**
 * Servicio para manejar operaciones con habitaciones
 */
class RoomService {
  /**
   * Obtiene la lista de habitaciones con filtros opcionales
   */
  async getRooms(filters?: {
    type?: string;
    min_price?: number;
    max_price?: number;
    capacity?: number;
  }): Promise<{ data: Room[]; total: number }> {
    try {
      console.log('🔍 [ROOM SERVICE] Obteniendo habitaciones con filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.min_price) params.append('min_price', filters.min_price.toString());
      if (filters?.max_price) params.append('max_price', filters.max_price.toString());
      if (filters?.capacity) params.append('capacity', filters.capacity.toString());
      
      const queryString = params.toString();
      const url = queryString ? `/api/v1/rooms?${queryString}` : '/api/v1/rooms';
      
      console.log('🌐 [ROOM SERVICE] URL:', url);
      
      const { data } = await api.get(url);
      
      console.log('✅ [ROOM SERVICE] Respuesta recibida:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [ROOM SERVICE] Error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtiene una habitación específica por su ID
   */
  async getRoomById(id: string): Promise<Room> {
    try {
      console.log('🔍 [ROOM SERVICE] Obteniendo habitación por ID:', id);
      
      const { data } = await api.get<Room>(`/api/v1/rooms/${id}`);
      
      console.log('✅ [ROOM SERVICE] Habitación obtenida:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [ROOM SERVICE] Error obteniendo habitación:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const roomService = new RoomService();
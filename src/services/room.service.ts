import api from './api';
import { Room, RoomFilters } from '../types';

export const roomService = {
  async getRooms(filters?: RoomFilters) {
    try {
      console.log('🔍 [ROOM SERVICE] Obteniendo habitaciones con filtros:', filters);
      
      const params = new URLSearchParams();
      
      if (filters?.type) params.append('type', filters.type);
      if (filters?.precio_min) params.append('price_min', filters.precio_min.toString());
      if (filters?.precio_max) params.append('price_max', filters.precio_max.toString());
      if (filters?.fecha_inicio) params.append('check_in', filters.fecha_inicio);
      if (filters?.fecha_fin) params.append('check_out', filters.fecha_fin);
      if (filters?.servicios) params.append('services', filters.servicios);

      const queryString = params.toString();
      const url = queryString ? `/api/v1/rooms?${queryString}` : '/api/v1/rooms';
      
      console.log('🌐 [ROOM SERVICE] URL:', url);
      
      const { data } = await api.get<{ data: Room[]; total: number }>(url);
      
      console.log('✅ [ROOM SERVICE] Respuesta recibida:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [ROOM SERVICE] Error:', error);
      throw error;
    }
  },

  async getRoomById(id: string) {
    try {
      console.log('🔍 [ROOM SERVICE] Obteniendo habitación:', id);
      
      const { data } = await api.get<Room>(`/api/v1/rooms/${id}`);
      
      console.log('✅ [ROOM SERVICE] Habitación recibida:', data);
      
      return data;
    } catch (error) {
      console.error('❌ [ROOM SERVICE] Error:', error);
      throw error;
    }
  },

  async checkAvailability(roomId: string, checkIn: string, checkOut: string) {
    try {
      console.log('🔍 [ROOM SERVICE] Verificando disponibilidad:', { roomId, checkIn, checkOut });
      
      const { data } = await api.get<{ available: boolean }>(
        `/api/v1/rooms/check-availability?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`
      );
      
      console.log('✅ [ROOM SERVICE] Disponibilidad:', data.available);
      
      return data.available;
    } catch (error) {
      console.error('❌ [ROOM SERVICE] Error:', error);
      throw error;
    }
  }
};
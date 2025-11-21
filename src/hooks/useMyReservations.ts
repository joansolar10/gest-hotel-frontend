import { useState, useEffect, useCallback } from 'react';
import { reservationService, Reservation } from '../services/reservation.service';
import toast from 'react-hot-toast';

export const useMyReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar las reservas del usuario
   */
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📋 [useMyReservations] Cargando reservas...');
      
      const data = await reservationService.getMyReservations();
      
      console.log('✅ [useMyReservations] Reservas cargadas:', data?.length || 0);
      
      setReservations(data || []);
    } catch (err) {
      const errorMessage = 'Error al cargar las reservas';
      console.error('❌ [useMyReservations] Error:', err);
      
      setError(errorMessage);
      toast.error(errorMessage);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancelar una reserva
   */
  const cancelReservation = useCallback(async (id: string) => {
    try {
      console.log('🚫 [useMyReservations] Cancelando reserva:', id);
      
      await reservationService.cancelReservation(id);
      
      toast.success('Reserva cancelada exitosamente');
      
      // Recargar las reservas
      await loadReservations();
      
      return true;
    } catch (err) {
      console.error('❌ [useMyReservations] Error al cancelar:', err);
      toast.error('Error al cancelar la reserva');
      return false;
    }
  }, [loadReservations]);

  /**
   * Descargar PDF de una reserva
   */
  const downloadPDF = useCallback(async (id: string) => {
    try {
      console.log('📄 [useMyReservations] Descargando PDF:', id);
      
      await reservationService.downloadReservationPDF(id);
      
      toast.success('PDF descargado exitosamente');
      
      return true;
    } catch (err) {
      console.error('❌ [useMyReservations] Error al descargar PDF:', err);
      toast.error('Error al descargar el PDF');
      return false;
    }
  }, []);

  /**
   * Refrescar las reservas manualmente
   */
  const refresh = useCallback(() => {
    console.log('🔄 [useMyReservations] Refrescando reservas...');
    loadReservations();
  }, [loadReservations]);

  // Cargar reservas al montar el componente
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    reservations,
    loading,
    error,
    refresh,
    cancelReservation,
    downloadPDF
  };
};
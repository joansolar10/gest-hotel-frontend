import api from './api';

/**
 * PaymentService - Frontend
 * 
 * Servicio para manejar todas las operaciones relacionadas con pagos
 * Abstrae las llamadas API y proporciona una interfaz limpia
 */

export interface PaymentInitiationRequest {
  reservation_id: string;
  method: 'yape' | 'card';
  card_data?: {
    masked_pan: string;
    expiry: string;
  };
}

export interface PaymentInitiationResponse {
  success: boolean;
  payment_id: string;
  transaction_ref: string;
  status: string;
  message: string;
}

export interface PaymentProcessResponse {
  success: boolean;
  payment_id: string;
  status: 'completed' | 'failed';
  message: string;
  transaction_ref?: string;
  authorization_code?: string;
  error?: string;
}

export interface PaymentStatus {
  id: string;
  reservation_id: string;
  method: 'yape' | 'card';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_ref: string;
  created_at: string;
  updated_at: string;
  metadata: any;
  reservations?: any;
}

export interface PaymentEligibility {
  eligible: boolean;
  reason?: string;
  message: string;
}

class PaymentServiceClass {
  /**
   * ✨ Inicia un nuevo pago
   * Con validaciones robustas del backend
   */
  async initiatePayment(data: PaymentInitiationRequest): Promise<PaymentInitiationResponse> {
    try {
      const response = await api.post<PaymentInitiationResponse>(
        '/api/v1/payments/initiate',
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('Error iniciando pago:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al iniciar el pago'
      );
    }
  }

  /**
   * Simula el procesamiento de un pago con Yape
   * En producción, esto sería manejado por webhooks
   */
  async simulateYapePayment(
    payment_id: string, 
    forceFailed: boolean = false
  ): Promise<PaymentProcessResponse> {
    try {
      const forceParam = forceFailed ? '?force=failed' : '?force=success';
      const response = await api.post<PaymentProcessResponse>(
        `/api/v1/payments/simulate/yape/${payment_id}${forceParam}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error procesando pago Yape:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al procesar pago con Yape'
      );
    }
  }

  /**
   * Simula el procesamiento de un pago con tarjeta
   * En producción, esto sería manejado por webhooks
   */
  async simulateCardPayment(
    payment_id: string, 
    forceFailed: boolean = false
  ): Promise<PaymentProcessResponse> {
    try {
      const forceParam = forceFailed ? '?force=failed' : '?force=success';
      const response = await api.post<PaymentProcessResponse>(
        `/api/v1/payments/simulate/card/${payment_id}${forceParam}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error procesando pago con tarjeta:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al procesar pago con tarjeta'
      );
    }
  }

  /**
   * Obtiene el estado actual de un pago
   */
  async getPaymentStatus(payment_id: string): Promise<PaymentStatus> {
    try {
      const response = await api.get<PaymentStatus>(
        `/api/v1/payments/${payment_id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo estado de pago:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al obtener el estado del pago'
      );
    }
  }

  /**
   * ✨ NUEVO: Verifica si una reserva puede ser pagada
   * Útil antes de mostrar la página de pago
   */
  async checkPaymentEligibility(reservation_id: string): Promise<PaymentEligibility> {
    try {
      const response = await api.get<PaymentEligibility>(
        `/api/v1/payments/check-eligibility/${reservation_id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error verificando elegibilidad:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al verificar si la reserva puede ser pagada'
      );
    }
  }

  /**
   * ✨ NUEVO: Obtiene el historial de pagos de una reserva
   * Útil para mostrar intentos previos o auditoría
   */
  async getPaymentHistory(reservation_id: string): Promise<{
    reservation_id: string;
    payments: PaymentStatus[];
    count: number;
  }> {
    try {
      const response = await api.get(
        `/api/v1/payments/history/${reservation_id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error obteniendo historial de pagos:', error);
      throw new Error(
        error.response?.data?.error || 
        'Error al obtener el historial de pagos'
      );
    }
  }

  /**
   * ⭐ Método integrado: Inicia y procesa un pago con Yape
   * Maneja todo el flujo completo
   */
  async processYapePayment(reservation_id: string): Promise<{
    success: boolean;
    payment_id?: string;
    message: string;
    error?: string;
  }> {
    try {
      // 1. Iniciar el pago
      const initResult = await this.initiatePayment({
        reservation_id,
        method: 'yape'
      });

      if (!initResult.success || !initResult.payment_id) {
        return {
          success: false,
          message: initResult.message || 'Error al iniciar el pago',
          error: 'INITIATION_FAILED'
        };
      }

      // 2. Simular el procesamiento (en producción sería un webhook)
      // Esperamos 2 segundos para simular el delay real
      await new Promise(resolve => setTimeout(resolve, 2000));

      const processResult = await this.simulateYapePayment(initResult.payment_id);

      return {
        success: processResult.success,
        payment_id: processResult.payment_id,
        message: processResult.message
      };
    } catch (error: any) {
      console.error('Error en processYapePayment:', error);
      return {
        success: false,
        message: error.message || 'Error al procesar el pago',
        error: 'PROCESSING_FAILED'
      };
    }
  }

  /**
   * ⭐ Método integrado: Inicia y procesa un pago con tarjeta
   * Maneja todo el flujo completo
   */
  async processCardPayment(
    reservation_id: string,
    card_data: {
      masked_pan: string;
      expiry: string;
    }
  ): Promise<{
    success: boolean;
    payment_id?: string;
    message: string;
    error?: string;
  }> {
    try {
      // 1. Iniciar el pago
      const initResult = await this.initiatePayment({
        reservation_id,
        method: 'card',
        card_data
      });

      if (!initResult.success || !initResult.payment_id) {
        return {
          success: false,
          message: initResult.message || 'Error al iniciar el pago',
          error: 'INITIATION_FAILED'
        };
      }

      // 2. Simular el procesamiento (en producción sería un webhook)
      // Esperamos 1.5 segundos para simular el delay real
      await new Promise(resolve => setTimeout(resolve, 1500));

      const processResult = await this.simulateCardPayment(initResult.payment_id);

      return {
        success: processResult.success,
        payment_id: processResult.payment_id,
        message: processResult.message
      };
    } catch (error: any) {
      console.error('Error en processCardPayment:', error);
      return {
        success: false,
        message: error.message || 'Error al procesar el pago',
        error: 'PROCESSING_FAILED'
      };
    }
  }
}

// Exportar instancia única (singleton)
export const PaymentService = new PaymentServiceClass();
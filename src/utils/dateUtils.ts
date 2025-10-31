/**
 * Utilidades para manejo seguro de fechas sin conversión de zona horaria
 */

/**
 * Formatea una fecha de forma segura sin conversión de zona horaria
 * @param dateString - Fecha en formato YYYY-MM-DD o ISO
 * @returns Fecha formateada en español
 */
export const formatDateSafe = (dateString: string): string => {
  // Extraer solo la parte de fecha (YYYY-MM-DD)
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  
  // Crear fecha en zona horaria local (sin conversión UTC)
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una fecha de forma compacta (ej: 20 nov. 2025)
 */
export const formatDateCompact = (dateString: string): string => {
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  return date.toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Calcula el número de noches entre dos fechas
 */
export const calculateNights = (checkIn: string, checkOut: string): number => {
  const start = checkIn.split('T')[0];
  const end = checkOut.split('T')[0];
  
  const [y1, m1, d1] = start.split('-').map(Number);
  const [y2, m2, d2] = end.split('-').map(Number);
  
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
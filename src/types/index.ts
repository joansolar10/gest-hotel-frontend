export interface Room {
  id: string;
  code: string;
  type: 'single' | 'double' | 'suite';
  description: string;
  price_per_night: number;
  capacity: number;
  services: {
    wifi?: boolean;
    tv?: boolean;
    minibar?: boolean;
    ac?: boolean;
    jacuzzi?: boolean;
    room_service?: boolean;
  };
  images: string[];
  status: 'available' | 'reserved' | 'maintenance';
  created_at?: string;
}

export interface RoomFilters {
  type?: string;
  precio_min?: number;
  precio_max?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  servicios?: string;
}
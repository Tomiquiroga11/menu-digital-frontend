export interface RestauranteSimple {
    id: number;
    nombre: string;
    imagenUrl?: string;
  }
  
  export interface ReporteVisitas {
    restauranteId: number;
    nombreRestaurante: string;
    totalVisitas: number;
    imagenUrl?: string;
    horaApertura: number;
    horaCierre: number;
    telefono: string;
    happyHourInicio: number;
    happyHourFin: number;
  }
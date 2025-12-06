export interface ItemPedido {
    nombreProducto: string;
    cantidad: number;
    subtotal: number;
  }
  
  export interface SolicitudPedido {
    restauranteId: number;
    items: ItemPedido[];
    total: number;
  }
  
  export interface RespuestaPedido {
    localAbierto: boolean;
    linkWhatsApp?: string;
    mensaje: string;
  }
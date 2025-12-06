import { ProductoDto } from './menu.model';

export interface CartItem {
  producto: ProductoDto;
  cantidad: number;
  subtotal: number;
}
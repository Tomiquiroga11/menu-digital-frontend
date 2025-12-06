import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- 1. IMPORTAR HTTPCLIENT
import { BehaviorSubject, Observable } from 'rxjs'; // <-- 2. IMPORTAR OBSERVABLE
import { CartItem } from '../models/carrito.model';
import { ProductoDto } from '../models/menu.model';
import { SolicitudPedido, RespuestaPedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private cartKey = 'menu_digital_cart';
  // Asegúrate de que este puerto sea el correcto de tu backend
  private apiUrl = 'http://localhost:5071/api/pedidos/whatsapp';
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  // 3. INYECTAR HTTPCLIENT EN EL CONSTRUCTOR
  constructor(private http: HttpClient) {
    this.loadCart(); 
  }

  get currentItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(producto: ProductoDto): void {
    const items = this.currentItems;
    const existingItem = items.find(item => item.producto.id === producto.id);

    // Usamos el precio que ya viene (que puede ser el rebajado si el backend lo calculó)
    const precioFinal = producto.precio; 

    if (existingItem) {
      existingItem.cantidad++;
      existingItem.subtotal = existingItem.cantidad * precioFinal;
    } else {
      items.push({
        producto: producto,
        cantidad: 1,
        subtotal: precioFinal
      });
    }

    this.saveCart(items);
  }

  removeFromCart(productoId: number): void {
    let items = this.currentItems;
    const existingItem = items.find(item => item.producto.id === productoId);

    if (existingItem) {
      if (existingItem.cantidad > 1) {
        existingItem.cantidad--;
        existingItem.subtotal = existingItem.cantidad * existingItem.producto.precio;
      } else {
        items = items.filter(item => item.producto.id !== productoId);
      }
      this.saveCart(items);
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.currentItems.reduce((total, item) => total + item.subtotal, 0);
  }
  
  getItemCount(): number {
    return this.currentItems.reduce((count, item) => count + item.cantidad, 0);
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem(this.cartKey);
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }
  
  // --- MÉTODO PARA EL PEDIDO DE WHATSAPP ---
  generarPedidoWhatsApp(restauranteId: number): Observable<RespuestaPedido> {
    const solicitud: SolicitudPedido = {
      restauranteId: restauranteId,
      total: this.getTotal(),
      items: this.currentItems.map(i => ({
        nombreProducto: i.producto.nombre,
        cantidad: i.cantidad,
        subtotal: i.subtotal
      }))
    };

    return this.http.post<RespuestaPedido>(this.apiUrl, solicitud);
  }
}
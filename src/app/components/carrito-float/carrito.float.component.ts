import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CartItem } from '../../models/carrito.model';
import { RespuestaPedido } from '../../models/pedido.model';

@Component({
  selector: 'app-carrito-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.float.component.html',
  styleUrl: './carrito.float.component.scss'
})
export class CarritoFloatComponent implements OnInit {
  
  @Input() nombreRestaurante: string = 'Restaurante';
  @Input() restauranteId: number = 0; 

  isOpen: boolean = false;
  items: CartItem[] = [];
  total: number = 0;
  itemCount: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carritoService.cartItems$.subscribe(items => {
      this.items = items;
      this.total = this.carritoService.getTotal();
      this.itemCount = this.carritoService.getItemCount();
    });
  }

  toggleCart(): void {
    this.isOpen = !this.isOpen;
  }

  agregar(item: CartItem): void {
    this.carritoService.addToCart(item.producto);
  }

  quitar(item: CartItem): void {
    this.carritoService.removeFromCart(item.producto.id);
  }

  limpiar(): void {
    if(confirm('¿Vaciar carrito?')) {
      this.carritoService.clearCart();
      this.isOpen = false;
    }
  }
  
  finalizarPedido(): void {
    if (this.restauranteId === 0) {
      alert('Error: No se pudo identificar el restaurante. Por favor recarga la página.');
      return;
    }

    this.carritoService.generarPedidoWhatsApp(this.restauranteId).subscribe({
      next: (res: RespuestaPedido) => {
        if (res.localAbierto && res.linkWhatsApp) {
          // 1. Abrir WhatsApp en nueva pestaña
          window.open(res.linkWhatsApp, '_blank');
          
          // 2. --- NUEVO: Vaciar el carrito automáticamente ---
          this.carritoService.clearCart();
          
          // 3. --- NUEVO: Cerrar el panel del carrito ---
          this.isOpen = false; 

        } else {
          // Si está cerrado, mostramos el mensaje y NO borramos el carrito
          // para que el usuario pueda intentar más tarde.
          alert(res.mensaje);
        }
      },
      error: (err: any) => {
        console.error('Error al generar pedido', err);
        alert('Ocurrió un error al conectar con el servidor.');
      }
    });
  }
}
import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, formatCurrency } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartStore } from '../../core/services/cart-store';
import { RestaurantApi } from '../../core/services/restaurant-api';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private readonly restaurantApi = inject(RestaurantApi);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly cart = inject(CartStore);

  protected readonly isCheckingStatus = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly openingHours = signal('');
  protected readonly statusError = signal<string | null>(null);
  protected readonly orderSent = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    customerName: ['', [Validators.required, Validators.maxLength(60)]],
    notes: ['', [Validators.maxLength(300)]],
  });

  ngOnInit(): void {
    const restaurant = this.cart.restaurant();
    if (!restaurant || this.cart.items().length === 0) {
      return;
    }

    this.isCheckingStatus.set(true);
    this.restaurantApi.getMenu(restaurant.id).subscribe({
      next: (menu) => {
        this.cart.syncWithMenu(menu);
        this.isOpen.set(menu.isOpen);
        this.openingHours.set(`${menu.openingTime.slice(0, 5)} a ${menu.closingTime.slice(0, 5)}`);
        this.isCheckingStatus.set(false);
      },
      error: () => {
        this.statusError.set('No pudimos verificar si el local está abierto. Probá recargar la página.');
        this.isCheckingStatus.set(false);
      },
    });
  }

  protected sendOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const restaurant = this.cart.restaurant();
    if (!restaurant || !this.isOpen()) {
      return;
    }

    const message = this.buildMessage(restaurant.name);
    const url = `https://wa.me/${restaurant.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
    this.orderSent.set(true);
  }

  protected clearCart(): void {
    this.cart.clear();
    this.orderSent.set(false);
  }

  private buildMessage(restaurantName: string): string {
    const { customerName, notes } = this.form.getRawValue();

    const lines: string[] = [`¡Hola ${restaurantName}! Quiero hacer un pedido:`, ''];

    for (const item of this.cart.items()) {
      const lineTotal = item.product.finalPrice * item.quantity;
      lines.push(`• ${item.quantity} x ${item.product.name}: ${this.formatPrice(lineTotal)}`);
    }

    lines.push('', `Subtotal: ${this.formatPrice(this.cart.subtotal())}`, '', `A nombre de: ${customerName.trim()}`);

    if (notes.trim()) {
      lines.push(`Comentarios: ${notes.trim()}`);
    }

    return lines.join('\n');
  }

  private formatPrice(value: number): string {
    return formatCurrency(value, 'es-AR', '$', 'ARS', '1.0-2');
  }
}
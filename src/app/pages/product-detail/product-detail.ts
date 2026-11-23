import { Component, OnInit, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { RestaurantMenu } from '../../core/models/restaurant';
import { CartStore } from '../../core/services/cart-store';
import { RestaurantApi } from '../../core/services/restaurant-api';
import { AuthStore } from '../../core/services/auth-store';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  private readonly restaurantApi = inject(RestaurantApi);
  private readonly cart = inject(CartStore);

  readonly restaurantId = input.required({ transform: numberAttribute });
  readonly productId = input.required({ transform: numberAttribute });

  protected readonly menu = signal<RestaurantMenu | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly wasAdded = signal(false);
  protected readonly auth = inject(AuthStore);

  protected readonly category = computed(
    () =>
      this.menu()?.categories.find((category) =>
        category.products.some((product) => product.id === this.productId()),
      ) ?? null,
  );

  protected readonly product = computed(
    () => this.category()?.products.find((product) => product.id === this.productId()) ?? null,
  );

  ngOnInit(): void {
    this.restaurantApi.getMenu(this.restaurantId()).subscribe({
      next: (menu) => {
        this.menu.set(menu);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No encontramos este restaurante.');
        this.isLoading.set(false);
      },
    });
  }

  protected onAddToCart(): void {
    const menu = this.menu();
    const product = this.product();
    if (!menu || !product) {
      return;
    }
    const added = this.cart.add(product, { id: menu.id, name: menu.name, phone: menu.phone });
    this.wasAdded.set(added);
  }
}
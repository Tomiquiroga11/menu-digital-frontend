import { Component, OnInit, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RestaurantMenu } from '../../core/models/restaurant';
import { RestaurantApi } from '../../core/services/restaurant-api';
import { ProductCard } from '../../shared/product-card/product-card';
import { CartStore } from '../../core/services/cart-store';
import { Product } from '../../core/models/product';

@Component({
  selector: 'app-restaurant-detail',
  imports: [RouterLink, ProductCard],
  templateUrl: './restaurant-detail.html',
  styleUrl: './restaurant-detail.css',
})
export class RestaurantDetail implements OnInit {
  private readonly restaurantApi = inject(RestaurantApi);
  private readonly cart = inject(CartStore);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly menu = signal<RestaurantMenu | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly selectedCategoryId = signal<number | null>(null);

  protected readonly featuredProducts = computed(() => {
    const menu = this.menu();
    if (!menu) {
      return [];
    }
    return menu.categories.flatMap((category) => category.products).filter((product) => product.isFeatured);
  });

  protected readonly visibleCategories = computed(() => {
    const menu = this.menu();
    if (!menu) {
      return [];
    }
    const selectedId = this.selectedCategoryId();
    if (selectedId === null) {
      return menu.categories;
    }
    return menu.categories.filter((category) => category.id === selectedId);
  });

  ngOnInit(): void {
    this.restaurantApi.getMenu(this.id()).subscribe({
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

  protected selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  protected onAddToCart(product: Product): void {
    const menu = this.menu();
    if (!menu) {
      return;
    }
    this.cart.add(product, { id: menu.id, name: menu.name, phone: menu.phone});
  }
}
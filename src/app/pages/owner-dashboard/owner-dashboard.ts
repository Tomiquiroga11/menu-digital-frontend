import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RestaurantMenu } from '../../core/models/restaurant';
import { AuthStore } from '../../core/services/auth-store';
import { RestaurantApi } from '../../core/services/restaurant-api';
import { CategoryManager } from '../../owner/category-manager/category-manager';
import { OwnerProductRow } from '../../owner/owner-product-row/owner-product-row';

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterLink, CategoryManager, OwnerProductRow],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css',
})
export class OwnerDashboard implements OnInit {
  private readonly restaurantApi = inject(RestaurantApi);
  protected readonly auth = inject(AuthStore);

  protected readonly menu = signal<RestaurantMenu | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMenu();
  }

  protected loadMenu(): void {
    const restaurantId = this.auth.restaurantId();
    if (restaurantId === null) {
      this.errorMessage.set('Tu cuenta no tiene un restaurante asociado.');
      this.isLoading.set(false);
      return;
    }

    this.restaurantApi.getMenu(restaurantId).subscribe({
      next: (menu) => {
        this.menu.set(menu);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar tu menú.');
        this.isLoading.set(false);
      },
    });
  }
}
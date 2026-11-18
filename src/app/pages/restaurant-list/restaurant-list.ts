import { Component, OnInit, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Restaurant } from "../../core/models/restaurant";
import { RestaurantApi } from "../../core/services/restaurant-api";

@Component({
  selector: 'app-restaurant-list',
  imports: [RouterLink],
  templateUrl: './restaurant-list.html',
  styleUrl: './restaurant-list.css',
})

export class RestaurantList implements OnInit{
  private readonly restaurantApi = inject(RestaurantApi);

  protected readonly restaurants = signal<Restaurant[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.restaurantApi.getAll().subscribe({
      next: (data) => {
        this.restaurants.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No pudimos cargar los restaurantes. Probá de nuevo en unos minutos.');
        this.isLoading.set(false);
      },
    });
  }
}
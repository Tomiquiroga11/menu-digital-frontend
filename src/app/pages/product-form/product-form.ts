import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Category } from '../../core/models/category';
import { ProductRequest } from '../../core/models/product';
import { AuthStore } from '../../core/services/auth-store';
import { ProductApi } from '../../core/services/product-api';
import { RestaurantApi } from '../../core/services/restaurant-api';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private readonly restaurantApi = inject(RestaurantApi);
  private readonly productApi = inject(ProductApi);
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  readonly productId = input<string>();

  protected readonly editingId = computed(() => {
    const id = this.productId();
    return id ? Number(id) : null;
  });

  protected readonly categories = signal<Category[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    price: [0, [Validators.required, Validators.min(0.01), Validators.max(10_000_000)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    imageUrl: ['', [Validators.pattern(/^https?:\/\/.+/)]],
    isFeatured: [false],
  });

  ngOnInit(): void {
    const restaurantId = this.auth.restaurantId();
    if (restaurantId === null) {
      this.loadError.set('Tu cuenta no tiene un restaurante asociado.');
      this.isLoading.set(false);
      return;
    }

    this.restaurantApi.getMenu(restaurantId).subscribe({
      next: (menu) => {
        this.categories.set(menu.categories);

        const id = this.editingId();
        if (id !== null) {
          const product = menu.categories.flatMap((category) => category.products).find((p) => p.id === id);
          if (!product) {
            this.loadError.set('No encontramos este producto en tu menú.');
            this.isLoading.set(false);
            return;
          }
          this.form.setValue({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl ?? '',
            isFeatured: product.isFeatured,
          });
        } else if (menu.categories.length > 0) {
          this.form.controls.categoryId.setValue(menu.categories[0].id);
        }

        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('No pudimos cargar los datos de tu menú.');
        this.isLoading.set(false);
      },
    });
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const request: ProductRequest = {
      ...value,
      description: value.description.trim(),
      imageUrl: value.imageUrl.trim() || null,
    };

    const id = this.editingId();
    const operation = id === null ? this.productApi.create(request) : this.productApi.update(id, request);

    operation.subscribe({
      next: () => this.router.navigateByUrl('/owner'),
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.status === 400
            ? 'Revisá los datos: algún campo no es válido.'
            : 'No pudimos guardar el producto. Probá de nuevo.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}
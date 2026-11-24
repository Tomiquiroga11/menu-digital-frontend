import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

import { Product } from '../../core/models/product';
import { ProductApi } from '../../core/services/product-api';

@Component({
  selector: 'app-owner-product-row',
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './owner-product-row.html',
  styleUrl: './owner-product-row.css',
})
export class OwnerProductRow {
  private readonly productApi = inject(ProductApi);
  private readonly formBuilder = inject(FormBuilder);

  readonly product = input.required<Product>();
  readonly changed = output<void>();

  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly discountForm = this.formBuilder.nonNullable.group({
    discountPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(/^\d+$/)]],
  });

  private readonly syncDiscount = effect(() => {
    this.discountForm.setValue({ discountPercentage: this.product().discountPercentage });
  });

  protected applyDiscount(): void {
    if (this.discountForm.invalid) {
      this.discountForm.markAllAsTouched();
      return;
    }
    const { discountPercentage } = this.discountForm.getRawValue();
    this.save(this.productApi.updateDiscount(this.product().id, discountPercentage));
  }

  protected toggleHappyHour(event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  this.save(this.productApi.updateHappyHour(this.product().id, isChecked));
}

   protected remove(): void {
    if (!confirm(`¿Borrar "${this.product().name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.save(this.productApi.delete(this.product().id));
  }

  private save(request: Observable<unknown>): void {
    this.isSaving.set(true);
    this.errorMessage.set(null);

    request.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.changed.emit();
      },
      error: () => {
        this.isSaving.set(false);
        this.errorMessage.set('No pudimos guardar el cambio. Probá de nuevo.');
      },
    });
  }
}

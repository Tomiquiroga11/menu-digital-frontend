import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoryMenu } from '../../core/models/category';
import { CategoryApi } from '../../core/services/category-api';

@Component({
  selector: 'app-category-manager',
  imports: [ReactiveFormsModule],
  templateUrl: './category-manager.html',
  styleUrl: './category-manager.css',
})
export class CategoryManager {
  private readonly categoryApi = inject(CategoryApi);
  private readonly formBuilder = inject(FormBuilder);

  readonly categories = input.required<CategoryMenu[]>();
  readonly changed = output<void>();

  protected readonly editingId = signal<number | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly createForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected readonly editForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
  });

  protected create(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.categoryApi.create(this.createForm.getRawValue()).subscribe({
      next: () => {
        this.createForm.reset();
        this.isSaving.set(false);
        this.changed.emit();
      },
      error: () => this.showError('No pudimos crear la categoria. Probá de nuevo.'),
    });
  }

  protected startEditing(category: CategoryMenu): void {
    this.editingId.set(category.id);
    this.editForm.setValue({ name: category.name });
  }

  protected cancelEditing(): void {
    this.editingId.set(null);
  }

  protected saveEdit(categoryId: number): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.categoryApi.update(categoryId, this.editForm.getRawValue()).subscribe({
      next: () => {
        this.editingId.set(null);
        this.isSaving.set(false);
        this.changed.emit();
      },
      error: () => this.showError('No pudimos renombrar la categoría. Probá de nuevo'),
    });
  }

  protected remove(category: CategoryMenu): void {
    const productCount = category.products.length;
    const message =
      productCount > 0
        ? `vas a borrar "${category.name}" y sus ${productCount} productos. Esta accion no se puede deshacer. ¿Continuar?`
        : `¿Borrar la categoría "${category.name}"?`;

    if (!confirm(message)) {
      return;
    }

    this.categoryApi.delete(category.id).subscribe({
      next: () => this.changed.emit(),
      error: () => this.showError('No pudimos borrar la categoría. Probá de nuevo.'),
    });
  }

  private showError(message: string): void {
    this.errorMessage.set(message);
    this.isSaving.set(false);
  }
}

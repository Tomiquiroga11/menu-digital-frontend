import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthApi } from '../../core/services/auth-api';
import { AuthStore } from '../../core/services/auth-store';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private readonly authApi = inject(AuthApi);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject (Router);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
    restaurantName: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
    openingTime: ['', [Validators.required]],
    closingTime: ['', [Validators.required]],
  });

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

  this.authApi
    .register({
      ...value,
      openingTime: `${value.openingTime}:00`,
      closingTime: `${value.closingTime}:00`,
    })
    .subscribe({
      next: (response) => {
        this.authStore.setSession(response);
        this.router.navigateByUrl('/owner');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.status === 409
            ? 'Ya existe una cuenta con ese email.'
            : 'No pudimos crear la cuenta. Revisá los datos y probá de nuevo.',
        );
        this.isSubmitting.set(false);
      },
    });
  }
}

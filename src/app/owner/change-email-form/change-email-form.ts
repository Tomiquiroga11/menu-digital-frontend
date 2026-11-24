import { Component, inject, input, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AccountApi } from '../../core/services/account-api';

@Component({
  selector: 'app-change-email-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-email-form.html',
})
export class ChangeEmailForm {
  private readonly accountApi = inject(AccountApi);
  private readonly formBuilder = inject(FormBuilder);

  readonly currentEmail = input.required<string>();
  readonly emailChanged = output<string>();

  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group({
    newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    currentPassword: ['', [Validators.required]],
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

    this.errorMessage.set(null);

    const { newEmail, currentPassword } = this.form.getRawValue();
    const normalizedEmail = newEmail.trim().toLowerCase();

    if (normalizedEmail === this.currentEmail()) {
      this.errorMessage.set('Ese ya es tu email actual.');
      return;
    }

    this.isSaving.set(true);

    this.accountApi.changeEmail({ newEmail: normalizedEmail, currentPassword }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.emailChanged.emit(normalizedEmail);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'No pudimos cambiar el email. Probá de nuevo.');
        this.isSaving.set(false);
      },
    });
  }
}
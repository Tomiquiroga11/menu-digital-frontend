import { Component, inject, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AccountApi } from '../../core/services/account-api';
import { matchFieldsValidator } from '../../core/validators/match-fields';

@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-form.html',
})
export class ChangePasswordForm {
  private readonly accountApi = inject(AccountApi);
  private readonly formBuilder = inject(FormBuilder);

  readonly passwordChanged = output<void>();

  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.formBuilder.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchFieldsValidator('newPassword', 'confirmPassword') },
  );

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  protected showMismatch(): boolean {
    const confirm = this.form.controls.confirmPassword;
    return this.form.hasError('fieldsMismatch') && confirm.touched && !confirm.hasError('required');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    const { currentPassword, newPassword } = this.form.getRawValue();

    this.accountApi.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.passwordChanged.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error?.message ?? 'No pudimos cambiar la contraseña. Probá de nuevo.');
        this.isSaving.set(false);
      },
    });
  }
}
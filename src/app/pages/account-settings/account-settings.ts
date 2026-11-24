import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Account } from '../../core/models/account';
import { AccountApi } from '../../core/services/account-api';
import { AuthStore } from '../../core/services/auth-store';
import { ChangeEmailForm } from '../../owner/change-email-form/change-email-form';
import { ChangePasswordForm } from '../../owner/change-password-form/change-password-form';

type Credential = 'email' | 'password';

@Component({
  selector: 'app-account-settings',
  imports: [ReactiveFormsModule, RouterLink, ChangeEmailForm, ChangePasswordForm],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  private readonly accountApi = inject(AccountApi);
  private readonly auth = inject(AuthStore);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly account = signal<Account | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly editingCredential = signal<Credential | null>(null);
  protected readonly credentialMessage = signal<string | null>(null);

  protected readonly isSaving = signal(false);
  protected readonly saveMessage = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);

  protected readonly deleteConfirmation = signal('');
  protected readonly isDeleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  protected readonly canDelete = computed(() => {
    const account = this.account();
    return !!account && this.deleteConfirmation().trim() === account.restaurantName;
  });

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    restaurantName: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
    openingTime: ['', [Validators.required]],
    closingTime: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.accountApi.get().subscribe({
      next: (account) => {
        this.account.set(account);
        this.form.setValue({
          name: account.name,
          restaurantName: account.restaurantName,
          address: account.address,
          phone: account.phone,
          openingTime: account.openingTime.slice(0, 5),
          closingTime: account.closingTime.slice(0, 5),
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.loadError.set('No pudimos cargar los datos de tu cuenta.');
        this.isLoading.set(false);
      },
    });
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  protected toggleCredential(credential: Credential): void {
    this.credentialMessage.set(null);
    this.editingCredential.update((current) => (current === credential ? null : credential));
  }

  protected onEmailChanged(email: string): void {
    this.account.update((account) => (account ? { ...account, email } : account));
    this.auth.updateEmail(email);
    this.editingCredential.set(null);
    this.credentialMessage.set('Tu email se actualizó. Usalo la próxima vez que ingreses.');
  }

  protected onPasswordChanged(): void {
    this.editingCredential.set(null);
    this.credentialMessage.set('Tu contraseña se actualizó.');
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveMessage.set(null);
    this.saveError.set(null);

    const value = this.form.getRawValue();

    this.accountApi
      .update({
        ...value,
        openingTime: `${value.openingTime}:00`,
        closingTime: `${value.closingTime}:00`,
      })
      .subscribe({
        next: (account) => {
          this.account.set(account);
          this.auth.updateName(account.name);
          this.saveMessage.set('Cambios guardados.');
          this.isSaving.set(false);
        },
        error: () => {
          this.saveError.set('No pudimos guardar los cambios. Revisá los datos y probá de nuevo.');
          this.isSaving.set(false);
        },
      });
  }

  protected onDeleteConfirmationInput(event: Event): void {
    this.deleteConfirmation.set((event.target as HTMLInputElement).value);
  }

  protected deleteAccount(): void {
    if (!this.canDelete()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.accountApi.delete().subscribe({
      next: () => this.auth.logout('/'),
      error: () => {
        this.deleteError.set('No pudimos eliminar la cuenta. Probá de nuevo.');
        this.isDeleting.set(false);
      },
    });
  }
}
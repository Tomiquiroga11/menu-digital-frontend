import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Account } from '../../core/models/account';
import { AccountApi } from '../../core/services/account-api';

@Component({
  selector: 'app-owner-dashboard',
  imports: [RouterLink],
  templateUrl: './owner-dashboard.html',
})

export class OwnerDashboard implements OnInit {
  private readonly accountApi = inject(AccountApi);

  protected readonly account = signal<Account | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.accountApi.get().subscribe({
      next: (account) => this.account.set(account),
      error: () => this.errorMessage.set('No pudimos cargar los datos de tu cuenta.')
    });
  }
}

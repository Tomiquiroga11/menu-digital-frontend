import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";

import { AuthResponse } from "../models/auth";

const STORAGE_KEY = 'menu-digital-session';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private readonly router = inject(Router);
    private readonly session = signal<AuthResponse | null>(this.loadFromStorage());

    readonly isLoggedIn = computed(() => this.session() !== null);
    readonly token = computed(() => this.session()?.token ?? null);
    readonly userName = computed(() => this.session()?.name ?? '');
    readonly restaurantId = computed(() => this.session()?.restaurantId ?? null);

    private readonly saveToStorage = effect(() => {
        const session = this.session();
        if (session) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        }
    });

    setSession(response: AuthResponse): void {
        this.session.set(response);
    }

    updateName(name: string): void {
        this.session.update((session) => (session ? { ...session, name } : session));
    }

    updateEmail(email: string): void {
        this.session.update((session) => (session ? { ...session, email } : session));
    }

    logout(redirectTo = '/login'): void {
        this.session.set(null);
        this.router.navigateByUrl(redirectTo);
    }

    private loadFromStorage():  AuthResponse | null {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) {
                return null;
            }
            const session: AuthResponse = JSON.parse(saved);
            return this.isExpired(session.token) ? null : session;
        } catch {
            return null;
        }
    }

    private isExpired(token: string): boolean {
        try {
            const payload = token.split('.')[1].replace(/-/g,'+').replace(/_/g, '/');
            const { exp } = JSON.parse(atob(payload));
            return Date.now() >= exp * 1000;
        } catch {
            return true;
        }
    }
}
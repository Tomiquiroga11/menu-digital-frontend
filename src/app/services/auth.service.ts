import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs'; 
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5071/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          console.log('Token guardado:', this.getDecodedToken());
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('auth_token'); 
    this.router.navigate(['/login']);      
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decodedHtml = atob(payload);
      return JSON.parse(decodedHtml);
    } catch (e) {
      console.error('Error al decodificar token', e);
      return null;
    }
  }

  getUserEmail(): string | null {
    const tokenData = this.getDecodedToken();
    if (!tokenData) return null;
    return tokenData.email || 
           tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
           tokenData.Email || 
           null;
  }

  getRestauranteId(): string | null {
    const token = this.getDecodedToken();
    if (!token) return null;

    console.log('Datos del Token:', token); 

    const id = token.nameid || 
               token.sub || 
               token.id || 
               token.Id || 
               token.restauranteId ||
               token['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    if (!id) {
        console.error('¡ALERTA! No se encontró el ID en el token. Revisa el Backend.');
    }

    return id;
  }
}
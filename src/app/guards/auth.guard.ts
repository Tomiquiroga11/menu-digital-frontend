import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importa tu servicio

export const authGuard: CanActivateFn = (route, state) => {

  // Inyecta el AuthService y el Router
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el servicio dice que estamos logueados (el token existe)...
  if (authService.isLoggedIn()) {
    return true; // ...permite el acceso
  }

  // Si no...
  console.log('AuthGuard: Acceso denegado, redirigiendo a /login');
  router.navigate(['/login']); // Redirige al login
  return false; // ...bloquea el acceso
};
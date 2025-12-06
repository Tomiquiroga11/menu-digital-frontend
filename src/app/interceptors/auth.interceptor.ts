import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // 1. Importa tu servicio

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 2. Inyecta el AuthService
  const authService = inject(AuthService);
  const token = authService.getToken(); // 3. Obtiene el token de localStorage

  // 4. Si el token existe...
  if (token) {
    // Clona la solicitud actual y le agrega el encabezado (header)
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    // 5. Deja que la solicitud clonada (con el token) continúe
    return next(clonedReq);
  }

  // 6. Si no hay token, deja pasar la solicitud original (para login, register, etc.)
  return next(req);
};
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// 1. Importa 'withInterceptors'
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

// 2. Importa tu nuevo interceptor
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 

    // 3. Esta línea ahora registra el interceptor
    provideHttpClient(withInterceptors([authInterceptor])), 

  ]
};
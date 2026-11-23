import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

import { environment } from "../../../environments/environment";
import { AuthStore } from "../services/auth-store";

export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const authStore = inject(AuthStore);
    const token = authStore.token();
    const isApiRequest = request.url.startsWith(environment.apiUrl);

    const authorizedRequest =
        token && isApiRequest ? request.clone({ setHeaders: { Authorization: `Bearer ${token}`} }) : request;

    return next(authorizedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && token) {
                authStore.logout();
            }
            return throwError(() => error);
        }),
    );
};
import { inject } from "@angular/core";
import { CanActivateFn, Route, Router } from "@angular/router";

import { AuthStore } from "../services/auth-store";

export const authGuard: CanActivateFn = (_route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isLoggedIn()) {
        return true;
    }

    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
}
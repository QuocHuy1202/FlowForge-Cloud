
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { BffAuthService } from './bff-auth.service';

export const bffAuthGuard: CanActivateFn = async (
    _route,
    state
) => {
    const authService = inject(BffAuthService);
    const router = inject(Router);

    const loginRedirect = router.createUrlTree(['/login'], {
        queryParams: {
            returnUrl: state.url,
        },
    });

    try {
        const session = await authService.getSession();

        return session?.authenticated === true
            ? true
            : loginRedirect;
    } catch {
        // Fail closed: never grant route access
        // when the session cannot be verified.
        return loginRedirect;
    }
};

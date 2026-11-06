import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BffAuthService } from './bff-auth.service';

// The theme's logo links to '/'. Send an active cookie session to its dashboard.
export const publicHomeGuard: CanActivateFn = async () => {
  const auth = inject(BffAuthService);
  const router = inject(Router);

  try {
    const session = await auth.getSession();
    return session?.authenticated ? router.createUrlTree(['/dashboard']) : true;
  } catch {
    return true;
  }
};

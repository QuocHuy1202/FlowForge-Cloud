import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { AbpOAuthService } from '@abp/ng.oauth';
import { BffAuthService } from './bff-auth.service';

@Injectable({
  providedIn: 'root',
})
export class FlowForgeAuthService extends AbpOAuthService {
  private readonly bffAuth = inject(BffAuthService);
  private readonly appRouter = inject(Router);

  /**
   * Override ABP's default logout to integrate with BFF cookie session
   * and redirect to the public home page.
   */
  override logout(queryParams?: any): Observable<any> {
    // When ABP performs internal silent cleanup (e.g. noRedirectToLogoutUrl is true),
    // do NOT kill the active BFF session or force redirect to public home.
    if (queryParams?.noRedirectToLogoutUrl) {
      return of(undefined);
    }
    return from(this.performBffLogout());
  }

  /**
   * Safe navigate to login route when unauthenticated or session expired.
   */
  override navigateToLogin(queryParams?: any): void {
    const returnUrl = queryParams?.returnUrl || this.appRouter.url;
    this.appRouter.navigate(['/login'], { queryParams: { returnUrl } });
  }

  private async performBffLogout(): Promise<void> {
    try {
      await this.bffAuth.logout();
    } catch (error) {
      console.warn('BFF logout error:', error);
    } finally {
      // Redirect to the public home page
      await this.appRouter.navigateByUrl('/', { replaceUrl: true });
    }
  }
}

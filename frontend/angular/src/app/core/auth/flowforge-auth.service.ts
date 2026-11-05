import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
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
  override logout(_queryParams?: any): Observable<any> {
    return from(this.performBffLogout());
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


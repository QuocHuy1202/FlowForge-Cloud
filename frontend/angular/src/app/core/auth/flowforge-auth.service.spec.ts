import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BffAuthService } from './bff-auth.service';
import { FlowForgeAuthService } from './flowforge-auth.service';

describe('FlowForgeAuthService', () => {
  let service: FlowForgeAuthService;
  let bffAuthMock: { logout: ReturnType<typeof vi.fn> };
  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };
  let oAuthServiceMock: Record<string, any>;

  beforeEach(() => {
    bffAuthMock = {
      logout: vi.fn(),
    };
    routerMock = {
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };
    oAuthServiceMock = {
      configure: vi.fn(),
      hasValidAccessToken: vi.fn().mockReturnValue(false),
      revokeTokenAndLogout: vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      providers: [
        FlowForgeAuthService,
        { provide: BffAuthService, useValue: bffAuthMock },
        { provide: Router, useValue: routerMock },
        { provide: OAuthService, useValue: oAuthServiceMock },
      ],
    });

    service = TestBed.inject(FlowForgeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('logout', () => {
    it('should call BffAuthService.logout and redirect to public home / with replaceUrl', async () => {
      bffAuthMock.logout.mockResolvedValueOnce(undefined);

      await firstValueFrom(service.logout());

      expect(bffAuthMock.logout).toHaveBeenCalled();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/', { replaceUrl: true });
    });

    it('should still navigate to public home even if BffAuthService.logout throws an error', async () => {
      bffAuthMock.logout.mockRejectedValueOnce(new Error('Logout network failure'));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await firstValueFrom(service.logout());

      expect(bffAuthMock.logout).toHaveBeenCalled();
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/', { replaceUrl: true });
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});

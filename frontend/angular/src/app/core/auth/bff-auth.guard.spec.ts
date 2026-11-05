import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { bffAuthGuard } from './bff-auth.guard';
import { BffAuthService } from './bff-auth.service';

describe('bffAuthGuard', () => {
  let authServiceMock: { getSession: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authServiceMock = {
      getSession: vi.fn(),
    };
    routerMock = {
      createUrlTree: vi.fn().mockImplementation((commands, extras) => ({
        toString: () => `/login?returnUrl=${extras?.queryParams?.returnUrl || ''}`,
      })),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: BffAuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  const executeGuard = (url: string) => {
    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const stateSnapshot = { url } as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => bffAuthGuard(routeSnapshot, stateSnapshot));
  };

  it('should allow access (return true) when session is authenticated', async () => {
    authServiceMock.getSession.mockResolvedValueOnce({
      authenticated: true,
      userId: 'user-123',
    });

    const result = await executeGuard('/dashboard');
    expect(result).toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/dashboard' },
    });
  });

  it('should redirect to login with returnUrl when session is not authenticated (null)', async () => {
    authServiceMock.getSession.mockResolvedValueOnce(null);

    const result = await executeGuard('/workflows');
    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/workflows' },
    });
  });

  it('should redirect to login with returnUrl when authenticated is false', async () => {
    authServiceMock.getSession.mockResolvedValueOnce({ authenticated: false });

    const result = await executeGuard('/tasks');
    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/tasks' },
    });
  });

  it('should fail closed (redirect to login) when getSession throws an exception', async () => {
    authServiceMock.getSession.mockRejectedValueOnce(new Error('Network offline'));

    const result = await executeGuard('/executions');
    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/executions' },
    });
  });
});


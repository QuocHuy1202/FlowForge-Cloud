import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BffAuthService } from './bff-auth.service';
import { publicHomeGuard } from './public-home.guard';

describe('publicHomeGuard', () => {
  const getSession = vi.fn();
  const runGuard = () => TestBed.runInInjectionContext(() =>
    publicHomeGuard({} as ActivatedRouteSnapshot, { url: '/' } as RouterStateSnapshot));

  beforeEach(() => {
    getSession.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: BffAuthService, useValue: { getSession } }],
    });
  });

  it('sends an authenticated logo navigation to dashboard', async () => {
    getSession.mockResolvedValue({ authenticated: true });
    const result = await runGuard();
    expect(TestBed.inject(Router).serializeUrl(result as any)).toBe('/dashboard');
  });

  it('shows the public home to a visitor', async () => {
    getSession.mockResolvedValue(null);
    expect(await runGuard()).toBe(true);
  });

  it('keeps the public home accessible when the session endpoint is unavailable', async () => {
    getSession.mockRejectedValue(new Error('Offline'));
    expect(await runGuard()).toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BffAuthService } from './bff-auth.service';

describe('BffAuthService', () => {
  let service: BffAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BffAuthService],
    });
    service = TestBed.inject(BffAuthService);
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCsrfToken', () => {
    it('should return token when API response is successful', async () => {
      const mockToken = 'test-csrf-token-123';
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: mockToken }),
      } as Response);

      const token = await service.getCsrfToken();
      expect(token).toBe(mockToken);
      expect(globalThis.fetch).toHaveBeenCalledWith('/api/bff/auth/csrf', expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
      }));
    });

    it('should throw error when API response is not ok', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(service.getCsrfToken()).rejects.toThrow('Unable to get CSRF token.');
    });

    it('should throw error when token is empty or missing', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: '' }),
      } as Response);

      await expect(service.getCsrfToken()).rejects.toThrow('CSRF token is missing.');
    });
  });

  describe('getSession', () => {
    it('should return session when authenticated', async () => {
      const mockSession = { authenticated: true, userId: 'u-1', userName: 'admin' };
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockSession,
      } as Response);

      const session = await service.getSession();
      expect(session).toEqual(mockSession);
    });

    it('should return null when status is 401 Unauthorized', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

      const session = await service.getSession();
      expect(session).toBeNull();
    });

    it('should throw error when response status is unexpected error', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(service.getSession()).rejects.toThrow('Session verification failed: 500');
    });

    it('should return null when authenticated is false in response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ authenticated: false }),
      } as Response);

      const session = await service.getSession();
      expect(session).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call logout with CSRF token and verify session is cleared', async () => {
      vi.spyOn(service, 'getCsrfToken').mockResolvedValueOnce('valid-csrf');
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        status: 204,
      } as Response);
      vi.spyOn(service, 'getSession').mockResolvedValueOnce(null);

      await service.logout();

      expect(fetchSpy).toHaveBeenCalledWith('/api/bff/auth/logout', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'X-XSRF-TOKEN': 'valid-csrf',
          'X-Requested-With': 'XMLHttpRequest',
        }),
      }));
    });

    it('should throw error when logout API fails', async () => {
      vi.spyOn(service, 'getCsrfToken').mockResolvedValueOnce('valid-csrf');
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        status: 400,
      } as Response);

      await expect(service.logout()).rejects.toThrow('Logout failed: 400');
    });

    it('should throw error when session is still active after logout call', async () => {
      vi.spyOn(service, 'getCsrfToken').mockResolvedValueOnce('valid-csrf');
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        status: 204,
      } as Response);
      vi.spyOn(service, 'getSession').mockResolvedValueOnce({ authenticated: true });

      await expect(service.logout()).rejects.toThrow('Session is still active after logout.');
    });
  });
});


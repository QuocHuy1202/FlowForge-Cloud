import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(LoginComponent, {
        set: { template: '<form [formGroup]="form"></form>', styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.restoreAllMocks();
  });

  it('should initialize with an empty form and loading = false', () => {
    expect(component).toBeTruthy();
    expect(component.form.value).toEqual({
      userName: '',
      password: '',
      rememberMe: false,
    });
    expect(component.loading).toBe(false);
  });

  it('should mark form controls as touched and not submit when form is invalid', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    component.form.setValue({ userName: '', password: '', rememberMe: false });

    await component.onSubmit();

    expect(component.form.controls.userName.touched).toBe(true);
    expect(component.form.controls.password.touched).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('should prefetch CSRF token on ngOnInit', async () => {
    const mockCsrf = 'prefetched-csrf-token';
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockCsrf }),
    } as Response);

    await component.ngOnInit();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/bff/auth/csrf', expect.anything());
  });

  it('should toggle password visibility flag', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBe(true);
  });

  it('should navigate to /dashboard on successful login and session check', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    vi.spyOn(globalThis, 'fetch')
      // 1. CSRF fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'valid-csrf' }),
      } as Response)
      // 2. Login POST
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response)
      // 3. Me GET
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ authenticated: true, userName: 'admin' }),
      } as Response);

    component.form.setValue({
      userName: 'admin',
      password: 'MyPassword123*',
      rememberMe: false,
    });

    await component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should show error message when login credentials are invalid (401)', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'valid-csrf' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

    component.form.setValue({
      userName: 'wrong',
      password: 'wrong',
      rememberMe: false,
    });

    await component.onSubmit();

    expect(component.errorMessage).toBe('Invalid username or password.');
    expect(component.loading).toBe(false);
  });
});

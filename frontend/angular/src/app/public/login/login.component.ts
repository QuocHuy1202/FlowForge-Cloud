
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface CsrfResponse {
    token: string;
}

interface SessionResponse {
    authenticated: boolean;
    userId?: string;
    userName?: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    readonly form = this.fb.nonNullable.group({
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]],
        rememberMe: false,
    });

    loading = false;
    showPassword = false;
    errorMessage = '';

    // Prefetched on page load — ready before user clicks Sign In
    private csrfToken: string | null = null;

    async ngOnInit(): Promise<void> {
        // 1. Pre-fetch CSRF token
        try {
            const response = await fetch('/api/bff/auth/csrf', {
                credentials: 'same-origin',
                cache: 'no-store',
            });
            if (response.ok) {
                const data: CsrfResponse = await response.json();
                this.csrfToken = data.token;
            }
        } catch {
            this.csrfToken = null;
        }

        // 2. Pre-load Dashboard bundle in background while user is typing
        import('../../home/home.component').catch(() => {
            // Silently ignore preload errors
        });
    }

    async onSubmit(): Promise<void> {
        if (this.loading) return;

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.errorMessage = '';

        try {
            // Use prefetched token; fallback to fresh fetch if not ready
            let token = this.csrfToken;

            if (!token) {
                const csrfResponse = await fetch('/api/bff/auth/csrf', {
                    credentials: 'same-origin',
                    cache: 'no-store',
                });
                if (!csrfResponse.ok) {
                    throw new Error('Unable to initialize secure login.');
                }
                const csrf: CsrfResponse = await csrfResponse.json();
                token = csrf.token;
            }

            const loginResponse = await fetch('/api/bff/auth/login', {
                method: 'POST',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(this.form.getRawValue()),
            });

            if (!loginResponse.ok) {
                switch (loginResponse.status) {
                    case 400:
                        this.errorMessage = 'Invalid request or security token.';
                        break;
                    case 401:
                        this.errorMessage = 'Invalid username or password.';
                        break;
                    case 403:
                        this.errorMessage = 'Your account cannot sign in.';
                        break;
                    case 409:
                        this.errorMessage =
                            'Additional verification is required. Please use the supported verification flow.';
                        break;
                    case 423:
                        this.errorMessage = 'Account temporarily locked.';
                        break;
                    default:
                        this.errorMessage = 'Sign in failed. Please try again.';
                }
                return;
            }

            // Verify that the browser received a valid session.
            const meResponse = await fetch('/api/bff/auth/me', {
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!meResponse.ok) {
                throw new Error('Login succeeded, but session verification failed.');
            }

            const session: SessionResponse = await meResponse.json();

            if (!session.authenticated) {
                throw new Error('Authentication session is unavailable.');
            }

            this.form.controls.password.reset();
            await this.router.navigateByUrl('/dashboard');
        } catch (error) {
            this.errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred.';
        } finally {
            this.loading = false;
        }
    }
}

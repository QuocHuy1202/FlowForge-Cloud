import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalizationService } from '@abp/ng.core';
import { LanguageSwitchComponent } from '../../shared/components/language-switch/language-switch.component';
import { AppLocalizationPipe } from '../../shared/pipes/localization.pipe';

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
    imports: [ReactiveFormsModule, RouterLink, LanguageSwitchComponent, AppLocalizationPipe],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    private readonly localization = inject(LocalizationService);
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

    private csrfToken: string | null = null;

    async ngOnInit(): Promise<void> {
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

            const response = await fetch('/api/bff/auth/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(this.form.getRawValue()),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                this.errorMessage =
                    errData.message || this.localization.instant('::Login:defaultError');
                return;
            }

            const meResponse = await fetch('/api/bff/auth/me', {
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!meResponse.ok) {
                this.errorMessage =
                    this.localization.instant('::Login:sessionError');
                return;
            }

            const session: SessionResponse = await meResponse.json();
            if (!session.authenticated) {
                this.errorMessage =
                    this.localization.instant('::Login:authenticationError');
                return;
            }

            await this.router.navigateByUrl('/dashboard');
        } catch {
            this.errorMessage =
                this.localization.instant('::Login:defaultError');
        } finally {
            this.loading = false;
        }
    }
}

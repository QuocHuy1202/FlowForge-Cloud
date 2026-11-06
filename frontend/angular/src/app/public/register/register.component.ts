import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalizationService } from '@abp/ng.core';
import { LanguageSwitchComponent } from '../../shared/components/language-switch/language-switch.component';
import { AppLocalizationPipe } from '../../shared/pipes/localization.pipe';

function passwordsMatch(
    control: AbstractControl
): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    return password === confirm
        ? null
        : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, LanguageSwitchComponent, AppLocalizationPipe],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
    private readonly localization = inject(LocalizationService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    readonly form = this.fb.nonNullable.group(
        {
            userName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(256),
                    Validators.pattern(/^[a-zA-Z0-9_-]+$/),
                ],
            ],
            emailAddress: [
                '',
                [
                    Validators.required,
                    Validators.email,
                    Validators.maxLength(256),
                ],
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                ],
            ],
            confirmPassword: [
                '',
                [
                    Validators.required,
                ],
            ],
        },
        { validators: [passwordsMatch] }
    );

    loading = false;
    showPassword = false;
    showConfirmPassword = false;
    errorMessage = '';

    private csrfToken: string | null = null;

    async ngOnInit(): Promise<void> {
        try {
            const response = await fetch('/api/bff/auth/csrf', {
                credentials: 'same-origin',
                cache: 'no-store',
            });
            if (response.ok) {
                const data = await response.json();
                this.csrfToken = data.token;
            }
        } catch {
            this.csrfToken = null;
        }
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
                    throw new Error('Unable to get CSRF token.');
                }
                const csrf = await csrfResponse.json();
                token = csrf.token;
            }

            const response = await fetch('/api/bff/auth/register', {
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
                    errData.message || this.localization.instant('::Register:defaultError');
                return;
            }

            await this.router.navigate(['/login'], {
                queryParams: { registered: 'true' },
            });
        } catch {
            this.errorMessage = this.localization.instant('::Register:defaultError');
        } finally {
            this.loading = false;
        }
    }
}

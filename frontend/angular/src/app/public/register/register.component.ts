
import { Component, inject, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
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
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        },
        { validators: passwordsMatch }
    );

    loading = false;
    errorMessage = '';
    showPassword = false;
    showConfirmPassword = false;

    private csrfToken: string | null = null;

    async ngOnInit(): Promise<void> {
        await this.loadCsrfToken();
    }

    private async loadCsrfToken(): Promise<string> {
        const response = await fetch('/api/bff/auth/csrf', {
            credentials: 'same-origin',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Unable to initialize secure registration.');
        }

        const data: { token: string } = await response.json();
        this.csrfToken = data.token;

        return data.token;
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
            const token =
                this.csrfToken ?? (await this.loadCsrfToken());

            const { userName, emailAddress, password, confirmPassword } =
                this.form.getRawValue();

            const response = await fetch('/api/bff/auth/register', {
                method: 'POST',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    userName: userName.trim(),
                    emailAddress: emailAddress.trim(),
                    password,
                    confirmPassword,
                }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    this.errorMessage =
                        'Registration information is invalid. Check the fields and password policy.';
                } else if (response.status === 403) {
                    this.errorMessage =
                        'Account registration is currently unavailable.';
                } else if (response.status === 429) {
                    this.errorMessage =
                        'Too many requests. Please try again later.';
                } else {
                    this.errorMessage =
                        'Unable to create your account. Please try again.';
                }

                return;
            }

            this.form.controls.password.reset();
            this.form.controls.confirmPassword.reset();

            await this.router.navigate(['/login'], {
                queryParams: { registered: 'true' },
            });
        } catch {
            this.errorMessage =
                'Could not connect to the server. Please try again.';
        } finally {
            this.loading = false;
        }
    }
}

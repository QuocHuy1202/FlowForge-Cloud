
import { Injectable } from '@angular/core';

interface CsrfResponse {
    token: string;
}

export interface BffSession {
    authenticated: boolean;
    userId?: string;
    userName?: string;
}

@Injectable({
    providedIn: 'root',
})
export class BffAuthService {
    private readonly baseUrl = '/api/bff/auth';

    async getCsrfToken(): Promise<string> {
        const response = await fetch(`${this.baseUrl}/csrf`, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Unable to get CSRF token.');
        }

        const data = (await response.json()) as CsrfResponse;

        if (!data.token) {
            throw new Error('CSRF token is missing.');
        }

        return data.token;
    }

    async getSession(): Promise<BffSession | null> {
        const response = await fetch(`${this.baseUrl}/me`, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store',
        });

        if (response.status === 401) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `Session verification failed: ${response.status}`
            );
        }

        const data = (await response.json()) as BffSession;

        return data.authenticated === true ? data : null;
    }

    async logout(): Promise<void> {
        // Always request a fresh CSRF token for
        // the currently authenticated session.
        const csrfToken = await this.getCsrfToken();

        const logoutResponse = await fetch(
            `${this.baseUrl}/logout`,
            {
                method: 'POST',
                credentials: 'same-origin',
                cache: 'no-store',
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            }
        );

        if (logoutResponse.status !== 204) {
            throw new Error(
                `Logout failed: ${logoutResponse.status}`
            );
        }

        // Verify that the cookie session is no longer valid.
        const session = await this.getSession();

        if (session !== null) {
            throw new Error(
                'Session is still active after logout.'
            );
        }
    }
}

import { Injectable, signal } from '@angular/core';
import { AuthApi, AuthResponse, LoginRequest, RegisterRequest } from '../../api/auth.api';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';

export interface User {
    username: string;
    roles: string[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    currentUser = signal<User | null>(null);

    constructor(private api: AuthApi, private router: Router) {
        // Initial load from local storage
        const token = this.getAccessToken();
        if (token) {
            this.decodeAndSetUser(token);
        }
    }

    login(credentials: LoginRequest) {
        return this.api.login(credentials).pipe(
            tap((response: AuthResponse) => {
                this.saveTokens(response);
                this.decodeAndSetUser(response.accessToken);
            })
        );
    }

    register(data: RegisterRequest) {
        return this.api.register(data);
    }

    logout() {
        this.api.logout().subscribe({
            next: () => this.clearSession(),
            error: () => this.clearSession() // Clear anyway
        });
    }

    purgeAuth() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token_expires_at');
        localStorage.removeItem('refresh_token_expires_at');
        this.currentUser.set(null);
    }

    private clearSession() {
        this.purgeAuth();
        this.router.navigate(['/login']);
    }

    saveTokens(response: AuthResponse) {
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);

        // Decode access token to get real expiration
        const payload = this.decodeToken(response.accessToken);
        const exp = payload?.exp ? payload.exp * 1000 : Date.now() + response.expiresIn;

        const now = Date.now();
        // Refresh token is opaque, rely on response.refreshExpiresIn relative time
        const refreshExpiresAt = now + response.refreshExpiresIn;

        localStorage.setItem('access_token_expires_at', exp.toString());
        localStorage.setItem('refresh_token_expires_at', refreshExpiresAt.toString());
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    getAccessTokenExpiration(): number | null {
        const exp = localStorage.getItem('access_token_expires_at');
        return exp ? parseInt(exp, 10) : null;
    }

    getRefreshTokenExpiration(): number | null {
        const exp = localStorage.getItem('refresh_token_expires_at');
        return exp ? parseInt(exp, 10) : null;
    }

    refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            this.clearSession();
            return new Observable(observer => {
                observer.error('No refresh token');
                observer.complete();
            });
        }

        return this.api.refreshToken({ refreshToken }).pipe(
            tap((response: AuthResponse) => {
                this.saveTokens(response);
                if (this.currentUser()) {
                    // Update roles/user info if needed, or just keep current
                    this.decodeAndSetUser(response.accessToken);
                }
            })
        );
    }

    // Add imports above if needed: import { Observable } from 'rxjs'; import { tap } from 'rxjs';

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const exp = this.getAccessTokenExpiration();
        const now = Date.now();

        // Check if token exists and is not expired
        return !!token && !!exp && exp > now;
    }

    canRefresh(): boolean {
        const refreshToken = this.getRefreshToken();
        const refreshExp = this.getRefreshTokenExpiration();
        const now = Date.now();
        return !!refreshToken && !!refreshExp && refreshExp > now;
    }

    hasAnyRole(requiredRoles: string[]): boolean {
        const user = this.currentUser();
        if (!user || !user.roles) return false;

        return user.roles.some(role => requiredRoles.includes(role));
    }

    private decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error('Failed to decode token', e);
            return null;
        }
    }

    private decodeAndSetUser(token: string) {
        const payload = this.decodeToken(token);
        if (!payload) {
            this.currentUser.set(null);
            return;
        }

        let roles: string[] = [];
        if (Array.isArray(payload.roles)) {
            roles = payload.roles.map((r: any) => {
                if (typeof r === 'string') return r;
                if (r && typeof r === 'object' && 'authority' in r) return r.authority;
                return String(r);
            });
        }

        const user: User = {
            username: payload.sub,
            roles: roles
        };

        this.currentUser.set(user);
    }
}

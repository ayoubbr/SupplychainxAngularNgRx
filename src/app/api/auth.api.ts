import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'ADMIN' | 'USER' | 'MANAGER';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}


@Injectable({ providedIn: 'root' })
export class AuthApi {

    private readonly authUrl = 'http://localhost:8080/api/auth';
    private readonly usersUrl = 'http://localhost:8080/api/users';

    constructor(private http: HttpClient) {
    }

    login(payload: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.authUrl}/login`, payload);
    }

    register(payload: RegisterRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.usersUrl}/register`, payload);
    }

    refreshToken(payload: RefreshTokenRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.authUrl}/refresh`, payload);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.authUrl}/logout`, {});
    }
}

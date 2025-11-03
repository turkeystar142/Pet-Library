import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { API_BASE_URL } from '../app.component';

export enum UserRole {
  User = 'user',
  Admin = 'admin'
}

export interface User {
  username: string;
  role: UserRole;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

interface VerifyResponse {
  valid: boolean;
  user?: User;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'pet_library_token';
  private readonly STORAGE_USER_KEY = 'pet_library_user';
  private readonly API_BASE_URL = (API_BASE_URL || 'https://pets.theproprietor.news/api').replace(/\/$/, ''); // Remove trailing slash
  private readonly LOGIN_URL = `${this.API_BASE_URL}/auth/login`;
  private readonly VERIFY_URL = `${this.API_BASE_URL}/auth/verify`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Verify token on service initialization if user exists
    if (this.getToken()) {
      this.verifyToken().subscribe();
    }
  }

  /**
   * Attempts to login with username and password
   * Returns Observable<boolean> - true if successful
   */
  login(username: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(this.LOGIN_URL, {
      username,
      password
    }).pipe(
      tap(response => {
        if (response.success && response.token) {
          // Store token and user info
          localStorage.setItem(this.STORAGE_KEY, response.token);
          localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      }),
      map(response => response.success),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifies the stored token with the backend
   */
  verifyToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return throwError(() => new Error('No token'));
    }

    return this.http.post<VerifyResponse>(this.VERIFY_URL, { token }).pipe(
      tap(response => {
        if (response.valid && response.user) {
          localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        } else {
          this.logout();
        }
      }),
      map(response => response.valid || false),
      catchError(error => {
        console.error('Token verification error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  /**
   * Gets the stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Logs out the current user
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Checks if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && this.getToken() !== null;
  }

  /**
   * Gets current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Checks if current user has admin role
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.Admin;
  }

  /**
   * Checks if current user has user role (read-only)
   */
  isUser(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === UserRole.User;
  }

  /**
   * Loads user from localStorage on service initialization
   */
  private loadUserFromStorage(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_USER_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        // Validate the user data
        if (user.username && user.role) {
          return user;
        }
      }
    } catch (e) {
      console.error('Error loading user from storage:', e);
    }
    return null;
  }
}

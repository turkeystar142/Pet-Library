import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // If we have a token in storage, verify it first
    const token = this.authService.getToken();
    if (token) {
      // Verify token with backend
      return this.authService.verifyToken().pipe(
        map(isValid => {
          if (isValid) {
            return true;
          }
          // Token invalid, redirect to login
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return false;
        }),
        catchError(() => {
          // Error verifying token, redirect to login
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url } 
          });
          return of(false);
        })
      );
    }

    // No token, check if user is authenticated (should be false)
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Not authenticated, redirect to login
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    return false;
  }
}

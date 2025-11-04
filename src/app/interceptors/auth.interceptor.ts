import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth service using injector to avoid circular dependency issues
    const authService = this.injector.get(AuthService);
    
    // Check if getToken method exists and call it safely
    let token: string | null = null;
    if (authService && typeof authService.getToken === 'function') {
      token = authService.getToken();
    }

    // If we have a token and the request is to our API, add it
    if (token && (req.url.includes('/api/') || req.url.includes('theproprietor.news'))) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    // Otherwise, just pass the request through
    return next.handle(req);
  }
}


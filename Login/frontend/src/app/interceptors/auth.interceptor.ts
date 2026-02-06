import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Global Authentication Interceptor.
 * intercepts outgoing HTTP requests to attach authorization credentials 
 * and handles centralized error responses.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  // Retrieve the bearer token from the authentication state
  const token = authService.getToken();

  // 1. Clone the outgoing request to inject security and content headers.
  // Defining 'Content-Type' is essential for the server to correctly parse the request body.
  let authReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // 2. Handle HTTP 401: Unauthorized (Expired or invalid token)
      if (error.status === 401) {
        if (!req.url.includes('/login')) {
          authService.logout();
          router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
          toast.show('Your session has expired', 'info');
        }
      }

      // 3. Handle HTTP 403 Forbidden errors (Authenticated but with insufficient privileges).
// Prevents access to restricted resources and notifies the user of the permission gap.
      if (error.status === 403) {
        toast.show('You do not have permission to perform this action', 'error');
      }

// 4. Handle HTTP Status 0: Connectivity Issue (CORS mismatch or Server unreachable).
      if (error.status === 0) {
        toast.show('Network error: The server is not responding', 'error');
      }

     // 5. Handle HTTP 500: Internal Server Error.
      if (error.status >= 500) {
        toast.show('Internal server error. Please try again later.', 'error');
      }
      
      return throwError(() => error);
    })
  );
};
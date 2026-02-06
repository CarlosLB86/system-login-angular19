import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Professional Authentication Guard.
 * Implements intelligent redirection to enhance User Experience (UX) 
 * by preserving the attempted navigation path.
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verify authentication status by accessing the service's reactive Signal.
  if (authService.isLoggedIn()) {
    
    // OPTIONAL: Role-Based Access Control (RBAC) verification.
// Validates specific role requirements defined within the route's metadata (e.g., data: { role: 'admin' }).
    const requiredRole = route.data['role'];
    if (requiredRole && authService.getUserRole() !== requiredRole) {
      console.error('Acceso denegado: Permisos insuficientes.');
      return router.parseUrl('/unauthorized'); // Redirect to an "Unauthorized" access page as a security fallback.
    }

    return true; 
  }

  // 2. If unauthenticated, preserve the attempted URL for post-login redirection.
  console.warn(`Intento de acceso no autorizado a: ${state.url}`);

  /**
   * Advanced Redirection: 
   * Captures the current navigation state as a query parameter.
   * Example: /login?returnUrl=/dashboard/settings
   * This ensures a seamless user flow after successful authentication.
   */
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
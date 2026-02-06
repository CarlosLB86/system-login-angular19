// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/**
 * Professional Route Configuration:
 * - Implements Lazy Loading to optimize initial bundle size and load time.
 * - Secures access through the AuthGuard for protected route enforcement.
 */
export const routes: Routes = [
 // Public Routes: Implemented with On-demand Loading to enhance initial performance.
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - Sistema 2026' 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Crear Cuenta - Sistema 2026'
  },
  { 
    path: 'recovery', 
    loadComponent: () => import('./components/auth/recovery/recovery.component').then(m => m.RecoveryComponent),
    title: 'Recuperar Acceso'
  },

// Protected Route: Restricted to authenticated users only (e.g., Dashboard).
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Panel de Control',
    // Route Metadata: Passing custom data (e.g., required roles) to the Route Guard.
    data: { role: 'user' } 
  },

// Route Fallbacks: Handles wildcards and automatic redirects for invalid URLs.
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
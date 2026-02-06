import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs'; // Añadido map
import { environment } from '../../environments/environments';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`; 
  private readonly TOKEN_KEY = 'token_proyecto';
  private readonly USER_KEY = 'user_data';

  // Private Signal for internal state management
  private _currentUser = signal<User | null>(null);
  
// Exposes the signal as read-only to prevent external mutations
  public currentUser = this._currentUser.asReadonly();
  public isLoggedIn = computed(() => !!this._currentUser());

  // Triggers state hydration on service instantiation to restore the user session.
  constructor() {
    this.hydrateSession();
  }

 /**
 * Returns the current user's role.
 * Facilitates Role-Based Access Control (RBAC) for route protection within Guards.
 */
  getUserRole(): string {
    const user = this._currentUser();
    return (user as any)?.role || 'user';
  }

  /**
 * Restores the user session from persistent storage.
 * Synchronizes LocalStorage data with the application state and handles 
 * potential parsing errors by forcing a logout for security.
 */
  private hydrateSession() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (token && savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        // Prevents app crashes from corrupted storage data
        this.logout();
      }
    }
  }

  /**
 * Executes the login flow and triggers the session storage side-effect upon success.
 */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => this.setSession(response)));
  }

  /**
 * Registers a new user and automatically initializes the session with the returned credentials.
 */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(tap(response => this.setSession(response)));
  }

  /**
 * Validates the current access token against the backend.
 * Maps the user identity response to a boolean to facilitate route protection in Guards.
 */
  
  checkAuthStatus(): Observable<boolean> {
    const token = this.getToken();
    if (!token) return of(false);

    return this.http.get<User>(`${this.apiUrl}/check-status`).pipe(
      tap(user => {
        this._currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      map(() => true), 
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }

  /**
 * Updates user profile information.
 * Performs a partial update and synchronizes the local state and storage with the server's response.
 */
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, userData).pipe(
      tap(updatedUser => {
        this._currentUser.set(updatedUser);
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      })
    );
  }

  /**
 * Permanently deletes the user account and clears the local session.
 */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      tap(() => this.logout()) 
    );
  }

/**
 * Persists authentication credentials and updates the global user state.
 */
  private setSession(auth: AuthResponse) {
    if (auth.token && auth.user) {
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
      this._currentUser.set(auth.user);
    }
  }

  /**
 * Clears all authentication metadata and resets the application state.
 */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
  }

  /**
 * Retrieves the stored access token for HTTP authorization.
 */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
// 1. Authentication credentials payload 
export interface LoginRequest {
  email: string;
  password: string;
}

// 2. User registration payload 
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string; 
}

// 3. Authenticated user data structure
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt?: Date; // Useful for displaying "Member since..." within the user profile.
}

// 4. Successful Authentication Response (Token and User profile).
// Defines the data structure returned by the backend after successful login or registration.
export interface AuthResponse {
  status: number;
  message: string;
  token: string;
  user: User; // Updated to required: a successful authentication must yield a valid user object.
}

// 5. Global Authentication State (Used for the service's reactive Signal).
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null; // Added to manage centralized authentication error handling across the application.
}

// 6. --- NEW: Backend Error Interface ---
// Standardizes API error responses (400, 401, 500) for consistent and graceful error handling.
export interface AuthErrorResponse {
  status: number;
  message: string;
  errors?: any; 
}
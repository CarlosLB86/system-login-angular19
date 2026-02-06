import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Añadido ActivatedRoute
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
  /**
 * LoginComponent
 * Manages user authentication, form validation, and secure access redirection.
 */
export class LoginComponent {
  // Using modern 'inject' pattern for clean and modular dependency management
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private toast = inject(ToastService);
/** * UI State Signals for fine-grained reactivity */
  public isLoading = signal(false); // Tracks authentication request progress
  public showPassword = signal(false);  // Controls password field visibility toggle
/**
   * Login Form Definition
   * Enforces strict validation rules for credentials.
   */
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
/** * Toggles the visibility of the password input field. */
  togglePassword() {
    this.showPassword.update(v => !v);
  }

/**
   * Handles the authentication submission.
   * On success, it redirects users to their intended destination or the default dashboard.
   */
  onSubmit() {
    // Early exit if the form does not meet validation criteria
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.show('Please, check the input data', 'info');
      return;
    }

    this.isLoading.set(true);
// Execute authentication stream
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.toast.show('¡Welcome again!', 'success');
        /** * Smart Redirection:
         * Checks for a 'returnUrl' in query parameters (e.g., from an AuthGuard) 
         * or defaults to the dashboard.
         */
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.isLoading.set(false);
        // Specialized error handling based on HTTP status codes
        const msg = err.status === 401 
          ? 'Email or password is incorrect.' 
          : 'Failed to connect to the server.';
        this.toast.show(msg, 'error');
      }
    });
  }
}
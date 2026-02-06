import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
 * RegisterComponent
 * Handles user account creation, form validation, and authentication service integration.
 */
export class RegisterComponent {
  // Service Injection using the modern 'inject' function for cleaner dependency management
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

/** * UI State Management using Angular Signals */
  public isLoading = signal(false);  // Manages the submission pending state
  public showPasswords = signal(false);  // Toggles password visibility in the UI

  /**
   * Registration Form Schema
   * Includes comprehensive validation and a custom cross-field validator for password matching.
   */
  public registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    // Custom validation logic to ensure data consistency between password fields
    validators: this.passwordMatchValidator
  });


  togglePasswords() {
    this.showPasswords.update(v => !v);
  }

/**
   * Custom validator to verify that the password and confirmPassword fields match.
   * Ensures data consistency before form submission.
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Executes the user registration process.
   * Validates form state, extracts sanitized data, and handles the authentication service lifecycle.
   */
  onRegister() {
    // Validate form integrity before processing
    if (this.registerForm.invalid) {
      this.toast.show('Por favor, revisa los errores del formulario', 'error');
      this.registerForm.markAllAsTouched();  // Visual feedback for invalid fields
      return;
    }
// Set UI to loading state to prevent redundant submissions
    this.isLoading.set(true);
    // Destructure sanitized values from the form using getRawValue to include disabled fields if necessary
    const { username, email, password } = this.registerForm.getRawValue();
    // Initiate asynchronous registration stream
    this.authService.register({ username, email, password }).subscribe({
      next: () => {
        this.toast.show(`¡Bienvenido ${username}! Cuenta creada correctamente`, 'success');
        this.router.navigate(['/dashboard']);  // Redirect to the main application view
      },
      error: (err) => {
        this.isLoading.set(false);  // Reset UI state on failure
        // Handle server-side errors with a fallback message
        this.toast.show(err.error?.message || 'Error al crear la cuenta', 'error');
      }
    });
  }
}
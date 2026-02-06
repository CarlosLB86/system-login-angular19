import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
  /**
 * DashboardComponent
 * Manages the user profile view and information updates.
 * Integrates global authentication state with local form management.
 */
export class DashboardComponent {
  // Dependency Injection using the 'inject' pattern for clean, testable code
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
/** * Global State Access
   * References the current user signal from AuthService for real-time UI updates.
   */
  public user = this.authService.currentUser;
  /** * UI View State */
  public isEditing = signal(false); // Toggles between read-only and edit modes
  public isLoading = signal(false); // Manages submission state during profile updates
/**
   * Profile Form Configuration
   * Initialized with current user data. Uses nonNullable to ensure type safety.
   */
  public profileForm = this.fb.nonNullable.group({
    username: [this.user()?.username || '', [Validators.required, Validators.minLength(3)]],
    email: [this.user()?.email || '', [Validators.required, Validators.email]]
  });

  /**
 * Synchronizes the profile form state reactively whenever 
 * the underlying user data signal undergoes a change.
 */
  constructor() {
    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.profileForm.patchValue({
          username: currentUser.username,
          email: currentUser.email
        });
      }
    });
  }

  public welcomeMessage = computed(() => {
    const username = this.user()?.username;
    return username ? `Welcome, ${username}! ✨` : 'Loading dashboard...';
  });

  /**
   * Toggles the profile edit mode.
   * Leverages Signal's update method to switch between read-only and editable states.
   */
  editProfile() {
    this.isEditing.update(v => !v);
  }

/**
   * Persists profile changes to the server.
   * Validates form state and user identity before executing the update request.
   */
  guardarCambios() {
    // Prevent execution if validation criteria are not met
    if (this.profileForm.invalid) return;
    // Ensure user context exists before attempting an update
    const userId = this.user()?.id;
    if (!userId) return;
// Initiate loading state to block concurrent updates and provide feedback
    this.isLoading.set(true);
    // Update remote data and handle the subscription lifecycle
    this.authService.updateUser(userId, this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading.set(false);  // Reset asynchronous state
        this.isEditing.set(false);  // Return to read-only view
        // Suggestion: Trigger a success notification here for better UX
      },
      error: (err) => {
        this.isLoading.set(false);
        // Error handling: Consider replacing alert with a non-blocking toast notification
        alert('Failed to update profile data');
      }
    });
  }

  /**
   * Permanently deletes the user account.
   * Requires explicit user confirmation and handles the full cleanup 
   * and redirection flow upon success.
   */
  eliminarCuenta() {
    // Ensure the operation target (user ID) is present
    const userId = this.user()?.id;
    if (!userId) return;
// Security checkpoint: Verify user intent for an irreversible operation
    if (confirm('Are you sure? This action is permanent and irreversible.')) {
      this.isLoading.set(true);
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.isLoading.set(false);
          // Post-deletion: Redirect to login view once the account is purged
          this.router.navigate(['/login']);
        },
        error: () => this.isLoading.set(false)  // Handle failure by resetting UI state
      });
    }
  }
/**
   * Terminates the current user session.
   * Clears authentication tokens and redirects the user to the entry point.
   */
  salir() {
    this.authService.logout();  // Invokes service-level session teardown
    this.router.navigate(['/login']); // Enforce navigation to the login page
  }
}
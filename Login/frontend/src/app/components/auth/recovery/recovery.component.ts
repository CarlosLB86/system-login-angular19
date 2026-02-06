import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css'] // Asegúrate de que apunte a tu CSS
})
  
/**
 * RecoveryComponent
 * * Handles the user password recovery flow. 
 * Manages form state, validation, and submission status using Angular Signals.
 */
export class RecoveryComponent {
// Injecting FormBuilder service for reactive form management
private fb = inject(FormBuilder);
/** * UI State Management 
 * Using Signals for optimized change detection and reactivity 
  */
  public isLoading = signal(false);
  public isSent = signal(false); 
/**
   * Recovery Form Configuration
   * Email field with built-in validation for required input and format integrity
   */
  public recoveryForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

 /**
   * Processes the password recovery request.
   * Validates form integrity before initiating the recovery workflow.
   * * @returns {void}
   */
  onRecover() {
    // Perform early exit if form requirements are not met
    if (this.recoveryForm.invalid) {
      // Trigger validation feedback across all form controls for UX clarity
      this.recoveryForm.markAllAsTouched();
      return;
    }
// Initialize loading state to provide visual feedback and prevent duplicate requests
    this.isLoading.set(true);

    /** * Mocking server latency with a 2-second delay to simulate 
     * real-world asynchronous processing.
     */
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSent.set(true);
    }, 2000);
  }
}
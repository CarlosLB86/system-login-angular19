import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * ToastComponent
 * A global notification system component that renders dynamic feedback messages.
 * Uses Angular Animations and Signals for a fluid, reactive user experience.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-[100] flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div [@slideIn] class="px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 min-w-[300px]"
          [ngClass]="{
            'bg-emerald-500/20 border-emerald-500/50 text-emerald-400': toast.type === 'success',
            'bg-red-500/20 border-red-500/50 text-red-400': toast.type === 'error',
            'bg-blue-500/20 border-blue-500/50 text-blue-400': toast.type === 'info'
          }">
          <span class="text-xl">
            {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}
          </span>
          <p class="font-medium">{{ toast.message }}</p>
        </div>
      }
    </div>
  `,
  animations: [
    /**
     * slideIn Animation
     * Defines the entry and exit transitions for toast notifications.
     * Uses hardware-accelerated transforms for smooth performance.
     */
    trigger('slideIn', [
      // Entry transition: Slides in from the right with opacity fade
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      // Exit transition: Slides back out to the right
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  // Injects the central ToastService to access the notification state signal
  public toastService = inject(ToastService);
}
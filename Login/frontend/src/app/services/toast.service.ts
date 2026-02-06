import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Uses a Signal to manage the collection of active UI messages.
// Provides a reactive data store for real-time notification tracking.
  public toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    this.toasts.update(t => [...t, { id, message, type }]);

   // Implements auto-dismissal logic to clear the message after 3 seconds.
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x.id !== id));
    }, 3000);
  }
}
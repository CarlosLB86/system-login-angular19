import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { ToastComponent } from './components/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ToastComponent],
  templateUrl: './app.component.html', 
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(5px)' }),
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Sistema 2026';

  prepareRoute(outlet: RouterOutlet) {
// Returns the route data state to trigger the associated transition animation.
    return outlet && outlet.isActivated ? outlet.activatedRoute : null;
  }
}
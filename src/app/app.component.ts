import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix';
}

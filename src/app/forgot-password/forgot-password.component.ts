import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private http: HttpClient) {}

  submitRequest() {
    this.http.post('http://127.0.0.1:8000/api/password-reset/', { email: this.email }).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error?.error || 'Fehler bei der Anfrage.';
        this.message = '';
      },
    });
  }

}

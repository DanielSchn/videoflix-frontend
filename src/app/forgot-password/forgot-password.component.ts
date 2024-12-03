import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConstantsService } from '../constants.service';

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

  constructor(private http: HttpClient, private constants: ConstantsService) {}

  submitRequest() {
    this.http.post(this.constants.API_BASE_URL + 'api/password-reset/', { email: this.email }).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.error = '';
      },
      error: (error) => {
        this.error = error.error?.error || 'Error in request.';
        this.message = '';
      },
    });
  }

}

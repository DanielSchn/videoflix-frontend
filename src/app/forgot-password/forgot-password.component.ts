import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  http = inject(HttpClient);
  toastr = inject(ToastService);
  router = inject(Router);
  authService = inject(AuthService);

  email: string = '';
  message: string = '';
  error: string = '';
  isEmailValid: boolean = false;

  constructor() { }


  checkEmailFormat(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }


  submitRequest(): void {
    this.checkEmailFormat();
    if (!this.isEmailValid) {
      this.error = 'Please provide a valid email address.';
      this.toastr.error(this.error);
      return;
    }

    this.authService.forgotPassword(this.email)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error in request.';
          this.message = '';
          this.toastr.error(this.error);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      });
  }

}

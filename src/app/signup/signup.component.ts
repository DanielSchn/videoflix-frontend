import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../shared/footer/footer.component';
import { environment } from '../../environments/environments';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FooterComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  http = inject(HttpClient);
  toastr = inject(ToastrService);
  router = inject(Router);
  authService = inject(AuthService);
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

  isPasswordMismatch: boolean = false;
  isButtonDisabled: boolean = true;
  passwordTooShort: boolean = false;
  passwordVisible: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  message: string = '';
  error: string = '';


  constructor() { }


  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.password.trim() &&
      !!this.confirmPassword.trim() &&
      this.password !== this.confirmPassword;

    this.updateButtonStatus();
  }


  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.password.trim() ||
      !this.confirmPassword.trim() ||
      this.isPasswordMismatch;
  }


  checkPasswordLength() {
    return this.password.length <= 7;
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


  signUp() {
    if (this.checkPasswordLength()) {
      this.passwordTooShort = true;
      return;
    } else {
      if (this.email && this.password) {
        this.authService.signUp(
          this.email,
          this.password,
          this.confirmPassword)
          .subscribe({
          next: (response: any) => {
            this.message = response.message;
            this.error = '';
            this.toastr.success(this.message, 'Success', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
          },
          error: (error) => {
            this.error = error.error?.error || 'Error creating account.';
            this.message = '';
            this.toastr.error(this.error, 'Error', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
          },
        });
      } else {
        this.error = 'Invalid link.';
        this.toastr.error(this.error, 'Error', {
          positionClass: this.toastPosition,
          timeOut: this.toastTimeout
        });
      }
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3500);
    }
  }
}

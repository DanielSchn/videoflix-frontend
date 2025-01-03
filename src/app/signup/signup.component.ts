import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';

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
  toastr = inject(ToastService);
  router = inject(Router);
  authService = inject(AuthService);

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


  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  signUp(): void {
    if (this.checkPasswordLength()) {
      this.passwordTooShort = true;
      return;
    }

    if (!this.email || !this.password) {
      this.error = 'Invalid link.';
      this.toastr.error(this.error);
      return;
    }

    this.authService.signUp(this.email, this.password, this.confirmPassword)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error creating account.';
          this.message = '';
          this.toastr.error(this.error);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3500);
        }
      });
  }
}

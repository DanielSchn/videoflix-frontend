import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { environment } from '../../environments/environments';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',

})
export class PasswordResetComponent {

  http = inject(HttpClient);
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private apiBaseUrl = environment.API_BASE_URL;
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = '';
  isPasswordMismatch: boolean = false;
  isButtonDisabled: boolean = true;
  passwordVisible: boolean = false;

  private uid: string | null = null;
  private token: string | null = null;

  constructor() { }

  ngOnInit() {
    this.uid = this.route.snapshot.queryParamMap.get('uid');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.newPassword.trim() &&
      !!this.confirmPassword.trim() &&
      this.newPassword !== this.confirmPassword;

    this.updateButtonStatus();
  }

  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.newPassword.trim() ||
      !this.confirmPassword.trim() ||
      this.isPasswordMismatch;
  }

  resetPassword() {
    if (this.uid && this.token) {
      this.http.post(this.apiBaseUrl + 'api/password-reset-confirm/', {
        uid: this.uid,
        token: this.token,
        new_password: this.newPassword,
      }).subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message, 'Success', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });
        },
        error: (error) => {
          this.error = error.error?.error || 'Error resetting password.';
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
      this.router.navigate(['/login']);
    }, 2000);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

}

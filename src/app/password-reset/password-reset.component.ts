import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';


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
  toastr = inject(ToastService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  authService = inject(AuthService);

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


  /**
  * Initializes the component by retrieving the UID and token from the URL query parameters.
  * 
  * This method uses the Angular `ActivatedRoute` service to get the `uid` and `token` values from the current route's query parameters. 
  * These values are typically used for actions like verifying a user's email address or resetting a password.
  * 
  * @returns void
  */
  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }


  /**
  * Checks if the new password and the confirmation password match.
  * 
  * This method compares the values of the `newPassword` and `confirmPassword` fields to ensure they are identical. 
  * If the passwords don't match or if either field is empty, the `isPasswordMismatch` flag is set to `true`.
  * Otherwise, it is set to `false`. 
  * It also calls `updateButtonStatus()` to determine if the submit button should be enabled or disabled based on the password match.
  * 
  * @returns void
  */
  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.newPassword.trim() &&
      !!this.confirmPassword.trim() &&
      this.newPassword !== this.confirmPassword;

    this.updateButtonStatus();
  }


  /**
  * Updates the status of the submit button based on the password and confirmation password validity.
  * 
  * This method checks the values of `newPassword` and `confirmPassword`. If either of these fields is empty or if the 
  * passwords do not match (as determined by the `isPasswordMismatch` flag), the submit button will be disabled by 
  * setting `isButtonDisabled` to `true`. Otherwise, the button will be enabled by setting `isButtonDisabled` to `false`.
  * 
  * @returns void
  */
  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.newPassword.trim() ||
      !this.confirmPassword.trim() ||
      this.isPasswordMismatch;
  }


  /**
  * Resets the user's password using the provided UID, token, and new password.
  * 
  * This method first checks if the `uid` and `token` values are present. If either is missing, it shows an error message 
  * and redirects the user to the login page. If both values are valid, it calls the `passwordReset` method from the 
  * `authService` to reset the password.
  * 
  * Upon a successful password reset, a success message is shown and the user is redirected to the login page. 
  * In case of an error, an appropriate error message is displayed to the user.
  * 
  * @returns void
  */
  resetPassword(): void {
    if (!this.uid || !this.token) {
      this.error = 'Invalid link.';
      this.toastr.error(this.error);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }

    this.authService.passwordReset(this.uid, this.token, this.newPassword)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error resetting password.';
          this.message = '';
          this.toastr.error(this.error);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
  }


  /**
  * Toggles the visibility of the password.
  * 
  * This method changes the `passwordVisible` boolean flag to either show or hide the password input. 
  * It is commonly used in password fields to switch between a masked and unmasked view of the password. 
  * When the password is visible, the input type is set to "text", and when it is hidden, the input type is set to "password".
  * 
  * @returns void
  */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}

import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';
import { Subscription } from 'rxjs';

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
  checkboxChecked: boolean = false;
  private subscription!: Subscription;




  constructor() { }


  /**
  * Checks if the password and confirm password fields match.
  * Updates the `isPasswordMismatch` property based on the comparison.
  * Also triggers a button status update by calling `updateButtonStatus`.
  */
  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.password.trim() &&
      !!this.confirmPassword.trim() &&
      this.password !== this.confirmPassword;

    this.updateButtonStatus();
  }


  /**
  * Updates the status of the button based on the validity of the password and confirm password fields.
  * The button will be disabled if:
  * - Either the password or confirm password is empty, or
  * - The passwords do not match.
  */
  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.password.trim() ||
      !this.confirmPassword.trim() ||
      this.isPasswordMismatch ||
      !this.checkboxChecked;
  }


  /**
  * Checks if the password length is less than or equal to 7 characters.
  * 
  * @returns A boolean value indicating whether the password length is less than or equal to 7.
  */
  checkPasswordLength(): boolean {
    return this.password.length <= 7;
  }


  /**
  * Toggles the visibility of the password.
  * Switches the `passwordVisible` property between `true` and `false` 
  * to show or hide the password.
  */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  /**
  * Handles the user sign-up process.
  * 
  * 1. Checks if the password meets the minimum length requirement.
  * 2. Validates the email and password fields.
  * 3. Calls the authentication service to sign up the user.
  * 4. Displays appropriate success or error messages using `toastr`.
  * 5. Redirects the user to the home page after a successful sign-up.
  */
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

    this.subscription = this.authService.signUp(this.email, this.password, this.confirmPassword)
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


  /**
  * Lifecycle hook that is called when the component is destroyed.
  * Cleans up any allocated resources, such as unsubscribing from observables,
  * to prevent memory leaks and ensure proper cleanup.
  */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

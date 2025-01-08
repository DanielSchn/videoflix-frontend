import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';
import { Subscription } from 'rxjs';

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
  private subscription!: Subscription;


  constructor() { }


  /**
  * Validates the format of the provided email address.
  * 
  * This method checks if the email address follows a standard email format using a regular expression pattern. 
  * If the email is valid, it sets the `isEmailValid` flag to `true`; otherwise, it sets it to `false`.
  * 
  * The regular expression used for validation ensures that the email contains:
  * - Alphanumeric characters or special characters (`._%+-`) before the "@" symbol.
  * - A domain name with valid characters (`.`, `-`, alphanumeric) after the "@" symbol.
  * - A valid top-level domain with at least two alphabetic characters.
  * 
  * @returns void
  */
  checkEmailFormat(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isEmailValid = emailPattern.test(this.email);
  }


  /**
  * Handles the submission of a password reset request.
  * 
  * This method first checks if the provided email address is valid by calling the `checkEmailFormat` method. 
  * If the email is not valid, it shows an error message to the user and prevents the request from being sent.
  * If the email is valid, the method calls the `forgotPassword` method from the `authService` to initiate the 
  * password reset process. 
  * 
  * On success, a success message is displayed, and on failure, an error message is shown. 
  * After completing the request, the user is redirected to the home page after a short delay.
  * 
  * @returns void
  */
  submitRequest(): void {
    this.checkEmailFormat();
    if (!this.isEmailValid) {
      this.error = 'Please provide a valid email address.';
      this.toastr.error(this.error);
      return;
    }

    this.subscription = this.authService.forgotPassword(this.email)
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

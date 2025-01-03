import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent {

  route = inject(ActivatedRoute);
  http = inject(HttpClient);
  router = inject(Router);
  toastr = inject(ToastService);
  authService = inject(AuthService);

  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string = '';
  message: string = '';

  constructor() { }


  /**
  * Initializes the component and handles email verification process.
  * 
  * This lifecycle method runs when the component is initialized. It retrieves the `uid` and `token` from the query parameters
  * in the URL. If either of these values is missing or invalid, it sets the verification status to `error` and navigates the user 
  * to the home page with an error message displayed. If both parameters are present, it triggers the email verification 
  * process by calling the `verifyEmail()` method from the authentication service.
  * 
  * - If the verification is successful, a success message is displayed.
  * - If the verification fails, an error message is shown.
  * 
  * The method also sets a timeout for redirecting the user back to the home page after a delay.
  * 
  * @returns void
  */
  ngOnInit(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!uid || !token) {
      this.verificationStatus = 'error';
      this.errorMessage = 'Invalid link.';
      this.toastr.error(this.errorMessage);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
      return;
    }

    this.authService.verifyEmail(uid, token)
      .subscribe({
        next: (response: any) => {
          this.verificationStatus = 'success';
          this.errorMessage = '';
          this.message = response.message;
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.verificationStatus = 'error';
          this.message = '';
          this.errorMessage = error.error?.error || 'Verification error!';
          this.toastr.error(this.errorMessage);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      });
  }
}

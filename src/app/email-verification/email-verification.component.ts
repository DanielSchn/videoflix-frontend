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

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environments';

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
  toastr = inject(ToastrService);
  private apiBaseUrl = environment.API_BASE_URL;
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;
  
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string = '';
  message: string = '';
  
  constructor() {}

  ngOnInit(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (uid && token) {
      this.http
        .post(this.apiBaseUrl + 'api/verify-email/', { uid, token })
        .subscribe({
          next: (response: any) => {
            this.verificationStatus = 'success';
            this.errorMessage = '';
            this.message = response.message;
            this.toastr.success(this.message, 'Success', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
          },
          error: (error) => {
            this.verificationStatus = 'error';
            this.message = '';
            this.errorMessage = error.error?.error || 'Verification error!';
            this.toastr.error(this.errorMessage, 'Error', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
          }
        });
    } else {
      this.verificationStatus = 'error';
      this.errorMessage = 'Invalid link.';
      this.toastr.error(this.errorMessage, 'Error', {
        positionClass: this.toastPosition,
        timeOut: this.toastTimeout
      });
    }
    setTimeout(() => {
      // this.router.navigate(['/']);
    }, 3500);
  }
}

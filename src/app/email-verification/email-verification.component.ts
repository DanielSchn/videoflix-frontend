import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ToastrService } from 'ngx-toastr';

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
  constants = inject(ConstantsService);
  toastr = inject(ToastrService);
  
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string = '';
  message: string = '';
  
  constructor() {}

  ngOnInit(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (uid && token) {
      this.http
        .post(this.constants.API_BASE_URL + 'api/verify-email/', { uid, token })
        .subscribe({
          next: (response: any) => {
            this.verificationStatus = 'success';
            this.errorMessage = '';
            this.message = response.message;
            this.toastr.success(this.message, 'Success', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
            });
          },
          error: (error) => {
            this.verificationStatus = 'error';
            this.message = '';
            this.errorMessage = error.error?.error || 'Verification error!';
            this.toastr.error(this.errorMessage, 'Error', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
            });
          }
        });
    } else {
      this.verificationStatus = 'error';
      this.errorMessage = 'Invalid link.';
      this.toastr.error(this.errorMessage, 'Error', {
        positionClass: this.constants.TOASTR_POSITION,
        timeOut: this.constants.TOASTR_TIMEOUT
      });
    }
    setTimeout(() => {
      // this.router.navigate(['/']);
    }, 3500);
  }
}

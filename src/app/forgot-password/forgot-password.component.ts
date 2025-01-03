import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { environment } from '../../environments/environments';
import { AuthService } from '../service/auth.service';

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
  toastr = inject(ToastrService);
  router = inject(Router);
  authService = inject(AuthService);
  private apiBaseUrl = environment.API_BASE_URL;
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

  email: string = '';
  message: string = '';
  error: string = '';

  constructor() { }

  submitRequest() {
    if (!this.email) {
      this.error = 'Please provide a valid email address.';
      this.toastr.error(this.error, 'Error', {
        positionClass: this.toastPosition,
        timeOut: this.toastTimeout
      });
      return;
    }

    this.authService.forgotPassword(this.email)
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
          this.error = error.error?.error || 'Error in request.';
          this.message = '';
          this.toastr.error(this.error, 'Error', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      });
    
  }

}

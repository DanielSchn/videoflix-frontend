import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../shared/footer/footer.component';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  http = inject(HttpClient);
  toastr = inject(ToastrService);
  router = inject(Router);
  private apiBaseUrl = environment.API_BASE_URL;
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  message: string = '';
  error: string = '';
  rememberMe: boolean = false;

  constructor() { }

  login() {
    if (this.email && this.password) {
      this.http.post(this.apiBaseUrl + 'api/login/', {
        username: this.email,
        password: this.password,
      }).subscribe({
        next: (response: any) => {
          const token = response.token;
          if (!token) {
            this.toastr.error('No token received.', 'Error', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
            return;
          }
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message, 'Success', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });

          if (this.rememberMe) {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }
          setTimeout(() => {
            this.router.navigate(['/video-list']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error during log in. Check login data and try again.';
          this.message = '';
          this.toastr.error(this.error, 'Error', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });
        },
      });
    } else {
      this.error = 'Invalid log in.';
      this.toastr.error(this.error, 'Error', {
        positionClass: this.toastPosition,
        timeOut: this.toastTimeout
      });
    }
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}

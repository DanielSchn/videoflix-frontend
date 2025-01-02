import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../shared/footer/footer.component';
import { environment } from '../../environments/environments';
import { VideoService } from '../service/video.service';
import { AuthService } from '../service/auth.service';

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
  videoService = inject(VideoService);
  authService = inject(AuthService);
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  message: string = '';
  error: string = '';
  rememberMe: boolean = false;

  constructor() { }

  
  login(): void {
    if (this.email && this.password) {
      this.authService.login(
        this.email,
        this.password)
      .subscribe({
        next: (response) => {
          const token = response.token;
          if (!token) {
            this.toastr.error('No token received.', 'Error', {
              positionClass: this.toastPosition,
              timeOut: this.toastTimeout
            });
            return;
          }
          if (this.rememberMe) {
            localStorage.setItem('token', token);
          } else {
            sessionStorage.setItem('token', token);
          }
          this.loadVideos();
          this.message = response.message;
          this.error = '';
          this.toastr.success(this.message, 'Success', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });
          setTimeout(() => {
            this.router.navigate(['/video-list']);
          }, 2000);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error during login. Check login data and try again.';
          this.message = '';
          this.toastr.error(this.error, 'Error', {
            positionClass: this.toastPosition,
            timeOut: this.toastTimeout
          });
        }
      });
    } else {
      this.error = 'Invalid login.';
      this.toastr.error(this.error, 'Error', {
        positionClass: this.toastPosition,
        timeOut: this.toastTimeout
      });
    }
  }


  private loadVideos(): void {
    this.videoService.fetchList().subscribe(() => {
      console.log('Videos loaded!');
    });
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}

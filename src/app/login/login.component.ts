import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../shared/footer/footer.component';
import { VideoService } from '../service/video.service';
import { AuthService } from '../service/auth.service';
import { ToastService } from '../service/toast.service';

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
  toastr = inject(ToastService);
  router = inject(Router);
  videoService = inject(VideoService);
  authService = inject(AuthService);

  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  message: string = '';
  error: string = '';
  rememberMe: boolean = false;

  constructor() { }


  login(): void {
    if (!this.email || !this.password) {
      this.error = 'Invalid login.';
      this.toastr.error(this.error);
      return;
    }

    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          const token = response.token;
          if (!token) {
            this.toastr.error('No token received.');
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
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.error = error.error?.error || 'Error during login. Check login data and try again.';
          this.message = '';
          this.toastr.error(this.error);
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate(['/video-list']);
          }, 2000);
        }
      });
  }


  private loadVideos(): void {
    this.videoService.fetchList().subscribe(() => {
      console.log('Videos loaded!');
    });
  }


  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}

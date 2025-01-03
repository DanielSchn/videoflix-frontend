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


  /**
  * Handles user login, validates the credentials, and manages the session/token storage.
  * 
  * This method checks if the email and password are provided. If either is missing, it displays an error message 
  * and prevents further action. It then calls the `login` method from the `authService` to authenticate the user. 
  * If the login is successful, the method stores the received token in either `localStorage` or `sessionStorage` 
  * based on the `rememberMe` flag. It also loads the user's videos and displays a success message.
  * If the login fails, an error message is shown to the user.
  * 
  * After completing the login process, the user is redirected to the `/video-list` page.
  * 
  * @returns void
  */
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


  /**
  * Loads the list of videos by fetching data from the video service.
  * 
  * This method calls the `fetchList` method of the `videoService` to retrieve the video data. Once the data is successfully 
  * fetched, a message indicating that the videos have been loaded is logged to the console.
  * This method does not return any value.
  * 
  * @returns void
  */
  private loadVideos(): void {
    this.videoService.fetchList().subscribe(() => {
      console.log('Videos loaded!');
    });
  }


  /**
  * Toggles the visibility of the password.
  * 
  * This method changes the `passwordVisible` boolean flag to either show or hide the password input. 
  * It is commonly used in password fields to switch between a masked and unmasked view of the password. 
  * When the password is visible, the input type is set to "text", and when it is hidden, the input type is set to "password".
  * 
  * @returns void
  */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}

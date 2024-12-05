import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConstantsService } from '../constants.service';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../shared/footer/footer.component';

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

  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  message: string = '';
  error: string = '';
  rememberMe: boolean = false;

  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
    private toastr: ToastrService,
    private router: Router
  ){}

  login() {
      if (this.email && this.password) {
        this.http.post(this.constants.API_BASE_URL + 'api/login/', {
          username: this.email,
          password: this.password,
        }).subscribe({
          next: (response: any) => {
            const token = response.token;
            if (!token) {
              this.toastr.error('No token received.', 'Error', {
                positionClass: this.constants.TOASTR_POSITION,
                timeOut: this.constants.TOASTR_TIMEOUT
              });
              return;
            }
            this.message = response.message;
            this.error = '';
            this.toastr.success(this.message, 'Success', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
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
            this.error = error.error?.error || 'Error during log in.';
            this.message = '';
            this.toastr.error(this.error, 'Error', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
            });
          },
        });
      } else {
        this.error = 'Invalid log in.';
        this.toastr.error(this.error, 'Error', {
          positionClass: this.constants.TOASTR_POSITION,
          timeOut: this.constants.TOASTR_TIMEOUT
        });
      }    
  }


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}

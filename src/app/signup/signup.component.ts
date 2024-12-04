import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConstantsService } from '../constants.service';
import { ToastrService } from 'ngx-toastr';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    FooterComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  isPasswordMismatch: boolean = false;
  isButtonDisabled: boolean = true;
  passwordTooShort: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  message: string = '';
  error: string = '';
  
  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
    private toastr: ToastrService,
    private router: Router
  ){}




  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.password.trim() &&
      !!this.confirmPassword.trim() &&
      this.password !== this.confirmPassword;
  
    this.updateButtonStatus();
  }

  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.password.trim() || 
      !this.confirmPassword.trim() || 
      this.isPasswordMismatch;
  }

  checkPasswordLength() {
     return this.password.length <= 7;
  }

  signUp() {
    if (this.checkPasswordLength()) {
      this.passwordTooShort = true;
      return;
    } else {
      if (this.email && this.password) {
        this.http.post(this.constants.API_BASE_URL + 'api/registration/', {
          email: this.email,
          password: this.password,
          confirm_password: this.confirmPassword,
        }).subscribe({
          next: (response: any) => {
            this.message = response.message;
            this.error = '';
            this.toastr.success(this.message, 'Success', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
            });
          },
          error: (error) => {
            this.error = error.error?.error || 'Error creating account.';
            this.message = '';
            this.toastr.error(this.error, 'Error', {
              positionClass: this.constants.TOASTR_POSITION,
              timeOut: this.constants.TOASTR_TIMEOUT
            });
          },
        });
      } else {
        this.error = 'Invalid link.';
        this.toastr.error(this.error, 'Error', {
          positionClass: this.constants.TOASTR_POSITION,
          timeOut: this.constants.TOASTR_TIMEOUT
        });
      }
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3500);
    }
  }
  
}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';


@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
  
})
export class PasswordResetComponent {

  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = '';
  isPasswordMismatch: boolean = false;
  isButtonDisabled: boolean = true;

  private uid: string | null = null;
  private token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private constants: ConstantsService,
    private toastr: ToastrService,
    private router: Router
  ){}

  ngOnInit() {
    this.uid = this.route.snapshot.queryParamMap.get('uid');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  checkPasswordMatch(): void {
    this.isPasswordMismatch =
      !!this.newPassword.trim() &&
      !!this.confirmPassword.trim() &&
      this.newPassword !== this.confirmPassword;
  
    this.updateButtonStatus();
  }
  
  updateButtonStatus(): void {
    this.isButtonDisabled =
      !this.newPassword.trim() || 
      !this.confirmPassword.trim() || 
      this.isPasswordMismatch;
  }

  resetPassword() {
    if (this.uid && this.token) {
      this.http.post(this.constants.API_BASE_URL + 'api/password-reset-confirm/', {
        uid: this.uid,
        token: this.token,
        new_password: this.newPassword,
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
          this.error = error.error?.error || 'Error resetting password.';
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
      this.router.navigate(['/login']);
    }, 2000);
  }

}

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConstantsService } from '../constants.service';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private http: HttpClient,
    private constants: ConstantsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  submitRequest() {
    this.http.post(this.constants.API_BASE_URL + 'api/password-reset/', { email: this.email }).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.error = '';
        this.toastr.success(this.message, 'Success', {
          positionClass: this.constants.TOASTR_POSITION,
          timeOut: this.constants.TOASTR_TIMEOUT
        });
      },
      error: (error) => {
        this.error = error.error?.error || 'Error in request.';
        this.message = '';
        this.toastr.error(this.error, 'Error', {
          positionClass: this.constants.TOASTR_POSITION,
          timeOut: this.constants.TOASTR_TIMEOUT
        });
      },
    });
    setTimeout(() => {
      // this.router.navigate(['/']);
    }, 4000);
  }

}

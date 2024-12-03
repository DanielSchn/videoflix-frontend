import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConstantsService } from '../constants.service';

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
  verificationStatus: 'loading' | 'success' | 'error' = 'loading';
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private constants: ConstantsService) {}

  ngOnInit(): void {
    const uid = this.route.snapshot.queryParamMap.get('uid');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (uid && token) {
      this.http
        .post(this.constants.API_BASE_URL + 'api/verify-email/', { uid, token })
        .subscribe({
          next: (response: any) => {
            this.verificationStatus = 'success';
            setTimeout(() => {
              //this.router.navigate(['/']);
            }, 3000);
          },
          error: (error) => {
            this.verificationStatus = 'error';
            this.errorMessage = error.error?.error || 'Fehler bei der Verifizierung!';
          }
        });
    } else {
      this.verificationStatus = 'error';
      this.errorMessage = 'Ungültiger Link.';
    }
  }
}

import { Routes } from '@angular/router';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    { path: 'verify-email', component: EmailVerificationComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'login', component: LoginComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'sign-up', component: SignupComponent },
];

import { Routes } from '@angular/router';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupComponent } from './signup/signup.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { VideoListComponent } from './video-list/video-list.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { authGuard } from './service/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingpageComponent },
    { path: 'verify-email', component: EmailVerificationComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'login', component: LoginComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'sign-up', component: SignupComponent },
    { path: 'legal', component: ImpressumComponent },
    { path: 'privacy', component: DatenschutzComponent },
    { path: 'video-list', component: VideoListComponent, canActivate: [authGuard] },
    { path: 'video-player', component: VideoplayerComponent }
];

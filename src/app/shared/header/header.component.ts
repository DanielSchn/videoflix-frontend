import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  router = inject(Router);

  loginPage: boolean = false;
  url: string | null = '';
  videoListSite: boolean = false;
  signupSite: boolean = false;
  landingSite: boolean = false;
  videoPlayer: boolean = false;
  loggedIn: boolean = false;

  constructor(){}

  ngOnInit() {
    this.url = this.router.url;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      this.loggedIn = true;
      this.router.navigate(['/video-list']);
    } else {
      this.loggedIn = false;
    }
  
    this.loginPage = this.videoListSite = this.signupSite = this.landingSite = false;
  
    if (this.url.includes('login')) {
      this.loginPage = true;
    } else if (this.url.includes('landing')) {
      this.landingSite = true;
    } else if (this.url.includes('video-list')) {
      this.videoListSite = true;
    } else if (this.url.includes('sign-up')) {
      this.signupSite = true;
    } else if (this.url.includes('video-player')) {
      this.videoPlayer = true;
    }

    console.log('LOGIN', this.loginPage);
    console.log('video', this.videoListSite);
    console.log('signup', this.signupSite);
    console.log('landing', this.landingSite);
    console.log('loggedIn', this.loggedIn);
  }


  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/']);  
    }, 500);
  }
}

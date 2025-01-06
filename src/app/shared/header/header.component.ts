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


  /**
  * Lifecycle hook that initializes the component.
  * 
  * - Checks if the user is logged in by looking for a token in `localStorage` or `sessionStorage`.
  * - Sets the `loggedIn` status and redirects the user to the video list page if logged in.
  * - Determines which page is currently active based on the current URL and sets corresponding flags.
  */
  ngOnInit(): void {
    this.url = this.router.url;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token && this.router.url != '/video-player') {
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


  /**
  * Logs the user out by removing the authentication token from localStorage and sessionStorage.
  * After a brief delay, redirects the user to the home page.
  */
  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/']);  
    }, 1000);
  }
}

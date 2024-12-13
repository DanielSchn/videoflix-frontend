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

  constructor(){}

  ngOnInit() {
    this.url = this.router.url;
    if (this.url.includes('login') || this.url.includes('landing')) {
      this.loginPage = true;
      this.videoListSite = false;
    } else {
      if (this.url.includes('video-list')) {
        this.videoListSite = true;
      } 
      this.loginPage = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/']);  
    }, 500);
  }
}

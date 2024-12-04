import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  loginPage: boolean = false;
  url: string | null = '';

  constructor(private router: Router){}

  ngOnInit() {
    this.url = this.router.url;
    if (this.url.includes('login') || this.url.includes('landing')) {
      this.loginPage = true;
    } else {
      this.loginPage = false;
    }
  }
}

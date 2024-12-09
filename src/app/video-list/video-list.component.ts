import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PreviewBannerComponent } from './preview-banner/preview-banner.component';
import { VideoSlideshowComponent } from './video-slideshow/video-slideshow.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    PreviewBannerComponent,
    VideoSlideshowComponent,
    FooterComponent
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent {

  constructor(private router: Router) {
    
  }


  logout() {
    localStorage.removeItem('token');
    setTimeout(() => {
      this.router.navigate(['/']);  
    }, 500);
  }
}

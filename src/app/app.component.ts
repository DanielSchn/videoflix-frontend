import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { VideoService } from './service/video.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix';
  videoService = inject(VideoService);
  router = inject(Router);

  constructor() {
    this.loadVideos();
  }


  /**
  * Loads the list of videos from the server if a valid token is found in localStorage or sessionStorage.
  * After successfully loading the videos, navigates to the '/video-list' route.
  */
  private loadVideos(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      this.videoService.fetchList().subscribe(() => {
        console.log('Videos loaded!');
      });
      this.router.navigate(['/video-list']);
    }

  }
}

import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { VideoService } from './video.service';

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

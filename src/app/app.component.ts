import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  constructor() {
    this.loadVideos();
  }

  private loadVideos(): void {
    this.videoService.fetchList().subscribe(() => {
      console.log('Videos loaded!');
    });
  }
}

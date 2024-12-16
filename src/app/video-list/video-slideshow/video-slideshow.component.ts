import { Component, inject } from '@angular/core';
import { VideoService } from '../../video.service';
import { ConstantsService } from '../../constants.service';
import { CommonModule } from '@angular/common';
import { Videolist } from '../../interfaces/videolist.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-slideshow',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './video-slideshow.component.html',
  styleUrl: './video-slideshow.component.scss'
})
export class VideoSlideshowComponent {

  videoService = inject(VideoService);
  constants = inject(ConstantsService);
  router = inject(Router)
  
  list: Videolist[] = [];
  apiBaseUrl: string = this.constants.API_BASE_URL;
  

  constructor() {}

  ngOnInit(): void {
    this.videoService.getList().subscribe((data) => {
      this.list = data;
    });
    setTimeout(() => {
      console.log(this.list);
      }, 3000);
  }


  playVideo(source: string): void {
    this.videoService.setVideoSource(source); // Videoquelle im Service speichern
    this.router.navigate(['/video-player']); // Zur Videoplayer-Komponente navigieren
  }


}

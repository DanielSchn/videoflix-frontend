import { Component, inject } from '@angular/core';
import { VideoService } from '../../service/video.service';
import { CommonModule } from '@angular/common';
import { Videolist } from '../../interfaces/videolist.interface';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';


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
  router = inject(Router);
  apiMediaUrl = environment.API_MEDIA_URL;
  categories = environment.CATEGORIES;

  list: Videolist[] = [];

  constructor() { }


  /**
  * Lifecycle hook that initializes the component.
  * Fetches the list of videos from the video service and stores it in a local variable.
  * Logs the list to the console after a delay.
  */
  ngOnInit(): void {
    this.videoService.getList().subscribe((data) => {
      this.list = data;
    });
    setTimeout(() => {
      console.log(this.list);
    }, 3000);
  }


  /**
  * Plays a selected video by setting the video source and navigating to the video player page.
  * 
  * @param source The selected video source object from the video list.
  */
  playVideo(source: Videolist): void {
    this.videoService.setVideoSource(source);
    this.router.navigate(['/video-player']);
  }
}

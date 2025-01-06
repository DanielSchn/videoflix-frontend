import { Component, inject, Input } from '@angular/core';
import { VideoService } from '../../service/video.service';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { Videolist } from '../../interfaces/videolist.interface';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-preview-banner',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './preview-banner.component.html',
  styleUrl: './preview-banner.component.scss'
})
export class PreviewBannerComponent {

  videoService = inject(VideoService);
  apiMediaUrl = environment.API_MEDIA_URL;

  list: Videolist[] = [];
  randomNumber: number = Math.floor(Math.random() * 7) + 1;

  constructor() {}


  /**
  * Lifecycle hook that initializes the component.
  * Fetches the list of videos from the video service and assigns it to a local property.
  * Logs the list to the console after a delay of 3 seconds (for debugging purposes).
  */
  ngOnInit(): void {
    this.videoService.getList().subscribe((data) => {
      this.list = data;
    });
    setTimeout(() => {
      console.log(this.list);
    }, 3000);
  }
}

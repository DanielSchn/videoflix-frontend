import { Component, inject, Input } from '@angular/core';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../video.service';
// import {SingleMediaPlayer} from './single-media-player';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {
  router = inject(Router);
  videoService = inject(VideoService);

  videoSource: string = '';

  ngOnInit(): void {
    this.videoSource = this.videoService.getVideoSource();
  }
}

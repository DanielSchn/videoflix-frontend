import { Component, inject, Input } from '@angular/core';
import { VideoService } from '../../video.service';
import { ConstantsService } from '../../constants.service';
import { CommonModule } from '@angular/common';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import { Videolist } from '../../interfaces/videolist.interface';

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
  constants = inject(ConstantsService);
  
  list: Videolist[] = [];
  apiBaseUrl: string = this.constants.API_BASE_URL;
  mediaBaseUrl: string = this.constants.API_MEDIA_URL;
  randomNumber: number = Math.floor(Math.random() * 7) + 1;
  

  constructor() {}

  ngOnInit(): void {
    this.videoService.getList().subscribe((data) => {
      this.list = data;
    });
    setTimeout(() => {
      console.log(this.list);
    }, 3000);
  }

  // loadData() {
  //   this.VideoService.fetchList().subscribe((data) => {
  //     this.list = data;
  //   });
  // }
}

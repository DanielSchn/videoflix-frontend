import { Component, Input } from '@angular/core';
import { VideoService } from '../../video.service';
import { ConstantsService } from '../../constants.service';
import { CommonModule } from '@angular/common';
import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

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

  list: any[] = [];
  apiBaseUrl: string = '';

  constructor(
    private VideoService: VideoService,
    private constants: ConstantsService
  ) {
    this.loadData();
    this.apiBaseUrl = this.constants.API_BASE_URL;
    setTimeout(() => {
      console.log(this.list);
      
    }, 1000);
  }

  loadData() {
    this.VideoService.fetchList().subscribe((data) => {
      this.list = data;
    });
  }
}

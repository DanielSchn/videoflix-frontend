import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PreviewBannerComponent } from './preview-banner/preview-banner.component';
import { VideoSlideshowComponent } from './video-slideshow/video-slideshow.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';
import { VideoService } from '../service/video.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    PreviewBannerComponent,
    VideoSlideshowComponent,
    FooterComponent,
    HeaderComponent,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss'
})
export class VideoListComponent {

  router = inject(Router);
  videoService = inject(VideoService);

  list$: Observable<any[]> = this.videoService.fetchList();

  constructor() {}

}

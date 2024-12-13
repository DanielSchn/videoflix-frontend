import { Component, inject } from '@angular/core';
import { VideoService } from '../../video.service';
import { ConstantsService } from '../../constants.service';
import { CommonModule } from '@angular/common';
import { Videolist } from '../../interfaces/videolist.interface';

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


}

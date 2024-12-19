import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import videojs from 'video.js';
import { Router } from '@angular/router';
import { VideoService } from '../video.service';
import { Videolist } from '../interfaces/videolist.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environments';

// import {SingleMediaPlayer} from './single-media-player';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    CommonModule
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {
  router = inject(Router);
  videoService = inject(VideoService);
  private apiMediaUrl = environment.API_BASE_URL;

  @ViewChild('videoPlayer', { static: true }) videoPlayer!: ElementRef;
  player: any;

  videoSource: Videolist = {
    id: 0,
    title: '',
    description: '',
    thumbnail: '',
    video_480p: '',
    video_720p: '',
    video_1080p: '',
    category: ''
  };

  qualityOptions: { label: string; src: string }[] = [];
  selectedQuality: string = '720p';


  ngAfterViewInit(): void {
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto'
    });
    this.loadQuality(this.selectedQuality);
  }


  loadQuality(label: string): void {
    const source = this.qualityOptions.find((option) => option.label === label);
    if (source) {
      this.player.src({ src: source.src, type: 'video/mp4' });
      this.player.play();
    }
  }


  onQualityChange(event: any): void {
    this.selectedQuality = event.target.value;
    this.loadQuality(this.selectedQuality);
  }


  ngOnInit(): void {
    this.videoSource = this.videoService.getVideoSource();
    console.log('SOURCE', this.videoSource);
    console.log('480p', this.videoSource.video_480p);
    this.qualityOptions = [
      { label: '480p', src: this.apiMediaUrl + this.videoSource.video_480p },
      { label: '720p', src: this.apiMediaUrl + this.videoSource.video_720p },
      { label: '1080p', src: this.apiMediaUrl + this.videoSource.video_1080p }
    ].filter(option => option.src);
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}

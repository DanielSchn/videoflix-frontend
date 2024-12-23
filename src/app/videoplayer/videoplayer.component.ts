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
import { HeaderComponent } from '../shared/header/header.component';


@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {
  router = inject(Router);
  videoService = inject(VideoService);
  private apiMediaUrl = environment.API_MEDIA_URL;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;
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
  videoContent: { title?: string, description?: string, video_file?: string, thumbnail?: string, created_at?: string } = {};
  selectedQuality: string = '720p';
  videoSrc: string = '';
  currentTimeBeforeQualityChange: number = 0;


  ngAfterViewInit(): void {
    this.player = videojs(this.videoPlayer.nativeElement, {
      controls: true,
      autoplay: false,
      preload: 'auto'
    });

    const savedVideoData = this.getSavedVideoData();
    if (savedVideoData && savedVideoData.videoName === this.videoSource.title) {
      this.player.currentTime(savedVideoData.time);
    }

    this.player.on('timeupdate', () => {
      const currentTime = this.player.currentTime();
      this.saveVideoProgress(this.videoSource.title, currentTime);
    });

    this.loadQuality(this.selectedQuality);
  }


  loadQuality(label: string): void {
    const source = this.qualityOptions.find((option) => option.label === label);
    if (source) {
      this.selectedQuality = label;
      this.player.src({ src: source.src, type: 'video/mp4' });
      this.player.one('loadeddata', () => {
        this.player.currentTime(this.currentTimeBeforeQualityChange);
        this.player.play();
      });
    }
  }


  onQualityChange(event: any): void {
    this.currentTimeBeforeQualityChange = this.player.currentTime();
    this.loadQuality(event.target.value);
  }


  ngOnInit(): void {
    this.videoSource = this.videoService.getVideoSource();
    this.qualityOptions = [
      { label: '480p', src: this.apiMediaUrl + this.videoSource.video_480p },
      { label: '720p', src: this.apiMediaUrl + this.videoSource.video_720p },
      { label: '1080p', src: this.apiMediaUrl + this.videoSource.video_1080p }
    ].filter(option => option.src);
  }


  saveVideoProgress(videoName: string, time: number): void {
    const videoData = { videoName, time };
    localStorage.setItem('videoProgress', JSON.stringify(videoData));
  }


  getSavedVideoData(): { videoName: string; time: number } | null {
    const savedData = localStorage.getItem('videoProgress');
    return savedData ? JSON.parse(savedData) : null;
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}

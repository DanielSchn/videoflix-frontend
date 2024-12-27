import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
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
  apiMediaUrl = environment.API_MEDIA_URL;

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
  screenWidth: number = 0;

  constructor() {
    this.screenWidth = window.innerWidth;
  }


  ngAfterViewInit(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.updateVideoSource(this.selectedQuality);

      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.loadVideoProgress();
      });

      this.videoPlayer.nativeElement.addEventListener('pause', () => {
        this.saveVideoProgress();
      });

      this.videoPlayer.nativeElement.addEventListener('ended', () => {
        this.saveVideoProgress();
      });

      window.addEventListener('beforeunload', () => {
        this.saveVideoProgress();
      });

      setTimeout(() => {
        this.videoPlayer.nativeElement.addEventListener('timeupdate', () => {
          this.saveVideoProgress();
        });
      }, 1500);

    }
  }


  onQualityChange(event: any): void {
    this.currentTimeBeforeQualityChange = this.getCurrentTime();
    this.selectedQuality = event.target.value;
    this.updateVideoSource(this.selectedQuality);
  }


  updateVideoSource(quality: string): void {
    const selectedOption = this.qualityOptions.find(option => option.label === quality);
    if (selectedOption) {
      this.videoSrc = selectedOption.src;
      if (this.videoPlayer && this.videoPlayer.nativeElement) {
        this.videoPlayer.nativeElement.src = this.videoSrc;
        this.videoPlayer.nativeElement.load();
      }
    }
  }


  ngOnInit(): void {
    this.videoSource = this.videoService.getVideoSource();
    this.qualityOptions = [
      { label: '480p', src: this.apiMediaUrl + this.videoSource.video_480p },
      { label: '720p', src: this.apiMediaUrl + this.videoSource.video_720p },
      { label: '1080p', src: this.apiMediaUrl + this.videoSource.video_1080p }
    ].filter(option => option.src);
    this.selectVideoQualityByScreenWidth();
    this.updateVideoSource(this.selectedQuality);
    this.updateScreenWidth();
    this.loadVideoProgress();
  }


  selectVideoQualityByScreenWidth(): void {
    if (this.screenWidth < 720) {
      this.selectedQuality = '480p';
    } else if (this.screenWidth < 1080) {
      this.selectedQuality = '720p';
    } else {
      this.selectedQuality = '1080p';
    }
  }


  saveVideoProgress(): void {
    // if (this.videoPlayer && this.videoPlayer.nativeElement) {
    //   const currentTime = this.videoPlayer.nativeElement.currentTime;
    //   const savedData = { videoName: this.videoSource.title, time: currentTime };
    //   localStorage.setItem(this.videoSource.title, JSON.stringify(savedData));
    // }
    const currentTime = this.videoPlayer.nativeElement.currentTime;
    this.videoService.setVideoProgress(currentTime).subscribe({
      next: () => console.log('Progress saved.'),
      error: (err) => console.error('Error saving progress:', err),
    });
  }


  loadVideoProgress(): void {
    // const savedData = localStorage.getItem(this.videoSource.title);
    // if (savedData) {
    //   const videoData = JSON.parse(savedData);
    //   console.log('videoData',videoData.videoName);
      
    //   if (videoData.videoName === this.videoSource.title) {
    //     this.currentTimeBeforeQualityChange = videoData.time;
    //     if (this.videoPlayer && this.videoPlayer.nativeElement) {
    //       this.videoPlayer.nativeElement.currentTime = this.currentTimeBeforeQualityChange;
    //     }
    //   }
    // }
    this.videoService.loadVideoProgress().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const savedProgress = data[0].current_time;
          this.videoPlayer.nativeElement.currentTime = savedProgress;
          console.log('Progress loaded:', savedProgress);
        }
      },
      error: (err) => console.error('Error loading progress:', err),
    });
  }


  getCurrentTime(): number {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      return this.videoPlayer.nativeElement.currentTime;
    }
    return 0;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenWidth();
  }


  private updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
    console.log('Aktuelle Bildschirmbreite:', this.screenWidth);
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
import { Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { Router } from '@angular/router';
import { VideoService } from '../service/video.service';
import { Videolist } from '../interfaces/videolist.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environments';
import { HeaderComponent } from '../shared/header/header.component';
import { ToastrService } from 'ngx-toastr';


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
  toastr = inject(ToastrService);
  apiMediaUrl = environment.API_MEDIA_URL;
  private toastPosition = environment.TOASTR_POSITION;
  private toastTimeout = environment.TOASTR_TIMEOUT;

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
        this.getVideoProgress();
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
    this.toastr.success(event.target.value, 'Change Quality to:', {
      positionClass: this.toastPosition,
      timeOut: this.toastTimeout
    });
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
    this.getVideoProgress();
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
    const currentTime = this.videoPlayer.nativeElement.currentTime;
    this.videoService.setVideoProgress(currentTime).subscribe({
      next: () => console.log('Progress saved.'),
      error: (err) => console.error('Error saving progress:', err),
    });
  }


  getVideoProgress(): void {
    this.videoService.loadVideoProgress().subscribe({
      next: (data) => {
        if (data && data.current_time !== undefined) {
          const savedProgress = data.current_time;
          console.log('SAVED', savedProgress);
          this.videoPlayer.nativeElement.currentTime = 0;
          this.videoPlayer.nativeElement.currentTime = savedProgress;
          console.log('Progress loaded:', savedProgress);
        } else {
          this.videoPlayer.nativeElement.currentTime = 0;
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
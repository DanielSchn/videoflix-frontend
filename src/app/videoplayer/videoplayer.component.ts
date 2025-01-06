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
import { ToastService } from '../service/toast.service';


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
  toastr = inject(ToastService);
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
  private intervalId: any;
  showOverlay: boolean = false;
  savedProgress: number = 0;

  constructor() {
    this.screenWidth = window.innerWidth;
  }


  /**
  * Lifecycle hook that is called after Angular has fully initialized the component's view.
  * It sets up event listeners for the video player to track progress, pause, and end events.
  * Also, it ensures that video progress is saved when the page is unloaded or the video time updates.
  */
  ngAfterViewInit(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.updateVideoSource(this.selectedQuality);

      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.getVideoProgress();
      });

      this.videoPlayer.nativeElement.addEventListener('pause', () => {
        this.saveVideoProgress();
        clearInterval(this.intervalId);
      });

      this.videoPlayer.nativeElement.addEventListener('ended', () => {
        this.saveVideoProgress();
        clearInterval(this.intervalId);
      });

      window.addEventListener('beforeunload', () => {
        this.saveVideoProgress();
      });

      this.videoPlayer.nativeElement.addEventListener('play', () => {
        this.intervalId = setInterval(() => {
          this.saveVideoProgress();
        }, 5000);
      });
    }
  }


  /**
  * Handles the event when the video quality is changed.
  * Displays a success message with the selected quality, stores the current playback time before the change,
  * and updates the video source based on the new selected quality.
  * 
  * @param event The event object that contains the new quality value selected by the user.
  */
  onQualityChange(event: any): void {
    this.toastr.success(event.target.value, 'Change Quality to:');
    this.currentTimeBeforeQualityChange = this.getCurrentTime();
    this.selectedQuality = event.target.value;
    this.updateVideoSource(this.selectedQuality);
  }


  /**
  * Updates the video source based on the selected quality.
  * It finds the corresponding video source URL from the quality options,
  * and updates the video player's source to the new video URL.
  * 
  * @param quality The selected quality label (e.g., '720p', '1080p') to update the video source.
  */
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


  /**
  * Lifecycle hook that is called when the component is initialized.
  * It retrieves the video source data, sets up available video quality options,
  * and performs initial setup such as selecting the appropriate quality, updating the video source,
  * adjusting the screen width, and loading the current video progress.
  */
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


  /**
  * Selects the appropriate video quality based on the current screen width.
  * It sets the selected video quality to '480p', '720p', or '1080p' depending on the screen width.
  */
  selectVideoQualityByScreenWidth(): void {
    if (this.screenWidth < 720) {
      this.selectedQuality = '480p';
    } else if (this.screenWidth < 1080) {
      this.selectedQuality = '720p';
    } else {
      this.selectedQuality = '1080p';
    }
  }


  /**
  * Saves the current video playback progress to the server.
  * It retrieves the current playback time of the video and sends it to the video service
  * to save the progress.
  */
  saveVideoProgress(): void {
    const currentTime = this.videoPlayer.nativeElement.currentTime;
    this.videoService.setVideoProgress(currentTime).subscribe({
      next: () => console.log('Progress saved.'),
      error: (err) => console.error('Error saving progress:', err),
    });
  }


  /**
  * Retrieves the saved video playback progress from the server and updates the video player accordingly.
  * If progress data is available, it sets the video's current playback time to the saved value.
  * Otherwise, it resets the playback time to the beginning of the video.
  */
  getVideoProgress(): void {
    this.videoService.loadVideoProgress().subscribe({
      next: (data) => {
        if (data && data.current_time !== undefined && data.current_time > 0) {
          this.savedProgress = data.current_time;
          this.showOverlay = true;
        } else {
          this.videoPlayer.nativeElement.currentTime = 0;
        }
      },
      error: (err) => console.error('Error loading progress:', err),
    });
  }


  /**
  * Resumes video playback from the saved progress and hides the overlay.
  * 
  * This method sets the video player's current playback time to the saved progress 
  * (`this.savedProgress`) and then starts playing the video from that position. 
  * The overlay (e.g., a UI prompt or pause screen) is hidden before the video starts playing.
  * 
  * @returns void
  */
  resumeVideo(): void {
    this.videoPlayer.nativeElement.currentTime = this.savedProgress;
    this.showOverlay = false;
    this.videoPlayer.nativeElement.play();
  }


  /**
  * Restarts video playback from the beginning and hides the overlay.
  * 
  * This method sets the video player's current playback time to 0, effectively restarting 
  * the video from the beginning. The overlay is hidden before the video starts playing.
  * 
  * @returns void
  */
  restartVideo(): void {
    this.videoPlayer.nativeElement.currentTime = 0;
    this.showOverlay = false;
    this.videoPlayer.nativeElement.play();
  }


  /**
  * Retrieves the current playback time of the video.
  * If the video player element is available, it returns the `currentTime` property of the video player.
  * Otherwise, it returns 0 as a fallback.
  * 
  * @returns The current playback time of the video in seconds, or 0 if the video player is not available.
  */
  getCurrentTime(): number {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      return this.videoPlayer.nativeElement.currentTime;
    }
    return 0;
  }


  /**
  * Listens for the window resize event and updates the screen width.
  * This method is triggered automatically whenever the window is resized.
  * 
  * @param event The resize event object triggered by the browser.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateScreenWidth();
  }


  /**
  * Updates the current screen width by retrieving the window's inner width.
  * Logs the updated screen width to the console for debugging purposes.
  */
  private updateScreenWidth(): void {
    this.screenWidth = window.innerWidth;
    console.log('Aktuelle Bildschirmbreite:', this.screenWidth);
  }


  /**
  * Lifecycle hook that is called when the component is destroyed.
  * Cleans up the video player instance by disposing of it to release resources.
  */
  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
    clearInterval(this.intervalId);
  }
}
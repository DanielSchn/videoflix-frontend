import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { VideoService } from './service/video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix';
  videoService = inject(VideoService);
  router = inject(Router);
  private subscription!: Subscription;

  
  constructor() {
    this.loadVideos();
    this.updateScreenWidth();
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
    this.videoService.screenWidth = window.innerWidth;
  }


  /**
  * Loads the list of videos from the server if a valid token is found in localStorage or sessionStorage.
  * After successfully loading the videos, navigates to the '/video-list' route.
  */
  private loadVideos(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      this.subscription = this.videoService.fetchList().subscribe(() => {
        console.log('Videos loaded!');
      });
      this.router.navigate(['/video-list']);
    }
  }


  /**
  * Lifecycle hook that is called when the component is destroyed.
  * Cleans up any allocated resources, such as unsubscribing from observables,
  * to prevent memory leaks and ensure proper cleanup.
  */
  ngOnDestroy(): void {  
    if (this.subscription) {  
     this.subscription.unsubscribe();  
    }  
  }
}

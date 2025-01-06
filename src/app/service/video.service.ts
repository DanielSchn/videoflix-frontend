import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Videolist } from '../interfaces/videolist.interface';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private listSubject = new BehaviorSubject<any[]>([]);
  http = inject(HttpClient);
  private apiBaseUrl = environment.API_BASE_URL;
  screenWidth: number = 0;

  private videoSource: Videolist = {
    id: 0,
    title: '',
    description: '',
    thumbnail: '',
    video_480p: '',
    video_720p: '',
    video_1080p: '',
    category: '',
  };


  constructor() { }


  /**
  * Fetches the list of videos from the API and updates the internal list.
  * 
  * This method sends an HTTP GET request to retrieve the list of videos from the server. 
  * Once the data is received, it updates the `listSubject` to notify subscribers with the new list.
  * 
  * @returns An observable that emits the list of videos fetched from the server.
  */
  fetchList(): Observable<any[]> {
    const headers = this.setHeader();
    return this.http.get<any[]>(this.apiBaseUrl + 'api/video/', { headers }).pipe(
      tap((data) => this.listSubject.next(data))
    );
  }


  /**
  * Retrieves the list of videos as an observable.
  * 
  * This method returns an observable that emits the current list of videos. 
  * The list is managed using a `Subject`, which allows multiple subscribers to receive the latest list updates.
  * 
  * @returns An observable that emits the current video list.
  */
  getList(): Observable<any[]> {
    return this.listSubject.asObservable();
  }


  /**
  * Sets the current video source.
  * 
  * This method updates the `videoSource` property with the provided `Videolist` object.
  * 
  * @param source The video source object (`Videolist`) to set as the current video source.
  */
  setVideoSource(source: Videolist): void {
    this.videoSource = source;
  }


  /**
  * Retrieves the current video source.
  * 
  * Returns the video source object that contains information about the video such as its title and various qualities.
  * 
  * @returns The current video source (`Videolist`) object.
  */
  getVideoSource(): Videolist {
    return this.videoSource;
  }


  /**
  * Saves or updates the user's video progress based on the current video playback time.
  * 
  * First checks if there is existing progress for the current video. If progress exists, it updates the
  * progress with the new `currentTime`. If no progress is found, it creates a new record with the current time.
  * 
  * @param currentTime The current playback time of the video to save or update.
  * @returns An observable that emits the response from the server after saving or updating the progress.
  */
  setVideoProgress(currentTime: number): Observable<any> {
    const progressData = {
      video_name: this.videoSource.title,
      current_time: currentTime,
    };
    const headers = this.setHeader();
    return this.http
      .get(this.apiBaseUrl + 'api/video-progress/get_user_progress/', {
        headers,
        params: { video_name: this.videoSource.title },
      })
      .pipe(
        switchMap((existingProgress: any) => {
          if (existingProgress && existingProgress.id) {
            const progressId = existingProgress.id;
            return this.http.patch(
              `${this.apiBaseUrl}api/video-progress/${progressId}/`,
              { current_time: currentTime },
              { headers }
            );
          } else {
            return this.http.post(
              this.apiBaseUrl + 'api/video-progress/',
              progressData,
              { headers }
            );
          }
        }),
        catchError((error) => {
          console.error(error);
          throw error;
        })
      );
  }


  /**
  * Loads the user's video progress for the specified video.
  * 
  * Sends a GET request to the API to retrieve the progress of the currently selected video 
  * based on the `videoSource.title`. The request includes the appropriate headers and query parameters.
  * 
  * @returns An observable that emits the video progress data or `null` if no progress is found or an error occurs.
  */
  loadVideoProgress(): Observable<any> {
    const headers = this.setHeader();
    const params = { video_name: this.videoSource.title };
    return this.http
      .get<any[]>(`${this.apiBaseUrl}api/video-progress/get_user_progress/`, { headers, params })
      .pipe(
        tap((data) => {
          if (data && data.length > 0) {
            console.log('Loaded video progress', data[0]);
          } else {
            console.log('No video progress found.');
          }
        }),
        catchError((error) => {
          if (error.status === 404) {
            console.log('No video progress found.');
            return of(null);
          } else {
            console.error('Error loading progress.', error);
            return of(null);
          }
        })
      );
  }


  /**
  * Retrieves the authentication token from `localStorage` or `sessionStorage`.
  * 
  * First checks `localStorage` for the token, then `sessionStorage` if not found in `localStorage`.
  * If no token is found, returns `null`.
  * 
  * @returns The authentication token if found, or `null` if not.
  */
  private getAuthToken(): string | null {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token;
  }


  /**
  * Sets the Authorization header for API requests.
  * 
  * Retrieves the authentication token using `getAuthToken()` and returns an object
  * with the `Authorization` header set to `Token <authToken>`.
  * 
  * @returns An object containing the Authorization header with the token.
  */
  private setHeader(): { Authorization: string } {
    const token = this.getAuthToken();
    return { Authorization: `Token ${token}` };
  }
}

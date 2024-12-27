import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Videolist } from './interfaces/videolist.interface';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private listSubject = new BehaviorSubject<any[]>([]);
  http = inject(HttpClient);
  private apiBaseUrl = environment.API_BASE_URL;

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


  fetchList(): Observable<any[]> {
    const headers = this.setHeader();
    return this.http.get<any[]>(this.apiBaseUrl + 'api/video/', { headers }).pipe(
      tap((data) => this.listSubject.next(data))
    );
  }


  getList(): Observable<any[]> {
    return this.listSubject.asObservable();
  }


  setVideoSource(source: Videolist): void {
    this.videoSource = source;
    console.log('VIDEOSOURCE', this.videoSource);
  }


  getVideoSource(): Videolist {
    return this.videoSource;
  }


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


  private getAuthToken(): string | null {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token;
  }


  private setHeader(): { Authorization: string } {
    const token = this.getAuthToken();
    return { Authorization: `Token ${token}` };
  }
}

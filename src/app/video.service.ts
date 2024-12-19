import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Videolist } from './interfaces/videolist.interface';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private listSubject = new BehaviorSubject<any[]>([]);
  http = inject(HttpClient);
  private apiBaseUrl = environment.API_BASE_URL;

  constructor() { }

  fetchList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBaseUrl + 'api/video/').pipe(
      tap((data) => this.listSubject.next(data))
    );
  }

  getList(): Observable<any[]> {
    return this.listSubject.asObservable();
  }

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

  setVideoSource(source: Videolist): void {
    this.videoSource = source;
    console.log('VIDEOSOURCE', this.videoSource);
  }

  getVideoSource(): Videolist {
    return this.videoSource;
  }
}

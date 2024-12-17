import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Videolist } from './interfaces/videolist.interface';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private listSubject = new BehaviorSubject<any[]>([]);
  http = inject(HttpClient);
  constant = inject(ConstantsService)

  constructor() { }

  fetchList(): Observable<any[]> {
    return this.http.get<any[]>(this.constant.API_BASE_URL + 'api/video/').pipe(
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

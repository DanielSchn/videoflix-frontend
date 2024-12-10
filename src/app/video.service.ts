import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ConstantsService } from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private listSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient, private constant: ConstantsService) { }

  fetchList(): Observable<any[]> {
    return this.http.get<any[]>(this.constant.API_BASE_URL + 'api/video/').pipe(
      tap((data) => this.listSubject.next(data))
    );
  }

  getList(): Observable<any[]> {
    return this.listSubject.asObservable();
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpClient);
  private apiBaseUrl = environment.API_BASE_URL;

  constructor() { }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      return new Observable<boolean>((observer) => {
        observer.next(false);
        observer.complete();
      });
    }

    return this.http
      .get<any>(`${this.apiBaseUrl}api/token-check/`, {
        headers: new HttpHeaders().set('Authorization', `Token ${token}`),
      })
      .pipe(
        catchError(() => {
          return new Observable<boolean>((observer) => {
            observer.next(false);
            observer.complete();
          });
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/login/`, { username, password });
  }


  signUp(email: string, password: string, confirm_password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/registration/`, { email, password, confirm_password });
  }
}

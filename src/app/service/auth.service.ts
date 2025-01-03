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


  /**
  * Logs in the user with the given username and password.
  * 
  * This method sends a POST request to the login API endpoint with the provided credentials. 
  * If the login is successful, it returns the response containing the user's data or authentication token.
  * 
  * @param username The username of the user attempting to log in.
  * @param password The password of the user attempting to log in.
  * @returns An observable that emits the response from the login API.
  */
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/login/`, { username, password });
  }


  /**
  * Registers a new user with the provided email and password.
  * 
  * This method sends a POST request to the registration API endpoint with the given email, password, and confirmed password. 
  * If the registration is successful, it returns the response containing information about the new user.
  * 
  * @param email The email address of the user.
  * @param password The password chosen by the user.
  * @param confirm_password The confirmation of the user's password.
  * @returns An observable that emits the response from the registration API.
  */
  signUp(email: string, password: string, confirm_password: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/registration/`, { email, password, confirm_password });
  }


  /**
  * Verifies the user's email address using a unique identifier (UID) and token.
  * 
  * This method sends a POST request to the email verification API endpoint with the user's UID and the token sent to their email. 
  * If successful, the user's email is verified, and they can proceed with the registration or login process.
  * 
  * @param uid The unique identifier of the user.
  * @param token The token sent to the user's email for verification.
  * @returns An observable that emits the response from the email verification API.
  */
  verifyEmail(uid: string,  token: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/verify-email/`, { uid, token });
  }


  /**
  * Initiates a password reset process by sending a reset link to the user's email.
  * 
  * This method sends a POST request to the password reset API endpoint with the user's email. 
  * The user will receive an email containing a link to reset their password.
  * 
  * @param email The email address of the user who forgot their password.
  * @returns An observable that emits the response from the password reset API.
  */
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/password-reset/`, { email });
  }


  /**
  * Confirms the new password and resets it for the user.
  * 
  * This method sends a POST request to the password reset confirmation API endpoint with the user's UID, token, and new password. 
  * If successful, the user's password will be reset.
  * 
  * @param uid The unique identifier of the user.
  * @param token The token sent to the user's email for resetting the password.
  * @param new_password The new password chosen by the user.
  * @returns An observable that emits the response from the password reset confirmation API.
  */
  passwordReset(uid: string, token: string, new_password: string) : Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}api/password-reset-confirm/`, { uid, token, new_password });
  }
}

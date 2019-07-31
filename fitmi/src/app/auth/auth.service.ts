import { Injectable } from  '@angular/core';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Router } from '@angular/router';

import { StorageService } from  '../storage.service';
import { AuthRequest, AuthResponse } from  './auth-msg';
import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);

  private tabsRoute = 'tabs';

  constructor(
    private httpClient: HttpClient,
    private storage: StorageService,
    private router: Router) { }

  signIn(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://localhost:3000/users`, request).pipe(
      tap(async (res: AuthResponse) => {
          await this.storage.store(this.storage.getAccessTokenName(), res.accessToken);
          this.authSubject.next(true);
      })
    );
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://localhost/login`, request).pipe(
     tap(async (res: AuthResponse) => {
//TO-DO
       //await this.storage.store("accessToken", res.accessToken);
       //this.authSubject.next(true);
     })
   );
  }

  tryAutoLogin() {
    this.storage.retrieve(this.storage.getAccessTokenName()).then(token => {
      if (token) { // If the token is present -> check expiration time and, if it's valid, update it and log in.
        if (token.expirationTime - Date.now() > 0) {
          // Refresh expiration time
          this.refreshTokenExpirationTime();
          // Send request to server in order to retrieve user data before entering the homepage
// TO-DO
          this.router.navigateByUrl(this.tabsRoute);
        }
      }
    });
  }

  private refreshTokenExpirationTime() {
//TO-DO
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}

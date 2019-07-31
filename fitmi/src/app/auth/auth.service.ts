import { Injectable } from  '@angular/core';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { StorageService } from  '../storage.service';
import { AuthRequest, AuthResponse } from  './auth-msg';


import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: StorageService) { }

  signIn(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://localhost:3000/users`, request).pipe(
      tap(async (res: AuthResponse) => {
          await this.storage.store("accessToken", res.accessToken.id);
          await this.storage.store("expirationTime", res.accessToken.expirationTime);
          this.authSubject.next(true);
      })
    );
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://localhost/login`, request).pipe(
     tap(async (res: AuthResponse) => {
       await this.storage.store("token", res.accessToken);
       await this.storage.store("expirationTime", res.expirationTime);
       this.authSubject.next(true);
     })
   );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}

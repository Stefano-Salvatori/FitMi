import { Injectable } from  '@angular/core';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';

import { Storage } from  '@ionic/storage';
import { AuthRequest, AuthResponse } from  './auth-msg';


import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: Storage) { }

  register(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://192.168.1.4:3000/sign-in`, request).pipe(
      tap(async (res:  AuthResponse) => {
          await this.storage.set("token", res.accessToken);
          await this.storage.set("expirationTime", res.expirationTime);
          this.authSubject.next(true);
      });
    );
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`http://192.168.1.4:3000/login`, request).pipe(
     tap(async (res: AuthResponse) => {
       await this.storage.set("token", res.accessToken);
       await this.storage.set("expirationTime", res.expirationTime);
       this.authSubject.next(true);
     });
   );
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}

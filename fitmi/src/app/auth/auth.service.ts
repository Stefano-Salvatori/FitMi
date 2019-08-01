import { Injectable, Output, EventEmitter } from  '@angular/core';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Router } from '@angular/router';

import { StorageService } from  '../storage.service';
import { AuthRequest, AuthResponse } from  './auth-msg';
import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);

  @Output() loginErrorNumberEmitter: EventEmitter<number> = new EventEmitter();

  private tabsRoute = 'tabs';

  constructor(
    private httpClient: HttpClient,
    private httpClientService: HttpClientService,
    private storage: StorageService,
    private router: Router) { }

  signIn(request: AuthRequest): Observable<AuthResponse> {
    return this.httpClient.post(`http://localhost:3000/users`, request).pipe(
      tap(async (res: AuthResponse) => {
          await this.storage.store(this.storage.getAccessTokenName(), res.accessToken);
          this.authSubject.next(true);
      })
    );
  }

  login(username, password) {
    this.loginRequest({
      username: username,
      password: password
    });
  }

  tryAutoLogin() {
    this.storage.retrieve(this.storage.getAccessTokenName()).then(token => {
      //console.log("PRE " + token.expirationTime + " date: " + Date.now() + " -> " + (token.expirationTime - Date.now()));
      if (token && token.expirationTime - Date.now() > 0) {
        this.loginRequest({
          token: token.id
        });
      }
    });
  }

  private loginRequest(payload) {
    this.httpClientService.post('/users/login', payload).subscribe(
      (serverResponse: HttpResponse<any>) => {
        this.authSubject.next(true);
        this.router.navigateByUrl(this.tabsRoute);
    },
      (err: HttpErrorResponse) => {
        this.loginErrorNumberEmitter.emit(err.status);
    });
  }

  private refreshTokenExpirationTime() {
//TO-DO

  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}

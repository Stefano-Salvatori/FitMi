import { Injectable, Output, EventEmitter } from  '@angular/core';
import { tap } from  'rxjs/operators';
import { Observable, BehaviorSubject } from  'rxjs';
import { Router } from '@angular/router';

import { StorageService } from  '../storage.service';
import { AuthRequest, AuthResponse } from  './auth-msg';
import { HttpClientService } from '../http-client.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject(false);

  @Output() loginErrorNumberEmitter: EventEmitter<number> = new EventEmitter();

  private tabsRoute = 'tabs';

  constructor(
    private httpClient: HttpClientService,
    private storage: StorageService,
    private router: Router) { }

  signIn(request: AuthRequest) {
    this.httpClient.post(`/users`, request).pipe(
      tap(async (res: AuthResponse) => {
          console.log(res);
          await this.storage.store(this.storage.getAccessTokenName(), res.accessToken);
          this.authSubject.next(true);
      })
    ).subscribe(() => {
      this.router.navigateByUrl('login');
    });
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
    this.httpClient.post('/users/login', payload).pipe(
      tap(async (res: AuthResponse) => await this.storage.store(this.storage.getAccessTokenName(), res.accessToken))
    ).subscribe(
      (res: HttpResponse<any>) => {
        this.authSubject.next(true);
        this.router.navigateByUrl(this.tabsRoute);
    },
      (err: HttpErrorResponse) => {
        this.loginErrorNumberEmitter.emit(err.status);
    });
  }

/*
  isLoggedIn() {
    return this.authSubject.asObservable();
  }
*/
}

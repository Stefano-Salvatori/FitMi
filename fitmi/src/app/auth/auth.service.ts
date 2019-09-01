import { Injectable, Output, EventEmitter } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { StorageService } from '../storage.service';
import { AuthRequest, AuthResponse } from './auth-msg';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authSubject = new BehaviorSubject(false);
  private user: User;

  @Output() loginErrorNumberEmitter: EventEmitter<number> = new EventEmitter();

  private tabsRoute = 'tabs';

  constructor(
    private httpClient: HttpClientService,
    private storage: StorageService,
    private router: Router) { }


  isLoggedIn(): boolean {
    return this.user !== undefined;
  }

  /**
   * Update the current user by asking for a newer version to the server.
   *
   * This is needed because (by the time of writing) some updates on the user's
   * informations are performed server-side and if we don't call this function could
   * not be seen by the client
   */
  updateCurrentUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.user !== undefined) {
        this.httpClient.get('/users/' + this.user._id).subscribe((updatedUser: User) => {
          this.user = User.fromUser(updatedUser);
          resolve();
        }, error => reject());
      } else {
        resolve();
      }
    });

  }

  signIn(payload: AuthRequest) {
    this.httpClient.post(`/users`, payload).pipe(
      tap(async (res: AuthResponse) => {
        await this.storage.store(this.storage.getAccessTokenName(), res.accessToken).then(v =>
          this.router.navigateByUrl('login'));
      })
    ).subscribe(() => {

    });
  }

  login(username: string, password: string) {
    this.loginRequest({
      username,
      password
    });
  }

  tryAutoLogin() {
    this.storage.retrieve(this.storage.getAccessTokenName()).then(token => {
      if (token && token.expirationTime - Date.now() > 0) {
        this.loginRequest({
          token: token.id
        });
      } else {
        console.log('No valid token found...');
      }
    });
  }

  logout() {
    this.storage.clean().then(() => {
      // this.authSubject.next(false);
      this.router.navigateByUrl('login');
    });
  }

  private loginRequest(payload) {
    this.httpClient.post('/users/login', payload).pipe(
      tap(async (res: User) => {
        await this.storage.store(this.storage.getAccessTokenName(), res.accessToken);
        this.user = User.fromUser(res);
        // this.authSubject.next(true);
        this.router.navigateByUrl(this.tabsRoute);
      })
    ).subscribe(() => {

    },
      (err: HttpErrorResponse) => {
        this.loginErrorNumberEmitter.emit(err.status);
      });
  }

  public getUser(): User {
    return this.user;
  }

  /*
    isLoggedIn() {
      return this.authSubject.asObservable();
    }
  */
}

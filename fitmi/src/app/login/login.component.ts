import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private registrationRoute = 'sign-in';
  private tabsRoute = 'tabs';

  private username: string;
  private password: string;

  private errorString = '';
  private readonly incorrectFields = 'Username o Password non corretti';
  private readonly connectionError = 'Errore di connessione al server';


  public constructor(
    private router: Router,
    private auth: AuthService,
  private storage: StorageService) {
      this.auth.loginErrorNumberEmitter.subscribe(err => {
        if (err === 401) {
          this.errorString = this.incorrectFields;
        } else {
          this.errorString = this.connectionError;
        }
      });
  }

  public ngOnInit() {
    this.auth.tryAutoLogin();
  }

  public login(): void {
    this.auth.login(this.username, this.password);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { serverAddress, serverBaseUrl } from '../../server-data';

import { CryptoService } from '../crypto.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  private registrationRoute = 'sign-in';
  private homeRoute = 'home';

  private username: string;
  private password: string;

  private errorString = '';
  private readonly incorrectFields = 'Username o Password non corretti';
  private readonly connectionError = 'Errore di connessione al server';


  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private chiper: CryptoService,
    private auth: AuthService) {
  }

  public ngOnInit() {
    this.auth.tryAutoLogin();
  }

  public login(): void {

    const hashedPassword: string = this.chiper.sha512(this.password);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }

    this.httpClient
      .post(serverAddress + '/users/login', {
        username: this.username,
        password: hashedPassword,
      }, httpOptions,
      ).subscribe((serverResponse: HttpResponse<any>) => {
        this.router.navigateByUrl(this.homeRoute);
      }, (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.errorString = this.incorrectFields;
        } else {
          this.errorString = this.connectionError;
        }
      });
  }
}

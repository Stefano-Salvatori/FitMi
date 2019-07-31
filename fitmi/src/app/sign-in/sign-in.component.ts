import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { serverAddress, serverBaseUrl } from '../../server-data';

import { CryptoService } from '../crypto.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private chiper: CryptoService,
    private auth: AuthService) { }

  ngOnInit() { }

  register(form) {
    form.value.password = this.chiper.sha512(form.value.password);
    this.auth.signIn(form.value).subscribe(() => {
      this.router.navigateByUrl('login');
    });
  }
}

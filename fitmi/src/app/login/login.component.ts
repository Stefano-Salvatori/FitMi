import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private registrationRoute: string = 'sign-in';
  private loginRoute: string = 'login';
  private logoImage: string = 'assets/icon/logo_icon.png';

  private username: string;
  private password: string;

  private router: Router;
  private httpClient: HttpClient;

  public constructor(router: Router, httpClient: HttpClient) {
    this.router = router;
    this.httpClient = httpClient;
  }

  public login(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    console.log(this.username);
    console.log(this.password);

    this.httpClient
      .post(
        'http://192.168.1.4:3000/users/login',
        {
          username: this.username,
          password: this.password,
        },
        httpOptions,
      )
      .subscribe((data): void => console.log(data));
  }

  public register(): void {
    this.router.navigateByUrl(this.registrationRoute);
  }
}

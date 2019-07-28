import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private registrationRoute: string = "sign-in";
  private loginRoute: string = "login";
  private logoImage: string = "assets/icon/logo_icon.png";

  private username: String;
  private password: String;


  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit() {}

  login() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    console.log(this.username);
    console.log(this.password);

    this.httpClient.post("http://192.168.1.4:3000/users/login",{
      username: this.username, 
      password: this.password
    }, httpOptions)
      .subscribe(data => console.log(data));
  }

  register() {
    this.router.navigateByUrl(this.registrationRoute);
  }
}

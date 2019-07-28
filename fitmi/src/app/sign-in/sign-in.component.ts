import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  private logoImage: string = "assets/icon/logo_icon.png";
  /*private M: string = "M";
  private F: string = "F";

  private username: string;
  private password: string;
  private birthDate: string;
  private gender: string;
  private height: number;
  private weight: number;*/


  constructor(private httpClient: HttpClient, 
    private router: Router) {
    //this.gender = this.M;
  }

  ngOnInit() {}

  register(form) {
    this.httpClient.post("http://192.168.1.4:3000/users", form.value)
    .subscribe(() => this.router.navigateByUrl("home"))
  }


  setGender(selectedGender: string) {
    //this.gender = selectedGender;
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {

  private title: string = "Registrati";
  private M: string = "M";
  private F: string = "F";

  private username: string;
  private password: string;
  private birthDate: string;
  private gender: string;
  private heigth: number;
  private weight: number;


  constructor(private httpClient: HttpClientService) {
    this.gender = this.M;
  }

  ngOnInit() {}

  register() {

  }

  setGender(selectedGender: string) {
    this.gender = selectedGender;
  }
}

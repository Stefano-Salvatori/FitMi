import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private registrationRoute: string = "sign-in";
  private loginRoute: string = "login";
  private title: string = "FIT MI";

  constructor(private router: Router) { }

  ngOnInit() {}

  login() {

  }

  register() {
    this.router.navigateByUrl(this.registrationRoute);
  }
}

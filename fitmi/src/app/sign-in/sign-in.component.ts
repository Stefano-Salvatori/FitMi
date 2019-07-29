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

  constructor(private httpClient: HttpClient,
              private router: Router) { }

  ngOnInit() { }

  register(form) {
    this.httpClient.post('http://192.168.1.4:3000/users', form.value)
      .subscribe(() => this.router.navigateByUrl('home'));
  }
}

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CircleProgressComponent } from 'ng-circle-progress';
import { User } from 'src/model/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;


  user: User;

  constructor(private auth: AuthService) {
    this.user = this.auth.getUser();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.progress.animate(0, 85);
  }


  logout() {
    this.auth.logout();
  }

  calculateAge(birthDate: string): number {
    birthDate = birthDate.split('T')[0];
    const splitDate = birthDate.split('-');
    const year = splitDate[0];
    const month = splitDate[1];
    const day = splitDate[2];
    const date = new Date();
    let age = date.getFullYear() - parseInt(year);
    if (((date.getMonth() + 1) - parseInt(month) < 0)
      || ((date.getMonth() + 1) === parseInt(month) && date.getDate() - parseInt(day) < 0)) {
      age -= 1;
    }
    return age;
  }

}

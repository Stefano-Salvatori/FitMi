import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CircleProgressComponent } from 'ng-circle-progress';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, {static: false}) progress!: CircleProgressComponent;

  firstName: string;
  lastName: string;
  score: number;
  badges = [0, 1, 2, 3];
  gender: string;
  age: number;
  height: number;
  weight: number;

  constructor(private auth: AuthService) {
    const user = this.auth.getUser();
    this.firstName = user.firstName || 'AAA';
    this.lastName = user.lastName || 'BBB';
    this.score = user.score;
    this.gender = user.gender;
    this.age = this.calculateAge(user.birthDate);
    this.height = user.height;
    this.weight = user.weight;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.progress.animate(0, 85);
  }


  logout() {
    this.auth.logout();
  }

  private calculateAge(birthDate: string): number {
    birthDate = birthDate.split('T')[0];
    const splitDate = birthDate.split('-');
    const year = splitDate[0];
    const month = splitDate[1];
    const day = splitDate[2];
    const date = new Date();
    let age = date.getFullYear() - parseInt(year);
    if (((date.getMonth() + 1) - parseInt(month) < 0)
      || ((date.getMonth() + 1) === parseInt(month) && date.getDate() - parseInt(day) < 0))  {
      age -= 1;
    }
    return age;
  }

}

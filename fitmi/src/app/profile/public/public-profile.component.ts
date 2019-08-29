import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { CircleProgressComponent } from 'ng-circle-progress';
import { User } from 'src/model/user';
import { serverAddress } from 'src/server-data';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})

export class PublicProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;

  public user: User;

  constructor() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.progress.animate(0, this.user.score % 100);
  }



  calculateAge(birthDate: Date): number {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth();
    const day = birthDate.getDate();
    const date = new Date();

    let age = date.getFullYear() - year;
    if (((date.getMonth() + 1) - month < 0)
      || ((date.getMonth() + 1) === month && date.getDate() - day < 0)) {
      age -= 1;
    }
    return age;
  }

  profileImage(user: User): string {
    if (user.profileImg !== undefined) {
      return serverAddress + '/images/user_pics/' + user.profileImg;
    } else {
      return user.gender === 'M' ?
        serverAddress + '/images/user_pics/man.svg' :
        serverAddress + '/images/user_pics/girl-1.svg';
    }
  }

}

import { Component, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CircleProgressComponent } from 'ng-circle-progress';
import { User } from 'src/model/user';
import { Badge } from 'src/model/badge';
import { Session } from 'src/model/session';
import { serverAddress } from 'src/server-data';
import { ModalController } from '@ionic/angular';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { Router } from '@angular/router';
import { HttpClientService } from '../http-client.service';
import { BadgeService } from '../badge.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;


  user: User = new User();
  userBadges: Badge<any>[] = [];
  lockedBadges: Badge<any>[] = [];
  server = serverAddress;


  constructor(private auth: AuthService,
              private http: HttpClientService,
              private badgeService: BadgeService,
              public modalController: ModalController) {
  }

  async ngOnInit() {
    this.user = this.auth.getUser();
    const allBadges = await this.badgeService.allBadges;
    this.user.badges.forEach(badgeId => {
      this.userBadges.push(allBadges.find(badge => badge._id === badgeId));
    });
    this.lockedBadges = allBadges.filter(badge => !this.userBadges.includes(badge));
  }

  ngAfterViewInit() {
    this.progress.animate(0, this.user.score % 100);
  }


  logout() {
    this.auth.logout();
  }

  async editImage() {
    const modal = await this.modalController.create({
      component: ProfileImageComponent,
      cssClass: 'modal'
    });

    modal.onDidDismiss().then(dismissed => {
      this.user.profileImg = dismissed.data.image;
      this.http.put('/users/' + this.user._id, this.user)
        .subscribe(() => { });
    });
    return await modal.present();


  }


  profileImage(): string {
    if (this.user.profileImg !== undefined) {
      return serverAddress + '/images/user_pics/' + this.user.profileImg;
    } else {
      return this.user.gender === 'M' ?
        serverAddress + '/images/user_pics/man.svg' :
        serverAddress + '/images/user_pics/girl-1.svg';
    }
  }

  // tslint:disable-next-line: variable-name
  calculateAge(_birthDate: Date): number {
    const birthDate = new Date(_birthDate);
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

}

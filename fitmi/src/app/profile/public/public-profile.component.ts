import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';

import { CircleProgressComponent } from 'ng-circle-progress';
import { User } from 'src/model/user';
import { serverAddress } from 'src/server-data';
import { Badge } from 'src/model/badge';
import { BadgeService } from 'src/app/badge.service';
import {  PopoverController } from '@ionic/angular';
import { LeaderboardComponent } from 'src/app/leaderboard/leaderboard.component';
import { BadgePopoverComponent } from '../badge-popover/badge-popover.component';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
})

export class PublicProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;

  public user: User;
  public controller: LeaderboardComponent;
  public userBadges: Badge<any>[] = [];
  public lockedBadges: Badge<any>[] = [];
  public server = serverAddress;

  constructor(private badgeService: BadgeService, private popoverController: PopoverController) {

  }

  async ngOnInit() {
    const allBadges = await this.badgeService.allBadges;
    this.user.badges.forEach(badgeId => {
      this.userBadges.push(allBadges.find(badge => badge._id === badgeId));
    });
    this.lockedBadges = allBadges.filter(badge => !this.userBadges.includes(badge));
  }

  ngAfterViewInit() {
    this.progress.animate(0, this.user.score % 100);
  }

  dismissModal() {
    this.controller.dismissCurrentModal();

  }

  onBadgeClick(badge: Badge<any>) {
    this.presentPopover(badge);
  }

  async presentPopover(badge: Badge<any>) {
    const popover = await this.popoverController.create({
      component: BadgePopoverComponent,
      componentProps: {
        badge
      },
      translucent: true,
      showBackdrop: true,
      cssClass: 'badge-popover-style',
    });
    return await popover.present();
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

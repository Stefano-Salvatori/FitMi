import { Component, OnInit, ViewChild, AfterViewInit, OnChanges } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { CircleProgressComponent } from 'ng-circle-progress';
import { Badge } from 'src/model/badge';
import { serverAddress } from 'src/server-data';
import { ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ProfileImageComponent } from './../profile-image/profile-image.component';
import { HttpClientService } from '../../http-client.service';
import { BadgeService } from '../../badge.service';
import { User } from 'src/model/user';
import { BadgePopoverComponent } from '../badge-popover/badge-popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;


  isDataAvailable = false;
  user: User = new User();
  currentLevel = 0;
  userBadges: Badge<any>[] = [];
  lockedBadges: Badge<any>[] = [];
  server = serverAddress;
  public isModifyingGender = false;
  public isModifyingHeight = false;
  public isModifyingWeight = false;
  public isModifyingAge = false;
  public newWeight: number;
  public newGender: string;
  public newBirthDate: string;
  public newHeight: number;

  constructor(private auth: AuthService,
              private http: HttpClientService,
              private badgeService: BadgeService,
              public modalController: ModalController,
              public popoverController: PopoverController) {
  }



  async ngOnInit() {
    this.user = this.auth.getUser();
    this.currentLevel = this.user.level;
    const allBadges = await this.badgeService.allBadges;
    this.user.badges.forEach(badgeId => {
      this.userBadges.push(allBadges.find(badge => badge._id === badgeId));
    });
    this.lockedBadges = allBadges.filter(badge => !this.userBadges.includes(badge));
    this.isDataAvailable = true;
  }

  ngAfterViewInit() {
    const previousMax =
      this.currentLevel === 0 ? 0 : 100 * Math.pow(2, this.currentLevel - 1);
    const nextMax = 100 * Math.pow(2, this.currentLevel);
    const todo = nextMax - previousMax;
    this.progress.animate(0, ((this.user.score - previousMax) / todo) * 100);
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



  public onModifyInfoClick(info: string) {
    switch (info) {
      case 'gender': this.isModifyingGender = !this.isModifyingGender; break;
      case 'age': this.isModifyingAge = !this.isModifyingAge; break;
      case 'weight': this.isModifyingWeight = !this.isModifyingWeight; break;
      case 'height': this.isModifyingHeight = !this.isModifyingHeight; break;

    }
  }




  public modifyConfirm(info: string) {
    const currUser = this.auth.getUser();
    const newUser = currUser;

    switch (info) {
      case 'gender':
        newUser.gender = this.newGender;
        this.isModifyingGender = false;
        break;
      case 'age':
        newUser.birthDate = new Date(this.newBirthDate);
        this.isModifyingAge = false;
        break;
      case 'weight':
        newUser.weight = this.newWeight;
        this.isModifyingWeight = false;
        break;
      case 'height':
        newUser.height = this.newHeight;
        this.isModifyingHeight = false;
        break;

    }

    this.http.put('/users/' + currUser._id, newUser).subscribe(() => {
      this.user = this.auth.getUser();
      this.showToastModificationConfirmed();
    });

  }

  private showToastModificationConfirmed(){
    new ToastController().create({
      color: 'dark',
      animated: true,
      message: 'Modifica effettuata',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X'
    }).then(t => {
      t.present();
    });
  }

  genderSegmentChanged(event) {
    console.log(event);
    this.newGender = event.target.value;

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

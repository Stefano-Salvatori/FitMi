import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ModalController } from '@ionic/angular';
import { PublicProfileComponent } from '../profile/public/public-profile.component';
import { USERS } from './mock_users';
import { User } from 'src/model/user';
import { serverAddress } from 'src/server-data';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})


export class LeaderboardComponent implements OnInit {

  public isDataAvailable = false;
  users: User[] = [];
  currentUserRank = 0;
  currentUser = USERS[0];
  currentModal: HTMLIonModalElement;

  constructor(private httpClient: HttpClientService,
              private auth: AuthService,
              public modalController: ModalController,
  ) {

  }

  public getLeader(): User {
      return this.users[0];
  }
  async getUsers() {
    this.currentUser = this.auth.getUser();

    await this.httpClient.get<User[]>('/users').subscribe(res => {
      this.users = res.sort((u1, u2) => u2.score - u1.score);
      this.currentUserRank = this.users.map(u => u._id).indexOf(this.currentUser._id) + 1;
      this.isDataAvailable = true;
    });
  }

  ngOnInit() {
    this.getUsers();

  }

  onUserClick(userIndex: number) {

    this.modalController.create({
      component: PublicProfileComponent,
      componentProps: {
        user: this.users[userIndex],
        controller: this
      }
    }).then(modal => {
      modal.present();
      this.currentModal = modal;
    });
  }

  public dismissCurrentModal() {
    this.currentModal.dismiss();
  }

  profileImage(user: User): string {
    if (user) {
      if (user.profileImg !== undefined) {
        return serverAddress + '/images/user_pics/' + user.profileImg;
      } else {
        return user.gender === 'M' ?
          serverAddress + '/images/user_pics/man.svg' :
          serverAddress + '/images/user_pics/girl-1.svg';
      }
    } else {
      return '';
    }

  }

}

import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ModalController } from '@ionic/angular';
import { PublicProfileComponent } from '../profile/public/public-profile.component';
import { USERS } from './mock_users';
import { User } from 'src/model/user';
import { serverAddress } from 'src/server-data';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})


export class LeaderboardComponent implements OnInit {

  users: User[] = USERS.sort((u1, u2) => u2.score - u1.score);
  currentUserRank = 1;
  currentUser = USERS[0];
  currentModal: HTMLIonModalElement;

  constructor(private httpClient: HttpClientService,
              public modalController: ModalController) {

    // currentUser = auth.getUser();
    // httpClient.get<User[]>('/users').subscribe(res =>  this.users = res);
  }

  ngOnInit() {
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
    if (user.profileImg !== undefined) {
      return serverAddress + '/images/user_pics/' + user.profileImg;
    } else {
      return user.gender === 'M' ?
        serverAddress + '/images/user_pics/man.svg' :
        serverAddress + '/images/user_pics/girl-1.svg';
    }
  }

}

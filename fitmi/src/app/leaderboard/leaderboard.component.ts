import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { ModalController } from '@ionic/angular';
import { ProfileComponent } from '../profile/profile.component';
import { USERS } from './mock_users';
import { User } from 'src/model/user';

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
      component: ProfileComponent,
      componentProps: {
        user: this.users[userIndex]
      }
    }).then(modal => {
      modal.present();
      this.currentModal = modal;
    });
  }

}

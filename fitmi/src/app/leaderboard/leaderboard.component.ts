import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { tap } from 'rxjs/operators';
import { USERS, User } from './mock_users';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})


export class LeaderboardComponent implements OnInit {

  private users: User[] = USERS.sort((u1, u2) => u2.fitnessPoints - u1.fitnessPoints);
  private currentUserRank = 8;
  private currentUser = USERS[0];

  constructor(private httpClient: HttpClientService) {

    // httpClient.get<User[]>('/users').subscribe(res =>  this.users = res);
  }

  ngOnInit() {}



}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionDataService } from '../session/session-data.service';
import { SessionType } from 'src/model/session-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  readonly sessionType = SessionType;


  activities: SessionType[] =
    Object.values(SessionType)
    .filter(k => typeof k !== 'function');
    // the filter 'k !=== "function"' is needed to remove SessionType utility functions from the array

  constructor(private router: Router,
              private sessionData: SessionDataService) {
    }

  ngOnInit() {
  }

  startSession(activity: SessionType) {
    this.sessionData.possibleGoal = SessionType.getPossibleGoals(activity);
    this.sessionData.name = SessionType[activity];
    this.router.navigateByUrl(SessionType.getRoute(activity));
  }

  navigateToDeviceConnectionPage() {
    console.log('Device Connection');
    this.router.navigateByUrl('tabs/device-connection');
  }
}

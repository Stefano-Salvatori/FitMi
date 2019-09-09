import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionDataService } from '../session/session-data.service';
import { SessionType } from 'src/model/session-type';
import { ConnectionState, MiBandService } from '../miband/miband.service';

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
 
    public connectionState: ConnectionState = ConnectionState.IDLE;

    // the filter 'k !=== "function"' is needed to remove SessionType utility functions from the array

  constructor(private router: Router,
              private miBand: MiBandService,
              private sessionData: SessionDataService) {

  }


  isBluetoothConnected() {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  async ngOnInit() {
    if (await this.miBand.isConnected()) {
      this.connectionState = ConnectionState.CONNECTED;

    }
  }

  startSession(activity: SessionType) {
    this.sessionData.possibleGoal = SessionType.getPossibleGoals(activity);
    this.sessionData.sessionType = activity;
    this.router.navigateByUrl(SessionType.getRoute(activity));
  }

  navigateToDeviceConnectionPage() {
    this.router.navigateByUrl('tabs/device-connection');
  }
}

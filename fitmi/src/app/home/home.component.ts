import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionDataService } from '../session/session-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private  BASE_ICON_PATH = '../../assets/icon/fit_activities_icons';
  private  ICON_EXTENSION = '.png';
  activities = [
    {
      name: 'Corsa',
      icon: this.BASE_ICON_PATH + '/running' + this.ICON_EXTENSION,
      route: 'running/goal_settings',
      possibleGoal: [true, true, true, true] // time, distance, calories, steps
    },
    {
      name: 'Camminata',
      icon: this.BASE_ICON_PATH + '/walking' + this.ICON_EXTENSION,
      route: 'walking/goal_settings',
      possibleGoal: [true, true, true, true]
    },
    {
      name: 'Ciclismo',
      icon: this.BASE_ICON_PATH + '/bicycle' + this.ICON_EXTENSION,
      route: 'cycling/goal_settings',
      possibleGoal: [true, true, true, false]
    },
    {
      name: 'Palestra',
      icon: this.BASE_ICON_PATH + '/gym' + this.ICON_EXTENSION,
      route: 'gym/goal_settings',
      possibleGoal: [true, false, true, false]
    },
    {
      name: 'Nuoto',
      icon: this.BASE_ICON_PATH + '/swimming' + this.ICON_EXTENSION,
      route: 'swimming/goal_settings',
      possibleGoal: [true, true, true, false]
    },
    {
      name: 'Indoor',
      icon: this.BASE_ICON_PATH + '/training' + this.ICON_EXTENSION,
      route: 'indoor-run/goal_settings',
      possibleGoal: [true, true, true, true]
    }];



  constructor(private router: Router, private sessionData: SessionDataService) { }

  ngOnInit() { }

  startSession(activity: string) {
    var activityData = this.activities.find(a => a.name === activity);
    this.sessionData.possibleGoal = activityData.possibleGoal;
    this.sessionData.name = activityData.name;
    this.router.navigateByUrl(activityData.route);
  }

  navigateToDeviceConnectionPage() {
    console.log("Device Connection");
    this.router.navigateByUrl('tabs/device-connection');
  }
}

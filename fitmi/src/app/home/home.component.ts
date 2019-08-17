import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private  BASE_ICON_PATH = '../../assets/icon/fit_activities_icons';
  private  ICON_EXTENSION = '.png';
  private activities = [
    {
      name: 'Corsa',
      icon: this.BASE_ICON_PATH + '/running' + this.ICON_EXTENSION,
      route: 'running/goal_settings'
    },
    {
      name: 'Camminata',
      icon: this.BASE_ICON_PATH + '/walking' + this.ICON_EXTENSION,
      route: 'walking/goal_settings'
    },
    {
      name: 'Ciclismo',
      icon: this.BASE_ICON_PATH + '/bicycle' + this.ICON_EXTENSION,
      route: 'cycling/goal_settings'
    },
    {
      name: 'Palestra',
      icon: this.BASE_ICON_PATH + '/gym' + this.ICON_EXTENSION,
      route: 'gym/goal_settings'
    },
    {
      name: 'Nuoto',
      icon: this.BASE_ICON_PATH + '/swimming' + this.ICON_EXTENSION,
      route: 'swimming/goal_settings'
    },
    {
      name: 'Indoor',
      icon: this.BASE_ICON_PATH + '/training' + this.ICON_EXTENSION,
      route: 'indoor-run/goal_settings'
    }];



  constructor(private router: Router) { }

  ngOnInit() { }

  startSession(activity: string) {
    this.router.navigateByUrl(this.activities.find(a => a.name === activity).route);
  }

  navigateToDeviceConnectionPage() {
    console.log("Device Connection");
    this.router.navigateByUrl('device-connection');
  }
}

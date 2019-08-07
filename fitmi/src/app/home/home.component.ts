import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private activities = ['Corsa', 'Camminata', 'Ciclismo', 'Palestra', 'Nuoto', 'Corsa Indoor'];
  private activityRoutes = ['running', 'walking', 'cycling', 'gym', 'swimming', 'indoor-run'];
  private baseIconPath = "../../assets/img/";
  private iconExtension = ".png";

  constructor(private router: Router) { }

  ngOnInit() { }

  startSession(activity: string) {
    switch(activity) {
      case this.activities[0]:
        this.router.navigateByUrl(this.activityRoutes[0]);
        break;
      case this.activities[1]:
        this.router.navigateByUrl(this.activityRoutes[1]);
        break;
      case this.activities[2]:
        this.router.navigateByUrl(this.activityRoutes[2]);
        break;
      case this.activities[3]:
        this.router.navigateByUrl(this.activityRoutes[3]);
        break;
      case this.activities[4]:
        this.router.navigateByUrl(this.activityRoutes[4]);
        break;
      case this.activities[5]:
        this.router.navigateByUrl(this.activityRoutes[5]);
        break;
    }
  }

  selectImage(activity: string): string {
    switch(activity) {
      case this.activities[0]:
        return this.baseIconPath + this.activityRoutes[0] + this.iconExtension;
      case this.activities[1]:
        return this.baseIconPath + this.activityRoutes[1] + this.iconExtension;
      case this.activities[2]:
        return this.baseIconPath + this.activityRoutes[2] + this.iconExtension;
      case this.activities[3]:
        return this.baseIconPath + this.activityRoutes[3] + this.iconExtension;
      case this.activities[4]:
        return this.baseIconPath + this.activityRoutes[4] + this.iconExtension;
      case this.activities[5]:
        return this.baseIconPath + this.activityRoutes[5] + this.iconExtension;
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  private activities = [
    { name: 'Corsa',
      icon: 'assets/icon/fit_activities_icons/running.png'
    },
    {
      name: 'Camminata',
      icon: 'assets/icon/fit_activities_icons/walking.png'
    },
    {
      name: 'Ciclismo',
      icon: 'assets/icon/fit_activities_icons/bicycle.png'
    },
    {
      name: 'Palestra',
      icon: 'assets/icon/fit_activities_icons/gym.png'
    },
    {
      name: 'Nuoto',
      icon: 'assets/icon/fit_activities_icons/swimming.png'
    },
    {
      name: 'Indoor',
      icon: 'assets/icon/fit_activities_icons/training.png'
    }];


  constructor() { }

  ngOnInit() {
  }

}

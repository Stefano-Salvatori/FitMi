import { Component, OnInit } from '@angular/core';
import { PedometerData } from '../miband/pedometer-data';


@Component({
  selector: 'app-home',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

/*class FitnessSession {
  type: string;
  date: Date;
  heartRate: Array<[Date, number]>;
  pedometerData: PedometerData;
}*/


export class StatisticsComponent implements OnInit {

  /*lastSession: FitnessSession;*/
  constructor() {

  }

  ngOnInit() {

  }

  segmentChanged(event){

  }

}

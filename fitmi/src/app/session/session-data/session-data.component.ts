import { Component, OnInit, NgZone, OnDestroy, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SessionDataService } from '../session-data.service';
import { LineChartService } from 'src/app/data-visualization/line-chart/line-chart.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-session-data',
  templateUrl: './session-data.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./session-data.component.scss'],
})
export class SessionDataComponent implements OnInit, OnDestroy {

  private chrono: NodeJS.Timer;
  elapsedSec = 0;
  elapsedMin = 0;
  elapsedHour = 0;

  steps = 0;
  distance = 0;
  calories = 0;
  currHeartbeat: number;
  minHeartbeat: number;
  maxHeartbeat: number;
  private heartRateLineChart: LineChartService;


  constructor(private session: SessionDataService, private ngZone: NgZone) {




    /*this.heartRateLineChart.setup('#heartRateLineChart');
    this.heartRateLineChart.populate([]);*/


  }

  private getRandom(min, max): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  ngOnDestroy() {
    // this.miBand.unsubscribeHeartRate();
    // this.miBand.stopHeartRateMonitoring();
  }

  async ngOnInit() {
    this.heartRateLineChart = new LineChartService();



    this.heartRateLineChart.setup('#heartRateLineChart');
    this.heartRateLineChart.populate([]);


    this.startChrono();

    this.heartRateLineChart = new LineChartService();



    this.heartRateLineChart.setup('#heartRateLineChart');
    this.heartRateLineChart.populate([]);


    this.session.heartRateObservable
      .subscribe(hrv => {
        this.ngZone.run(() => {
          this.setHeartbeat(hrv.value);
          this.heartRateLineChart.pushDynamic([new Date(), hrv.value]);
        });
      });


    this.session.pedometerDataObservable()
      .subscribe(newStats => {
        this.setDistance(newStats.distance);
        this.setCalories(newStats.calories);
        this.setSteps(newStats.steps);
      });
  }

  private startChrono() {
    this.elapsedSec = 0;
    this.elapsedMin = 0;
    this.elapsedHour = 0;
    this.chrono = setInterval(() => {
      this.elapsedSec = (this.elapsedSec + 1) % 60;
      if (this.elapsedSec === 0) {
        this.elapsedMin = (this.elapsedMin + 1) % 60;
        if (this.elapsedMin === 0) {
          this.elapsedHour++;
        }
      }
    }, 1000);
  }

  private stopChrono() {
    clearInterval(this.chrono);

  }

  private setSteps(newSteps: number) {
    this.steps = newSteps;
  }

  private setDistance(newDistance: number) {
    this.distance = newDistance;
  }

  private setCalories(newCalories: number) {
    this.calories = newCalories;
  }

  private setHeartbeat(newHeartbeat: number) {
    this.currHeartbeat = newHeartbeat;
    if (this.minHeartbeat === undefined) {
      this.minHeartbeat = this.currHeartbeat;
    } else {
      this.minHeartbeat = Math.min(this.currHeartbeat, this.minHeartbeat);
    }

    if (this.maxHeartbeat === undefined) {
      this.maxHeartbeat = this.currHeartbeat;
    } else {
      this.maxHeartbeat = Math.max(this.currHeartbeat, this.maxHeartbeat);
    }
  }
}

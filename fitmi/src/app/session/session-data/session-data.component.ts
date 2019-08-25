import { Component, OnInit, NgZone, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MiBandService } from 'src/app/miband/miband.service';
import { SessionDataService } from '../session-data.service';

@Component({
  selector: 'app-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: ['./session-data.component.scss'],
})
export class SessionDataComponent implements OnInit, OnDestroy {

  private chrono: NodeJS.Timer;
  elapsedSec: number = 0;
  elapsedMin: number = 0;
  elapsedHour: number = 0;

  steps: number = 0;
  distance: number = 0;
  calories: number = 0;
  currHeartbeat: number;
  minHeartbeat: number;
  maxHeartbeat: number;


  constructor(private session: SessionDataService,
    private ngZone: NgZone) {
  }

  ngOnDestroy() {
    //this.miBand.unsubscribeHeartRate();
    //this.miBand.stopHeartRateMonitoring();
  }

  async ngOnInit() {
    this.startChrono();

    this.session.heartRateObservable
      .subscribe(hrv => this.ngZone.run(() => this.setHeartbeat(hrv)));


    this.session.pedometerDataObservable()
      .subscribe(newStats => {
        this.setDistance(newStats.distance);
        this.setCalories(newStats.calories);
        this.setSteps(newStats.steps);
      })
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
    if (this.minHeartbeat == undefined) {
      this.minHeartbeat = this.currHeartbeat;
    } else {
      this.minHeartbeat = Math.min(this.currHeartbeat, this.minHeartbeat);
    }

    if (this.maxHeartbeat == undefined) {
      this.maxHeartbeat = this.currHeartbeat
    } else {
      this.maxHeartbeat = Math.max(this.currHeartbeat, this.maxHeartbeat);
    }
  }
}

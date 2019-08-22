import { Component, OnInit, NgZone, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MiBandService } from 'src/app/miband/miband.service';
import { SessionDataService } from '../session-data.service';

@Component({
  selector: 'app-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: ['./session-data.component.scss'],
})
export class SessionDataComponent implements OnInit, OnDestroy {

  private chrono;
  private elapsedSec: number = 0;
  private elapsedMin: number = 0;
  private elapsedHour: number = 0;

  private steps: number = 0;
  private distance: number = 0;
  private calories: number = 0;
  private currHeartbeat: number = 70;
  private minHeartbeat: number = 60;
  private maxHeartbeat: number = 100;


  constructor(private session: SessionDataService,
    private ngZone: NgZone) {
  }

  ngOnDestroy() {
    //this.miBand.unsubscribeHeartRate();
    //this.miBand.stopHeartRateMonitoring();
  }

  async ngOnInit() {
    this.startChrono();
    //await this.miBand.findMiBand();

    this.session.heartRateObservable()
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
    this.minHeartbeat = Math.min(this.currHeartbeat, this.minHeartbeat);
    this.maxHeartbeat = Math.max(this.currHeartbeat, this.maxHeartbeat);
  }
}

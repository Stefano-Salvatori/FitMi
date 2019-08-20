import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: ['./session-data.component.scss'],
})
export class SessionDataComponent implements OnInit {

  private chrono;
  private elapsedSec: number = 0;
  private elapsedMin: number = 0;
  private elapsedHour: number = 0;

  private distance: number = 0;
  private calories: number = 0;
  private currHeartbeat: number = 70;
  private minHeartbeat: number = 60;
  private maxHeartbeat: number = 100;

  constructor() {
  }

  ngOnInit() {
    this.setupChrono();
  }

  setupChrono() {
    this.elapsedSec = 0;
    this.elapsedMin = 0;
    this.elapsedHour = 0;
    this.chrono = setInterval(() => {
      this.elapsedSec += 1;
      if (this.elapsedSec === 60) {
        this.elapsedSec = 0;
        this.elapsedMin += 1;
        if (this.elapsedMin === 60) {
          this.elapsedMin = 0;
          this.elapsedHour += 1;
        }
      }
    }, 1000);
  }

  stopChrono() {

  }

  setDistance(newDistance: number) {
    this.distance = newDistance;
  }

  setCalories(newCalories: number) {
    this.calories = newCalories;
  }

  setHeartbeat(newHeartbeat: number) {
    this.currHeartbeat = newHeartbeat;
    this.minHeartbeat = Math.min(this.currHeartbeat, this.minHeartbeat);
    this.maxHeartbeat = Math.max(this.currHeartbeat, this.maxHeartbeat);
  }
}

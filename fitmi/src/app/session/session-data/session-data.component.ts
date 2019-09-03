import { OnInit, NgZone, OnDestroy, Output, EventEmitter, Component, ViewEncapsulation } from '@angular/core';
import { SessionDataService } from '../session-data.service';
import { LineChartService } from 'src/app/data-visualization/line-chart/line-chart.service';
import { AlertController } from '@ionic/angular';
import { ActivityChecker } from './ActivityChecker';
import { interval } from 'rxjs';

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
  currHeartbeat = 0;
  minHeartbeat = 500;
  maxHeartbeat = 0;
  private heartRateLineChart: LineChartService;
  private activityChecker: ActivityChecker;

  constructor(private session: SessionDataService, private ngZone: NgZone, private alertController: AlertController) {
    this.activityChecker = new ActivityChecker(5000);
    this.activityChecker.onNoActivityObserved(() => {
      this.session.makeBandVibrate();
      this.presentAlert();
    });
  }

  private async presentAlert() {
    this.activityChecker.pause();
    const alert = await this.alertController.create({
      header: 'Attenzione',
      subHeader: 'Battiti leggeri',
      message: 'Non ti fermare!',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.activityChecker.play();
        }
      }]
    });

    await alert.present();
  }
  ngOnDestroy() {

  }

  async ngOnInit() {


    this.startChrono();

    this.heartRateLineChart = new LineChartService();
    this.heartRateLineChart.setup('#heartRateLineChart');
    this.heartRateLineChart.populate([]);


    this.session.heartRateObservable
      .subscribe(hrv => {
        this.ngZone.run(() => {
          this.setHeartbeat(hrv.value);
          this.activityChecker.updateHeartRate(hrv);
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
    if (this.minHeartbeat === 0) {
      this.minHeartbeat = this.currHeartbeat;
    } else {
      this.minHeartbeat = Math.min(this.currHeartbeat, this.minHeartbeat);
    }

    if (this.maxHeartbeat === 0) {
      this.maxHeartbeat = this.currHeartbeat;
    } else {
      this.maxHeartbeat = Math.max(this.currHeartbeat, this.maxHeartbeat);
    }
  }
}

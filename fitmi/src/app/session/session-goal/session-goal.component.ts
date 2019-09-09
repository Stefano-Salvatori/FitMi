import { Component, OnInit, ViewChild, NgZone, AfterViewInit } from '@angular/core';
import { CircleProgressComponent } from 'ng-circle-progress';
import { SessionDataService } from '../session-data.service';
import { Goal, GoalType } from '../../../model/goal';

@Component({
  selector: 'app-session-goal',
  templateUrl: './session-goal.component.html',
  styleUrls: ['./session-goal.component.scss'],
})
export class SessionGoalComponent implements OnInit, AfterViewInit {

  @ViewChild(CircleProgressComponent, { static: false }) progress!: CircleProgressComponent;

  private goal: Goal = new Goal(GoalType.TIME, 0);

  constructor(private sessionData: SessionDataService) {
    this.goal = this.sessionData.currentGoal;
    console.log(this.goal);
  }

  ngOnInit() {

  }


  async ngAfterViewInit() {
    this.progress.units = this.goal.unit;
    this.progress.title = '0/' + this.goal.threshold;

    this.progress.render();
    this.progress.draw(this.progress.percent);

    const step = 100 / this.goal.threshold;

    switch (this.goal.type) {
      case GoalType.TIME:
        setInterval(() => this.updateProgressBar(step), 60000);
        break;
      case GoalType.STEPS:
        let previousSteps = 0;
        this.sessionData.pedometerDataObservable()
          .subscribe(pedometerData => {
            this.updateProgressBar((pedometerData.steps - previousSteps) * step);
            previousSteps = pedometerData.steps;
          });
        break;
      case GoalType.DISTANCE:
        let previousDistance = 0;
        this.sessionData.pedometerDataObservable()
          .subscribe(pedometerData => {
            this.updateProgressBar((pedometerData.distance - previousDistance) * step);
            previousDistance = pedometerData.distance;
          });
        break;
      case GoalType.CALORIES:
        let previousCalories = 0;
        this.sessionData.pedometerDataObservable()
          .subscribe(pedometerData => {
            this.updateProgressBar((pedometerData.calories - previousCalories) * step);
            previousCalories = pedometerData.calories;
          });
        break;

      default: break;

    }

  }

  private updateProgressBar(value: number) {
    const previousPrecent = this.progress.percent;
    this.progress.percent += value;
    const step = 100 / this.goal.threshold;
    this.progress.title = '' + (this.progress.percent / step).toFixed(0) + '/' + this.goal.threshold;
    this.progress.render();
    // this.progress.animate(previousPrecent, this.progress.percent);
  }
}

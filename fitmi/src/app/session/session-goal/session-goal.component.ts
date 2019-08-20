import { Component, OnInit, ViewChild } from '@angular/core';
import { CircleProgressComponent } from 'ng-circle-progress';
import  { SessionDataService } from '../session-data.service';
import { Goal } from '../goal';

@Component({
  selector: 'app-session-goal',
  templateUrl: './session-goal.component.html',
  styleUrls: ['./session-goal.component.scss'],
})
export class SessionGoalComponent implements OnInit {

  @ViewChild(CircleProgressComponent, {static: false}) progress!: CircleProgressComponent;

  private goal: Goal = new Goal("", 0);

  constructor(private sessionData: SessionDataService) {
    this.sessionData.currentGoal.subscribe(g => console.log(g));
  }

  ngOnInit() {
  }


  ngAfterViewInit() { }
}

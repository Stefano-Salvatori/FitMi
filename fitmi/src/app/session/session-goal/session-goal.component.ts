import { Component, OnInit, ViewChild } from '@angular/core';
import { CircleProgressComponent } from 'ng-circle-progress';
import  { GoalBufferService } from '../goal-settings/goal-buffer.service';
import { Goal } from '../goal-settings/goal';

@Component({
  selector: 'app-session-goal',
  templateUrl: './session-goal.component.html',
  styleUrls: ['./session-goal.component.scss'],
})
export class SessionGoalComponent implements OnInit {

  @ViewChild(CircleProgressComponent, {static: false}) progress!: CircleProgressComponent;

  private goal: Goal = new Goal("", 0);

  constructor(private goalBuffer: GoalBufferService) {
    this.goalBuffer.currentMessage.subscribe(m => console.log(m));
  }

  ngOnInit() {
  }


  ngAfterViewInit() { }
}

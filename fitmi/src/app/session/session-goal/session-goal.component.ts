import { Component, OnInit, ViewChild } from '@angular/core';
import { CircleProgressComponent } from 'ng-circle-progress';

@Component({
  selector: 'app-session-goal',
  templateUrl: './session-goal.component.html',
  styleUrls: ['./session-goal.component.scss'],
})
export class SessionGoalComponent implements OnInit {

  @ViewChild(CircleProgressComponent, {static: false}) progress!: CircleProgressComponent;

  constructor() { }

  ngOnInit() {}


  ngAfterViewInit() {
    this.progress.animate(0, 75);
  }
}

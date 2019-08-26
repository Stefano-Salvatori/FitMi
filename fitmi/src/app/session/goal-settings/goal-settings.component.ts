import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SessionDataService } from '../session-data.service';
import { Goal, GoalType } from '../../../model/goal';

@Component({
  selector: 'app-complete-goal-settings',
  templateUrl: './goal-settings.component.html',
  styleUrls: ['./goal-settings.component.scss'],
})
export class GoalSettingsComponent implements OnInit {

  readonly goalType = GoalType;

  goal: Goal = new Goal(GoalType.TIME, 0);
  possibleGoal: GoalType[];

  title: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private sessionData: SessionDataService) {
    this.possibleGoal = this.sessionData.possibleGoal;
    this.title = this.sessionData.name;
  }

  ngOnInit() { }

  selectUnit(): string {
    return this.goal.unit;
  }

  startSession() {
    this.sessionData.currentGoal = this.goal;
    this.sessionData.startSession();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

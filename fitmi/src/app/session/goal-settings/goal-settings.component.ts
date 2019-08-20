import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';

import  { SessionDataService } from '../session-data.service';
import { Goal } from '../goal';

@Component({
  selector: 'app-complete-goal-settings',
  templateUrl: './goal-settings.component.html',
  styleUrls: ['./goal-settings.component.scss'],
})
export class GoalSettingsComponent implements OnInit {

  private goalType = [
    {
      name: "time",
      label: "Tempo",
      unit: "min"
    },
    {
      name: "distance",
      label: "Distanza",
      unit: "km"
    },
    {
      name: "calories",
      label: "Calorie",
      unit: "kCal"
    },
    {
      name: "steps",
      label: "Passi",
      unit: "passi"
    }
  ];

  private goal: Goal = new Goal(this.goalType[0].name, 0);
  private possibleGoal: boolean[];

  private title: string;

  constructor(private router: Router, private route: ActivatedRoute, private sessionData: SessionDataService) {
    this.possibleGoal = this.sessionData.getPossibleGoal();
    this.title = this.sessionData.getName();
  }

  ngOnInit() { }

  selectUnit(): string {
    this.goal.unit = this.goalType.find(goal => goal.name === this.goal.type).unit;
    return this.goal.unit;
  }

  startSession() {
    this.sessionData.setGoal(this.goal);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

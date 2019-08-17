import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-goal-settings',
  templateUrl: './goal-settings.component.html',
  styleUrls: ['./goal-settings.component.scss'],
})
export class GoalSettingsComponent implements OnInit {

  private goals = [
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

  private type: string = this.goals[0].name;
  private goal: number = 0;

  constructor() { }

  ngOnInit() {}

  selectUnit(): string {
    return this.goals.find(goal => goal.name === this.type).unit;
  }

  startSession() {

  }

}

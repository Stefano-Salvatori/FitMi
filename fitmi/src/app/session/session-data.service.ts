import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Goal } from './goal';

@Injectable({
  providedIn: 'root'
})
export class SessionDataService {

  private currentGoalSource = new BehaviorSubject(new Goal("", 0));
  currentGoal = this.currentGoalSource.asObservable();

  private possibleGoal: boolean[] = [true, true, true, true];
  private name: string = "";

  constructor() { }

  setGoal(message: Goal) {
    this.currentGoalSource.next(message);
  }

  setPossibleGoal(possibleGoal: boolean[]) {
    this.possibleGoal = possibleGoal;
  }

  getPossibleGoal(): boolean[] {
    return this.possibleGoal;
  }

  setName(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}

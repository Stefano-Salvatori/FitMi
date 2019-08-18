import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Goal } from './goal';

@Injectable({
  providedIn: 'root'
})
export class GoalBufferService {

  private messageSource = new BehaviorSubject(new Goal("", 0));
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: Goal) {
    this.messageSource.next(message)
    console.log(message);
  }
}

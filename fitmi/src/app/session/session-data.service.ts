import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal, GoalType } from './goal';
import { MiBandService } from '../miband/miband.service';
import { PedometerData } from '../miband/pedometer-data';

@Injectable({
  providedIn: 'root'
})
/**
 * Contains all the information about the current session.
 * In particular this is used to setup the goal of the session and to retrieve all the information from the smart band (current steps, calories, distance, heart rate...)
 */
export class SessionDataService {
  //Polling frequency for pedometer data
  private static readonly POLLING_FREQ = 1000; //ms

  private currentGoalSource = new BehaviorSubject(new Goal(GoalType.TIME, 0));
  private _currentGoal = this.currentGoalSource.asObservable();

  private pedometerData = new BehaviorSubject<PedometerData>(new PedometerData());
  private pedometerDataTimer;

  private _possibleGoal: boolean[] = [true, true, true, true];// time, distance, calories, steps
  private _name: string = "";

  constructor(private miBand: MiBandService) {
    this.miBand.findMiBand().then(() => {

      this.pedometerDataTimer = setInterval(async () => {
        this.pedometerData.next(await this.miBand.getPedometerData());
      }, SessionDataService.POLLING_FREQ)
    })
  }

  startSession(): void {
    this.miBand.startHeartRateMonitoring();
  }

  stopSession(): void {
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    clearInterval(this.pedometerDataTimer);
  }

  heartRateObservable(): Observable<number> {
    return this.miBand.subscribeHeartRate();
  }

  pedometerDataObservable(): Observable<PedometerData>{
    return this.pedometerData.asObservable();
  }


  get currentGoal(): Goal {
    return this.currentGoalSource.getValue();
  }

  set currentGoal(goal: Goal) {
    this.currentGoalSource.next(goal);
  }

  set possibleGoal(possibleGoal: boolean[]) {
    this._possibleGoal = possibleGoal;
  }

  get possibleGoal(): boolean[] {
    return this._possibleGoal;
  }

  set name(value: string) {
    this._name = value;
  }

  get name() {
    return this._name;
  }

}

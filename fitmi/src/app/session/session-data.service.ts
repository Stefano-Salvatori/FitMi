import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal, GoalType } from '../../model/goal';
import { MiBandService } from '../miband/miband.service';
import { PedometerData } from '../miband/pedometer-data';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session, HeartRateValue } from 'src/model/session';
import { SessionType } from 'src/model/session-type';

@Injectable({
  providedIn: 'root'
})
// tslint:disable: variable-name


/**
 * Contains all the information about the current session.
 * In particular this is used to setup the goal of the session and to retrieve all the
 * information from the smart band (current steps, calories, distance, heart rate...)
 */
export class SessionDataService {
  // Polling frequency for pedometer data
  private static readonly POLLING_FREQ = 1000; // ms

  private currentGoalSource = new BehaviorSubject(new Goal(GoalType.TIME, 0));
  private _currentGoal = this.currentGoalSource.asObservable();

  private pedometerData = new BehaviorSubject<PedometerData>(new PedometerData());
  private pedometerDataTimer;

  private _heartRateObservable: Observable<number> = new Observable();
  private heartRateFreq: HeartRateValue[] = [];

  private _possibleGoal: GoalType[] =
    Object.values(GoalType).filter(k => typeof k !== 'function');


  private _name = '';

  private _start: Date;
  private _end: Date;


  constructor(private miBand: MiBandService,
              private http: HttpClientService,
              private auth: AuthService) {

  }

  async startSession() {
    this._start = new Date();
    await this.miBand.findMiBand();
    this.miBand.startHeartRateMonitoring();
    this._heartRateObservable = this.miBand.subscribeHeartRate();
    this._heartRateObservable.subscribe(hr => {
      this.heartRateFreq.push({
        timestamp: new Date(),
        value: hr
      });
    });

    this.pedometerDataTimer = setInterval(async () => {
      this.pedometerData.next(await this.miBand.getPedometerData());
    }, SessionDataService.POLLING_FREQ);

  }

  stopSession(): void {
    this._end = new Date();
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    clearInterval(this.pedometerDataTimer);

    const currentUser = this.auth.getUser();
    const session: Session = {
      start: this._start,
      end: this._end,
      type: SessionType[this.name],
      calories: this.pedometerData.getValue().calories,
      distance: this.pedometerData.getValue().distance,
      steps: this.pedometerData.getValue().steps,
      heart_frequency: this.heartRateFreq
    };

    this.http.post('/users/' + currentUser._id + '/sessions', session)
      .subscribe(res => {
        console.log(res);
        console.log(session + ' saved');
      });

  }

  get heartRateObservable(): Observable<number> {
    return this._heartRateObservable;
  }

  pedometerDataObservable(): Observable<PedometerData> {
    return this.pedometerData.asObservable();
  }

  readPedometerData(): Promise<PedometerData> {
    return this.miBand.getPedometerData();

  }


  get currentGoal(): Goal {
    return this.currentGoalSource.getValue();
  }

  set currentGoal(goal: Goal) {
    this.currentGoalSource.next(goal);
  }

  set possibleGoal(possibleGoal: GoalType[]) {
    this._possibleGoal = possibleGoal;
  }

  get possibleGoal(): GoalType[] {
    return this._possibleGoal;
  }

  set name(value: string) {
    this._name = value;
  }

  get name() {
    return this._name;
  }

  get startTime() {
    return this._start;
  }

  get endTime() {
    return this._end;
  }

}

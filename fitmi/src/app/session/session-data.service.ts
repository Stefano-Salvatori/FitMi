import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal, GoalType } from '../../model/goal';
import { MiBandService } from '../miband/miband.service';
import { PedometerData } from '../miband/pedometer-data';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session, HeartRateValue } from 'src/model/session';
import { SessionType } from 'src/model/session-type';
import { publishReplay, refCount } from 'rxjs/operators';

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
  private static readonly POLLING_FREQ = 500; // ms

  private currentGoalSource = new BehaviorSubject(new Goal(GoalType.TIME, 0));
  private _currentGoal = this.currentGoalSource.asObservable();


  private startPedometerData: PedometerData;
  private pedometerData = new BehaviorSubject<PedometerData>(new PedometerData());
  private pedometerDataTimer: NodeJS.Timer;

  private _heartRateObservable = new BehaviorSubject<HeartRateValue>({
    timestamp: new Date(), value: 0
  });
  private heartRateFreq: HeartRateValue[] = [];

  private _possibleGoal: GoalType[] =
    Object.values(GoalType).filter(k => typeof k !== 'function');


  private _sessionType: SessionType;

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
    this.miBand.subscribeHeartRate().subscribe(hr => {
      const newValue = {
        timestamp: new Date(),
        value: hr
      };
      this.heartRateFreq.push(newValue);
      this._heartRateObservable.next(newValue);
    });

    this.startPedometerData = await this.miBand.getPedometerData();
    this.pedometerDataTimer = setInterval(async () => {
      const nextPedometerData = await this.miBand.getPedometerData();
      this.pedometerData.next({
        calories: nextPedometerData.calories - this.startPedometerData.calories,
        distance: nextPedometerData.distance - this.startPedometerData.distance,
        steps: nextPedometerData.steps - this.startPedometerData.steps,
      });
    }, SessionDataService.POLLING_FREQ);

  }

  stopSession(): void {
    this._end = new Date();
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    clearInterval(this.pedometerDataTimer);
    this.saveCurrentSession();
  }

  get heartRateObservable(): Observable<HeartRateValue> {
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

  set sessionType(value: SessionType) {
    this._sessionType = value;
  }

  get sessionType() {
    return this._sessionType;
  }

  get startTime() {
    return this._start;
  }

  get endTime() {
    return this._end;
  }

  private saveCurrentSession(): void {
    const currentUser = this.auth.getUser();
    const session: Session = {
      start: this._start,
      end: this._end,
      type: this._sessionType,
      calories: this.pedometerData.getValue().calories,
      distance: this.pedometerData.getValue().distance,
      steps: this.pedometerData.getValue().steps,
      heart_frequency: this.heartRateFreq
    };

    this.http.post('/users/' + currentUser._id + '/sessions', session)
      .subscribe(res => {
        console.log(res);
      });
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal, GoalType } from '../../model/goal';
import { MiBandService } from '../miband/miband.service';
import { PedometerData } from '../miband/pedometer-data';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session, HeartRateValue } from 'src/model/session';
import { SessionType } from 'src/model/session-type';
import { BadgeService } from '../badge.service';
import { SessionBadge, GlobalBadge } from 'src/model/badge';

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

  private _possibleGoal: GoalType[] =
    Object.values(GoalType).filter(k => typeof k !== 'function');

  private currentSession: Session = {
    start: new Date(),
    end: new Date(),
    type: SessionType.RUN,
    pedometer: new PedometerData(),
    heart_frequency: []
  };

  constructor(private miBand: MiBandService,
              private http: HttpClientService,
              private badgesService: BadgeService,
              private auth: AuthService) {

  }

  async startSession() {
    this.currentSession.start = new Date();
    await this.miBand.findMiBand();
    this.miBand.startHeartRateMonitoring();
    this.miBand.subscribeHeartRate().subscribe(hr => {
      const newValue = {
        timestamp: new Date(),
        value: hr
      };
      this.currentSession.heart_frequency.push(newValue);
      this._heartRateObservable.next(newValue);
    });

    this.startPedometerData = await this.miBand.getPedometerData();
    this.pedometerDataTimer = setInterval(async () => {
      const nextPedometerData = await this.miBand.getPedometerData();
      const deltaPedometerData = {
        calories: nextPedometerData.calories - this.startPedometerData.calories,
        distance: nextPedometerData.distance - this.startPedometerData.distance,
        steps: nextPedometerData.steps - this.startPedometerData.steps,
      };
      this.currentSession.pedometer = deltaPedometerData;
      this.pedometerData.next(deltaPedometerData);
    }, SessionDataService.POLLING_FREQ);

  }

  stopSession(): void {
    this.currentSession.end = new Date();
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    clearInterval(this.pedometerDataTimer);
    this.saveCurrentSession()
      .then(() => this.checkBadges());

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
    this.currentSession.type = value;
  }

  get sessionType() {
    return this.currentSession.type;
  }

  get startTime() {
    return this.currentSession.start;
  }

  get endTime() {
    return this.currentSession.end;
  }

  private saveCurrentSession(): Promise<void> {
    const currentUser = this.auth.getUser();
    return new Promise((resolve, reject) => {
      this.http.post('/users/' + currentUser._id + '/sessions', this.currentSession)
        .subscribe(async res => {
          await this.auth.updateCurrentUser().catch(() => reject());
          resolve();
        }, error => reject());
    });
  }

  private async checkBadges() {
    const currentUser = this.auth.getUser();
    const allBadges = await this.badgesService.allBadges;
    allBadges.forEach(badge => {
      if (!currentUser.badges.includes(badge._id)) {
        if (badge instanceof SessionBadge) {
          if (badge.check(this.currentSession)) {
            currentUser.badges.push(badge._id);
            this.badgesService.newBadge(badge);
            this.http.post('/users/' + currentUser._id + '/badges', badge)
              .subscribe(res => {});
          }
        } else if (badge instanceof GlobalBadge) {
          if (badge.check(currentUser)) {
            currentUser.badges.push(badge._id);
            this.badgesService.newBadge(badge);
            this.http.post('/users/' + currentUser._id + '/badges', badge)
              .subscribe(res => {});
          }
        }
      }
    });
  }
}

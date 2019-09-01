import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Goal, GoalType } from '../../model/goal';
import { MiBandService, Notification } from '../miband/miband.service';
import { PedometerData } from '../miband/pedometer-data';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session, HeartRateValue } from 'src/model/session';
import { SessionType } from 'src/model/session-type';
import { BadgeService } from '../badge.service';
import { SessionBadge, GlobalBadge, Badge } from 'src/model/badge';
import { User } from 'src/model/user';

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
    heart_frequency: [],
    gps_path: []
  };

  constructor(private miBand: MiBandService,
              private http: HttpClientService,
              private badgesService: BadgeService,
              private auth: AuthService) {

  }

  public getFitnessSession() {
    return this.currentSession;
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

  public makeBandVibrate(): void {
    this.miBand.sendNotification(Notification.VIBRATE);
  }

  async stopSession(): Promise<void> {
    this.currentSession.end = new Date();
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    clearInterval(this.pedometerDataTimer);
    await this.saveCurrentSession();
    // Before checking badges we update the user so that we work on statistics up-to-date
    await this.auth.updateCurrentUser();
    await this.checkBadges();
    console.log('badges CHECKED');
    // After checking badges we update the user so that badges can be showed in the application
    await this.auth.updateCurrentUser();

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

  public updateGpsPath(newCoord: Coordinates) {
    this.currentSession.gps_path.push(newCoord);
  }

  private saveCurrentSession(): Promise<void> {
    const currentUser = this.auth.getUser();
    return new Promise((resolve, reject) => {
      this.http.post('/users/' + currentUser._id + '/sessions', this.currentSession)
        .subscribe(res => {
          resolve();
        }, error => reject());
    });
  }

  private async checkBadges(): Promise<void> {
    const currentUser = this.auth.getUser();
    const allBadges = await this.badgesService.allBadges;
    for (const badge of allBadges) {
      if (!currentUser.badges.includes(badge._id)) {
        if (badge instanceof SessionBadge && badge.check(this.currentSession)) {
          await this.addBadgeToUser(badge, currentUser);
        } else if (badge instanceof GlobalBadge && badge.check(currentUser)) {
          await this.addBadgeToUser(badge, currentUser);
        }
      }
    }
  }

  private addBadgeToUser(badge: Badge<any>, user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('/users/' + user._id + '/badges', badge)
        .subscribe(res => {
          this.badgesService.newBadge(badge);
          resolve();
        }, err => reject());
    });
  }
}

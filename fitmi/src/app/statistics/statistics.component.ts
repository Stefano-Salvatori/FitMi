import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { AuthService } from '../auth/auth.service';
import { Session, HeartRateRange } from 'src/model/session';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})


export class StatisticsComponent implements OnInit {
  readonly SessionPeriods = {
    LAST: 'ultima',
    MONTH: 'mese',
    WEEK: 'settimana',
    YEAR: 'anno',
  };
  public isDataAvailable = false;
  public lastSession: Session;
  public allSessions: Session[] = [];
  public timePeriod = this.SessionPeriods.LAST;
  public heartRateData = [];
  public heartRateDataPercent = [];
  public caloriesBarChartData = [];
  private dataPath = '';

  constructor(private router: Router,
              private http: HttpClientService,
              private auth: AuthService) {

    this.dataPath = '/users/' + this.auth.getUser()._id + '/sessions';

    // get sessions data
    this.loadData();
  }

  async loadData() {
    await this.http.get<Session[]>(this.dataPath)
      .toPromise()
      .then(sessions => {

        this.allSessions = sessions;

        // sort by date
        sessions.sort((s1, s2) => {
          const a = new Date(s1.start);
          const b = new Date(s2.start);
          return a > b ? -1 : a < b ? 1 : 0;
        });

        this.lastSession = sessions[0];
        this.heartRateData = this.getHeartRateData();
        this.heartRateDataPercent = this.getHeartRatePercentData();
        this.caloriesBarChartData = this.getCaloriesBarChartData();
        this.isDataAvailable = true;

      })
      .catch(err => {
        console.log('Error occured while retriving sessions');
        console.log(err);
      });
  }

  // return the more freq elem in an array of strings
  private mode(arr: string[]) {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
  }


  private sessionDuration(s: Session): number {
    return Math.abs((new Date(s.end).getTime() - new Date(s.start).getTime()) / 1000);
  }

  private sumOnAllSelectedSessions(mapFunction: (arg0: Session) => number): number {
    const allSessionsInSelectedPeriod = this.getAllSessionsInSelectedPeriod();
    if (allSessionsInSelectedPeriod.length > 0) {
      return allSessionsInSelectedPeriod
        .map(mapFunction)
        .reduce((total, amount) => total + amount);
    } else {
      return 0;
    }

  }

  //#region "Binded Html"
  public getAllSessionsInSelectedPeriod(): Session[] {
    switch (this.timePeriod) {
      case this.SessionPeriods.MONTH:
        return this.allSessions
          .filter(s => new Date(s.start).getFullYear() === new Date().getFullYear())
          .filter(s => new Date(s.start).getMonth() === new Date().getMonth());
      case this.SessionPeriods.WEEK:
        return this.allSessions
          .filter(s => new Date(s.start).getFullYear() === new Date().getFullYear())
          .filter(s => new Date(s.start).getMonth() === new Date().getMonth())
          .filter(s => new Date().getDate() - new Date(s.start).getDate() <= 7);
      case this.SessionPeriods.YEAR:
        return this.allSessions
          .filter(s => new Date(s.start).getFullYear() === new Date().getFullYear());
      default:
        return [];
    }
  }

  public lastSessionDate(): string {
    const date = new Date(this.lastSession.start);
    return date.toLocaleDateString() + ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  public lastSessionDuration() {
    return new Date(this.sessionDuration(this.lastSession) * 1000).toISOString().substr(11, 8);
  }

  public minHeartRate(): number {
    const hfValues = this.lastSession.heart_frequency.map(hf => hf.value);
    return Math.min(...hfValues) === Infinity ? 0 : Math.min(...hfValues);
  }

  public maxHeartRate(): number {
    const hfValues = this.lastSession.heart_frequency.map(hf => hf.value);
    return Math.max(...hfValues) === -Infinity ? 0 : Math.max(...hfValues);
  }

  public favoriteSessionType(): string {
    return this.mode(this.allSessions.map(s => s.type.toString()));
  }

  public allSteps(): number {
    return this.sumOnAllSelectedSessions(s => s.pedometer.steps);
  }

  public allCalories(): number {
    return this.sumOnAllSelectedSessions(s => s.pedometer.calories);
  }

  public allDistance(): number {
    return this.sumOnAllSelectedSessions(s => s.pedometer.distance);
  }

  public wholeTimeSpentOnSessions(): string {
    const totSeconds = this.sumOnAllSelectedSessions(s => this.sessionDuration(s));
    return new Date(totSeconds * 1000).toISOString().substr(11, 8);
  }

  public navigateToHomePage() {
    this.router.navigateByUrl('tabs/home');
  }

  public getHeartRateData(): Array<[Date, number]> {
    const array: Array<[Date, number]> = [];
    if (this.lastSession) {
      this.lastSession.heart_frequency.forEach(hf => {
        array.push([new Date(hf.timestamp), +hf.value]);
      });
    }

    return array;
  }

  private getHeartRateRangeFrequency(values: number[], range: { low: number; high: number }): number {
    return values.filter(val => val > range.low && val <= range.high).length / values.length;
  }

  public getHeartRatePercentData(): Array<[string, number]> {
    if (this.lastSession && this.lastSession.heart_frequency.length > 0) {
      const values = this.lastSession.heart_frequency.map(hr => hr.value);
      const light = this.getHeartRateRangeFrequency(values, HeartRateRange.LIGHT);
      const weightLoss = this.getHeartRateRangeFrequency(values, HeartRateRange.WEIGHT_LOSS);
      const aerobic = this.getHeartRateRangeFrequency(values, HeartRateRange.AEROBIC);
      const anaerobic = this.getHeartRateRangeFrequency(values, HeartRateRange.ANAEROBIC);

      const array: Array<[string, number]> = [
        ['Cardio', weightLoss * 100],
        ['Leggero', light * 100],
        ['Aerobico', aerobic * 100],
        ['Anaerobico', anaerobic * 100],
      ];

      return array;
    } else {
      return [];
    }

  }

  public isToDisplayBarChartData() {
    return this.allSessions.filter(s => s.pedometer.calories > 0).length > 0;
  }

 private groupBy(list, keyGetter): Map<any, any> {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
  }

  public getCaloriesBarChartData(): Array<[Date, number]> {
    const array: Array<[Date, number]> = [];

    const sessionInPeriod = this.getAllSessionsInSelectedPeriod();
    const sessionsGroupedByPeriod = this.groupBy(sessionInPeriod, this.timePeriodSubstringFun());
    for (const kv of sessionsGroupedByPeriod.entries()) {
      const date = new Date(kv[0]);
      const totCalories = kv[1].map(e => e.pedometer.calories).reduce((total, amount) => total + amount);
      array.push([date, +totCalories]);
    }
    /*this.getAllSessionsInSelectedPeriod().forEach(s => {
      array.push([new Date(s.start), +s.pedometer.calories]);
    });*/

    return array;
  }

  private timePeriodSubstringFun(): (arg0: any) => string {
    switch (this.timePeriod) {
      case this.SessionPeriods.MONTH: return s => s.start.substring(0, 10);
      case this.SessionPeriods.WEEK: return s => s.start.substring(0, 10);
      case this.SessionPeriods.YEAR: return s => s.start.substring(0, 7);
      default: return s => s.start.substring(0, 10);
    }
  }

  public caloriesBarChartDateFormat(): string {
    switch (this.timePeriod) {
      case this.SessionPeriods.MONTH: return '%d';
      case this.SessionPeriods.WEEK: return '%d';
      case this.SessionPeriods.YEAR: return '%m-%y';
      default: return '%d-%m-%y';
    }
  }


  //#endregion



  ngOnInit() {


  }

  segmentChanged(event) {
    this.timePeriod = event.detail.value;
  }


}

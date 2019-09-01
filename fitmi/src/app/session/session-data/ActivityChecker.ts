import { Component, ViewEncapsulation } from '@angular/core';
import { HeartRateValue, HeartRateRange } from 'src/model/session';

export class ActivityChecker {
  private timer;
  // tslint:disable-next-line: variable-name
  private _onNoActivityObserved: () => void;
  constructor(private maxNoActivityTime: number) {
  }
  private isInRange(val: number, range: {
    low: number;
    high: number;
  }) {
    return val > range.low && val < range.high;
  }
  public onNoActivityObserved(fun: () => void): void {
    this._onNoActivityObserved = fun;
  }
  public updateHeartRate(newHeartRate: HeartRateValue) {
    if (this.isInRange(newHeartRate.value, HeartRateRange.LIGHT)) {
      this.timer = setTimeout(() => this._onNoActivityObserved, this.maxNoActivityTime);
    } else {
      clearTimeout(this.timer);
    }
  }
}

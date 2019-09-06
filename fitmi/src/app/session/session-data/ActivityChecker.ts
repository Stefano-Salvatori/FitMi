import { HeartRateValue, HeartRateRange } from 'src/model/session';
import { log } from 'util';

export class ActivityChecker {
  private timer;
  // tslint:disable-next-line: variable-name
  private _onNoActivityObserved: () => void;
  private prevHeartRate = Infinity;
  private _pause = false;
  constructor(private maxNoActivityTime: number) {
  }
  private isInRange(val: number, range: {
    low: number;
    high: number;
  }) {
    return val >= range.low && val < range.high;
  }

  public onNoActivityObserved(fun: () => void): void {
    this._onNoActivityObserved = fun;
  }

  public pause() {
    this._pause = true;
  }

  public play() {
    this._pause = false;
  }

  public updateHeartRate(newHeartRate: HeartRateValue) {
    if (!this._pause) {
      const currentLight = this.isInRange(newHeartRate.value, HeartRateRange.LIGHT);
      const prevLight = this.isInRange(this.prevHeartRate, HeartRateRange.LIGHT);
      if (currentLight && !prevLight) {
        this.timer = setTimeout(() => {
          this.prevHeartRate = Infinity;
          this._onNoActivityObserved.call(this);
        }, this.maxNoActivityTime);
      } else if (!currentLight && prevLight) {
        clearTimeout(this.timer);
      }
      this.prevHeartRate = newHeartRate.value;
    }
  }
}

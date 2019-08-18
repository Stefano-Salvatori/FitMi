import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MiBandService, Notification } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-mi-band-test',
  templateUrl: './mi-band-test.component.html',
  styleUrls: ['./mi-band-test.component.scss'],
})
export class MiBandTestComponent implements OnInit, OnDestroy {


  private date: Date;
  private battery: number;
  private steps: number;
  private calories: number;
  private distance: number;

  private heartRate: number;

  private notificationsList: string[] = 
  Object.keys(Notification).filter(key => !isNaN(Number(Notification[key]))); 





  constructor(private miBand: MiBandService,
    private platform: Platform,
    private ble: BluetoothLE,
    private ngZone: NgZone) {
  }

  private notifications() { return Notification; }

  private notification(s: string): Notification {
    return Notification[s]
  }

  private iconOf(notification: string): string{
    return MiBandService.iconOf(notification);
  }

  async ngOnInit() {
    await this.platform.ready();
    this.ble.initialize().subscribe(async () => {
      await this.miBand.findMiBand();

      this.miBand.getTime().then(d => this.date = d)

      this.miBand.getBatteryInfo().then(d => this.battery = d)

      this.miBand.getPedometerStats().then(p => {
        this.steps = p.steps;
        this.calories = p.calories;
        this.distance = p.distance;
      });

      this.miBand.getHeartRate()
        .subscribe(hr => this.ngZone.run(() => this.heartRate = hr),
          () => this.ngZone.run(() => this.heartRate = -1),
          () => this.ngZone.run(() => this.heartRate = 0));
      this.miBand.startHeartRateMonitoring();
    });
  }


  ngOnDestroy(): void {
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
  }

}

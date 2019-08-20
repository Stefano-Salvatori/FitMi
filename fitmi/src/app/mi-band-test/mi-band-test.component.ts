import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MiBandService, Notification } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { Form } from '@angular/forms';

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
  private clickCount: number = 0;
  private serial: string;
  private deviceName: string;

  private hwVersion: string;
  private swVersion: string;




  private notificationsList: string[] =
    Object.keys(Notification).filter(key => !isNaN(Number(Notification[key])));





  constructor(private miBand: MiBandService,
    private platform: Platform,
    private ble: BluetoothLE,
    private ngZone: NgZone) {
  }



  async ngOnInit() {
    await this.platform.ready();
    this.ble.initialize().subscribe(async () => {
      await this.miBand.findMiBand();

      await this.miBand.unsubscribeButtonClick();

      this.miBand.discoverServices().then(device => {
        console.log(device);
      })
      this.miBand.subscribeButtonClick().subscribe(() => {
        this.ngZone.run(() => this.clickCount++)
      })

      this.miBand.getDeviceName()
        .then(s => this.deviceName = s)
        .catch(() => this.deviceName = "unknown");


      this.miBand.getSerial()
        .then(s => this.serial = s)
        .catch(() => this.serial = "unknown");

      this.miBand.getHardwareVersion()
        .then(h => this.hwVersion = h.slice(1))
        .catch(() => this.hwVersion = "unknown");

      this.miBand.getSoftwareVersion()
        .then(s => this.swVersion = s.slice(1))
        .catch(() => this.hwVersion = "unknown");


      this.miBand.getDate().then(d => this.date = d)

      this.miBand.getBatteryInfo().then(d => this.battery = d)

      this.miBand.getPedometerStats().then(p => {
        this.steps = p.steps;
        this.calories = p.calories;
        this.distance = p.distance;
      });

      this.miBand.subscribeHeartRate()
        .subscribe(hr => this.ngZone.run(() => this.heartRate = hr),
          () => this.ngZone.run(() => this.heartRate = -1),
          () => this.ngZone.run(() => this.heartRate = 0));
      this.miBand.startHeartRateMonitoring();

      setTimeout(() => {
        this.miBand.stopHeartRateMonitoring();
      }, 30000);
    });
  }


  ngOnDestroy(): void {
    this.miBand.stopHeartRateMonitoring();
    this.miBand.unsubscribeHeartRate();
    this.miBand.unsubscribeButtonClick();
  }

  private setUserInfo(form) {
    console.log(form);
    this.miBand.setUserInfo(form.value);
  }

  /**
   * Returns the name of the icon to use foreach notification type
   * @param notification 
   */
  private iconOf(notification: string) {
    switch (notification) {
      case Notification[Notification.MESSAGE]:
        return "text";
      case Notification[Notification.OFF]:
        return "power";
      case Notification[Notification.PHONE]:
        return "call";
      case Notification[Notification.VIBRATE]:
        return "notifications";
    }

  }

  private notifications() { return Notification; }

  private notification(s: string): Notification {
    return Notification[s]
  }

}

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MiBandService, Notification } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { Form } from '@angular/forms';
import { PedometerData } from '../miband/pedometer-data';

@Component({
  selector: 'app-mi-band-test',
  templateUrl: './mi-band-test.component.html',
  styleUrls: ['./mi-band-test.component.scss'],
})
export class MiBandTestComponent implements OnInit, OnDestroy {


  date: Date;
  battery: number;
  pedometerData: PedometerData;
  heartRate: number;
  clickCount = 0;
  serial: string;
  deviceName: string;

  hwVersion: string;
  swVersion: string;

  notificationsList: string[] =
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
      });
      this.miBand.subscribeButtonClick().subscribe(() => {
        this.ngZone.run(() => this.clickCount++);
      });

      this.miBand.getDeviceName()
        .then(s => this.deviceName = s)
        .catch(() => this.deviceName = 'unknown');


      this.miBand.getSerial()
        .then(s => this.serial = s)
        .catch(() => this.serial = 'unknown');

      this.miBand.getHardwareVersion()
        .then(h => this.hwVersion = h.slice(1))
        .catch(() => this.hwVersion = 'unknown');

      this.miBand.getSoftwareVersion()
        .then(s => this.swVersion = s.slice(1))
        .catch(() => this.hwVersion = 'unknown');


      this.miBand.getDate().then(d => this.date = d);

      this.miBand.getBatteryInfo().then(d => this.battery = d);

      this.miBand.getPedometerData().then(p => this.pedometerData = p);

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

  setUserInfo(form) {
    console.log(form);
    this.miBand.setUserInfo(form.value);
  }

  /**
   * Returns the name of the icon to use foreach notification type
   * @param notification
   * the notification for which you want the icon
   */
  iconOf(notification: string) {
    switch (notification) {
      case Notification[Notification.MESSAGE]:
        return 'text';
      case Notification[Notification.OFF]:
        return 'power';
      case Notification[Notification.PHONE]:
        return 'call';
      case Notification[Notification.VIBRATE]:
        return 'notifications';
    }

  }

  private notifications() { return Notification; }

  private notification(s: string): Notification {
    return Notification[s];
  }

}

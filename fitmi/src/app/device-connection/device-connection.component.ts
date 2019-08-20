import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MiBandService, ConnectionState, Notification } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-connection',
  templateUrl: './device-connection.component.html',
  styleUrls: ['./device-connection.component.scss'],
})


export class DeviceConnectionComponent implements OnInit {

  private mibandConnection = ''
  private spinnerHidden = false;

  constructor(private miBand: MiBandService,
    private ble: BluetoothLE,
    private platform: Platform,
    private router: Router,
    private ngZone: NgZone) { }



  async ngOnInit() {
    await this.platform.ready();
    this.ble.initialize().subscribe(async () => {
      this.miBand.getConnectionStateObservable()
        .subscribe(connectionState => {
          console.log(connectionState);
          this.ngZone.run(() => this.mibandConnection = connectionState);
        });

      if (!(await this.ble.isEnabled()).isEnabled) {
        this.ble.enable();
      }

      this.miBand.findMiBand()
        .then(() => {
          return this.miBand.connect();
        })
        .then(() => {
          this.hideSpinner();
          this.miBand.sendNotification(Notification.VIBRATE);
          this.router.navigateByUrl("tabs/test");
        })
        .catch(() => this.hideSpinner());
    });
  }


  private hideSpinner() {
    this.spinnerHidden = true

  }

}

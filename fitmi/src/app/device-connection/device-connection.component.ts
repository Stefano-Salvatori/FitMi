import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MiBandService, ConnectionState } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-device-connection',
  templateUrl: './device-connection.component.html',
  styleUrls: ['./device-connection.component.scss'],
})


export class DeviceConnectionComponent implements OnInit, AfterViewInit {

  private mibandConnection = ''

  constructor(private miBand: MiBandService,
    private ble: BluetoothLE,
    private platform: Platform) { }

  async ngAfterViewInit() {
    await this.platform.ready();
    this.ble.initialize().subscribe(async res => {
      this.miBand.getConnectionStateObservable()
      .subscribe(connectionState => {
        console.log(connectionState);
        this.mibandConnection = connectionState;
      });
      await this.miBand.findMiBand();
      await this.miBand.connect();

    });
  }

  ngOnInit() { }

}

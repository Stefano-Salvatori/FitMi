import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { MiBandService, ConnectionState, Notification } from '../miband/miband.service';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-device-connection',
  templateUrl: './device-connection.component.html',
  styleUrls: ['./device-connection.component.scss'],
})


export class DeviceConnectionComponent implements OnInit {

  mibandConnection = '';
  spinnerHidden = false;

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

      await this.miBand.findMiBand();
      this.miBand.connect()
        .then(() => {
          this.hideSpinner();
          this.miBand.sendNotification(Notification.VIBRATE);
          this.router.navigateByUrl('tabs/home').then(s => {
            this.showSuccesfullBluetoothConnectionToast();
          });
        })
        .catch(() => {
          this.hideSpinner();
          this.router.navigateByUrl('tabs/home').then(s => {
            this.showErrorBluetoothConnectionToast();
          });
        });
    });
  }

 onBackButtonClick() {
    this.router.navigateByUrl('tabs/home').then(s => {
      this.showWarningBluetoothConnectionToast();
    });
  }

  private showSuccesfullBluetoothConnectionToast() {
    new ToastController().create({
      color: 'dark',
      animated: true,
      message: 'Smartband Connesso!',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X'
    }).then(t => {
      t.present();
    });
  }

  private showErrorBluetoothConnectionToast() {
    new ToastController().create({
      color: 'danger',
      animated: true,
      message: 'Errore durante la connessione al device',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X'
    }).then(t => {
      t.present();
    });
  }


  private showWarningBluetoothConnectionToast() {
    new ToastController().create({
      color: 'warning',
      animated: true,
      message: 'Connessione non completata',
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'X'
    }).then(t => {
      t.present();
    });
  }
  private hideSpinner() {
    this.spinnerHidden = true;

  }

}

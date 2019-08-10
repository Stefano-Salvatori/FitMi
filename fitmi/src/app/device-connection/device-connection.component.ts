import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-device-connection',
  templateUrl: './device-connection.component.html',
  styleUrls: ['./device-connection.component.scss'],
})


export class DeviceConnectionComponent implements OnInit {

  private mibandConnection = {
    status: 'Searching'
  };
  constructor() {

    setTimeout(() => {
      this.mibandConnection.status = 'Connecting';
      setTimeout(() => {
        this.mibandConnection.status = 'Connected';
      }, 2000);
    }, 2000);
  }

  ngOnInit() {}

}

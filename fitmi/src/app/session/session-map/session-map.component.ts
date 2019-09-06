import { Component, OnInit } from '@angular/core';

import { SessionDataService } from '../session-data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-session-map',
  templateUrl: './session-map.component.html',
  styleUrls: ['./session-map.component.scss'],
})

export class SessionMapComponent implements OnInit {


  constructor(private session: SessionDataService) {
   
  }

  public getGpsPath(): Coordinates[] {
    return this.session.getGpsPath();
  }

  public getCurrentPosition(): Coordinates {
    const path = this.getGpsPath();

    if (path.length > 0) {
      return path[path.length - 1];
    } else {
      return {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: 0,
        longitude: 0,
        speed: 0
      };
    }
  }



  ngOnInit() { }

}


import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SessionDataService } from '../session-data.service';


@Component({
  selector: 'app-session-map',
  templateUrl: './session-map.component.html',
  styleUrls: ['./session-map.component.scss'],
})

export class SessionMapComponent implements OnInit {


  public coordinates: Coordinates[] = [];
  public currentPos: Coordinates = {
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    latitude: 0,
    longitude: 0,
    speed: 0
  };

  constructor(private session: SessionDataService, private geolocation: Geolocation) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentPos = resp.coords;

      // save position each 5s
      interval(5000).subscribe(() => this.saveGeoPosition());


    }).catch((error) => {
     this.onGeoLocationError(error);
    });
  }


  private saveGeoPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.coordinates.push(resp.coords);
      this.session.updateGpsPath(resp.coords);
    }).catch((error) => {
     this.onGeoLocationError(error);
    });
  }

  private onGeoLocationError(error) {
    console.log('Error getting location', error);
  }

  ngOnInit() { }

}


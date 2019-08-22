import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-map',
  templateUrl: './session-map.component.html',
  styleUrls: ['./session-map.component.scss'],
})
export class SessionMapComponent implements OnInit {

  lat: number = 51.678418;
  lng: number = 7.809007;

  constructor() { }

  ngOnInit() {}

}

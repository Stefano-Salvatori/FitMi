import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-map',
  templateUrl: './session-map.component.html',
  styleUrls: ['./session-map.component.scss'],
})
export class SessionMapComponent implements OnInit {

  lat = 51.678418;
  lng = 7.809007;

  constructor() { }

  ngOnInit() {}

}

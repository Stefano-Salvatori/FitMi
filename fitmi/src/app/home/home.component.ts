import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private activities = ['Corsa', 'Camminata', 'Ciclismo', 'Palestra', 'Nuoto', 'Corsa Indoor'];


  constructor() { }

  ngOnInit() {
  }

}

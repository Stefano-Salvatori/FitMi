import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swimming',
  templateUrl: './swimming.component.html',
  styleUrls: ['./swimming.component.scss'],
})
export class SwimmingComponent implements OnInit {

  private title: string = "Nuoto"; 

  constructor() { }

  ngOnInit() {}

}

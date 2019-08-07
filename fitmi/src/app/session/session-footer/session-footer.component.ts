import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-footer',
  templateUrl: './session-footer.component.html',
  styleUrls: ['./session-footer.component.scss'],
})
export class SessionFooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  endSession() {
    console.log("END");  
  }
}

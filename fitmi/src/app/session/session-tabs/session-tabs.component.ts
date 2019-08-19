import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-tabs',
  templateUrl: './session-tabs.component.html',
  styleUrls: ['./session-tabs.component.scss'],
})
export class SessionTabsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }
}

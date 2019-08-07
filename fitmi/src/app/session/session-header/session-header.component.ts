import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-session-header',
  templateUrl: './session-header.component.html',
  styleUrls: ['./session-header.component.scss'],
})
export class SessionHeaderComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {}

}

import { Component, OnInit } from '@angular/core';
import { SessionDataService } from '../session-data.service';

@Component({
  selector: 'app-running-stats',
  templateUrl: './session-stats.component.html',
  styleUrls: ['./session-stats.component.scss'],
})
export class SessionStatsComponent implements OnInit {

  private title: string;

  constructor(private sessionData: SessionDataService) {
    this.title = this.sessionData.getName();
  }

  ngOnInit() {}

}

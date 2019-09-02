import { Component, OnInit, Input } from '@angular/core';
import { Session } from 'src/model/session';

@Component({
  selector: 'app-session-recap',
  templateUrl: './session-recap.component.html',
  styleUrls: ['./session-recap.component.scss'],
})
export class SessionRecapComponent implements OnInit {

  @Input() session: Session;
  @Input() sessionScore: number;
  @Input() controller: any;
  constructor() {
  }


  public sessionDuration(): string {
    const duration = Math.abs((new Date(this.session.end).getTime() - new Date(this.session.start).getTime()));
    return new Date(duration).toISOString().substr(11, 8);
  }

  public dismissPopover() {
    this.controller.dismissPopover();
  }

  ngOnInit() { }

}

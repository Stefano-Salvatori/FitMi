import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionDataService } from '../session-data.service';

@Component({
  selector: 'app-session-footer',
  templateUrl: './session-footer.component.html',
  styleUrls: ['./session-footer.component.scss'],
})
export class SessionFooterComponent implements OnInit {

  constructor(private router: Router,
              private session: SessionDataService) { }

  ngOnInit() {}

  endSession() {
    this.session.stopSession();
    this.router.navigateByUrl('tabs/home');
  }
}

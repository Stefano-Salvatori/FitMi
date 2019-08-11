import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-footer',
  templateUrl: './session-footer.component.html',
  styleUrls: ['./session-footer.component.scss'],
})
export class SessionFooterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  endSession() {
    this.router.navigateByUrl('/tabs');
  }
}

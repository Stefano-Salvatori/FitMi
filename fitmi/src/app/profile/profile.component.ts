import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CircleProgressComponent } from 'ng-circle-progress';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  badges = [0,1,2,3];

  @ViewChild(CircleProgressComponent,{static:false}) progress!: CircleProgressComponent;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.progress.animate(0,85);
  }


  logout() {
    this.auth.logout();
  }

}

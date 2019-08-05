import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  badges = [0,1,2,3];

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

}

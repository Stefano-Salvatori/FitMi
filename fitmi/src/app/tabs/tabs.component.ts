import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BadgeService } from '../badge.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.component.html',
  styleUrls: ['tabs.component.scss']
})
export class TabsComponent {

  badgeNotificationHidden = true;
  badgeNotificationCount = 0;

  constructor(private router: Router,
              private ngZone: NgZone,
              private badgeService: BadgeService) {
    this.badgeService.badgesNotificationEvents.subscribe((newBadge) => {
      this.ngZone.run(() => {
        this.badgeNotificationCount++;
        this.badgeNotificationHidden = false;
      });
    });
  }

  resetBadgeNotificationCount() {
    this.badgeNotificationHidden = true;
    this.badgeNotificationCount = 0;
  }
}

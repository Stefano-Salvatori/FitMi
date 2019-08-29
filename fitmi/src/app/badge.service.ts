import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { Badge, DatabaseBadge, BadgeGoal, BadgeScope, SessionBadge, GlobalBadge } from 'src/model/badge';
import { User } from 'src/model/user';


@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private badgesNotifications = new Subject<any>();

  constructor(private http: HttpClientService) {

  }

  /**
   * Notify all subscribers to badge event that the user has won a new badge.
   */
  newBadge(): void {
    this.badgesNotifications.next();
  }

  get badgesNotificationEvents() {
    return this.badgesNotifications.asObservable();
  }

  get allBadges(): Promise<Badge<any>[]> {
    return new Promise((resolve, reject) => {
      this.http.get('/badges').subscribe((badges: DatabaseBadge[]) => {
        resolve(badges.map(b => {
          switch (b.scope) {
            case BadgeScope.SESSION:
              return new SessionBadge(b);
            case BadgeScope.GLOBAL:
              return new GlobalBadge(b);
            default:
              return new SessionBadge(b);
          }

        }));
      }, err => reject(err));
    });
  }
}

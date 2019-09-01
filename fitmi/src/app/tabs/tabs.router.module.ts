import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/private/profile.component';

import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { DeviceConnectionComponent } from '../device-connection/device-connection.component';
import { MiBandTestComponent } from '../mi-band-test/mi-band-test.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]

      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent,
        canActivate: [AuthGuard]

      },
      {
        path: 'stats',
        component: StatisticsComponent,
        canActivate: [AuthGuard]

      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]

      }]
  },
  {
    path: 'device-connection', component: DeviceConnectionComponent
  },
  {
    path: 'test', component: MiBandTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsComponentRoutingModule { }

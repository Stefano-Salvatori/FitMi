import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { DeviceConnectionComponent } from '../device-connection/device-connection.component';
import { MiBandTestComponent } from '../mi-band-test/mi-band-test.component';

const routes: Routes = [
  {
    path: '', component: TabsComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent
      },
      {
        path: 'stats',
        component: StatisticsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
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

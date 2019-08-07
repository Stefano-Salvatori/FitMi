import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsComponentRoutingModule } from './tabs.router.module';

import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { StatisticsComponent } from '../statistics/statistics.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsComponentRoutingModule,
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [
    TabsComponent,
    HomeComponent,
    LeaderboardComponent,
    StatisticsComponent,
    ProfileComponent,
  ]
})
export class TabsPageModule {}

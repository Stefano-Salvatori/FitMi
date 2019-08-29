import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';

import { TabsComponentRoutingModule } from './tabs.router.module';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/private/profile.component';

import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { DeviceConnectionComponent } from '../device-connection/device-connection.component';
import { MiBandTestComponent } from '../mi-band-test/mi-band-test.component';
import { LineChartComponentModule } from '../data-visualization/line-chart/line-chart.module';
import { BarChartComponentModule } from '../data-visualization/bar-chart/bar-chart.module';
import { ProfileImageComponent } from '../profile/profile-image/profile-image.component';
import { AuthModule } from '../auth/auth.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AuthModule,
    TabsComponentRoutingModule,
    LineChartComponentModule,
    BarChartComponentModule,
    NgCircleProgressModule.forRoot({})
  ],
  declarations: [
    TabsComponent,
    HomeComponent,
    LeaderboardComponent,
    StatisticsComponent,
    ProfileComponent,
    ProfileImageComponent,
    DeviceConnectionComponent,
    MiBandTestComponent,
  ],
  entryComponents: [ProfileImageComponent]
})
export class TabsPageModule {
}

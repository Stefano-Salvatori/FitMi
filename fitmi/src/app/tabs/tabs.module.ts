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
import { HorizontalPercentBarChartComponentModule } from '../data-visualization/horizontal-percent-bar-chart/horizontal-bar-chart.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BadgePopoverComponent } from '../profile/badge-popover/badge-popover.component';
import { PublicProfileComponent } from '../profile/public/public-profile.component';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AuthModule,
    TabsComponentRoutingModule,
    LineChartComponentModule,
    HorizontalPercentBarChartComponentModule,
    BarChartComponentModule,
    NgCircleProgressModule.forRoot({}),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCyiMAitV4caAbSHr26Pumqa5dwHM5zALM'
    }),
  ],
  declarations: [
    TabsComponent,
    HomeComponent,
    LeaderboardComponent,
    StatisticsComponent,
    ProfileComponent,
    ProfileImageComponent,
    BadgePopoverComponent,
    DeviceConnectionComponent,
    MiBandTestComponent,

  ],
  entryComponents: [BadgePopoverComponent, ProfileImageComponent]
})
export class TabsPageModule {
}

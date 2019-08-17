import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { AuthModule } from './auth/auth.module';

import { RunningStatsComponent } from './session/running-stats/running-stats.component';
import { GoalSettingsComponent } from './session/goal-settings/goal-settings.component';
import { SessionHeaderComponent } from './session/session-header/session-header.component';
import { SessionFooterComponent } from './session/session-footer/session-footer.component';
import { SessionDataComponent } from './session/session-data/session-data.component';
import { SessionGoalComponent } from './session/session-goal/session-goal.component';
import { SessionTabsComponent } from './session/session-tabs/session-tabs.component';
import { SessionMapComponent } from './session/session-map/session-map.component';
import { DeviceConnectionComponent } from './device-connection/device-connection.component';
import { MiBandService } from './miband/miband.service';
import { AgmCoreModule } from '@agm/core';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundResourceComponent,
    LoginComponent,
    SignInComponent,
    RunningStatsComponent,
    DeviceConnectionComponent,
    SessionHeaderComponent,
    SessionDataComponent,
    SessionGoalComponent,
    SessionFooterComponent,
    SessionMapComponent,
    SessionTabsComponent,
    GoalSettingsComponent
    ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AuthModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCubnab2Mn3cbhQH3CDWpmHYGgt5iB8MP4'
    }),
    NgCircleProgressModule.forRoot({})
  ],
  providers: [
    MiBandService,
    BluetoothLE,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

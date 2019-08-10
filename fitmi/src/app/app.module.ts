import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { AuthModule } from './auth/auth.module';

import { RunningComponent } from './session/running/running.component';
import { WalkingComponent } from './session/walking/walking.component';
import { CyclingComponent } from './session/cycling/cycling.component';
import { GymComponent } from './session/gym/gym.component';
import { SwimmingComponent } from './session/swimming/swimming.component';
import { IndoorRunComponent } from './session/indoor-run/indoor-run.component';
import { SessionHeaderComponent } from './session/session-header/session-header.component';
import { SessionFooterComponent } from './session/session-footer/session-footer.component';
import { SessionDataComponent } from './session/session-data/session-data.component';
import { SessionGoalComponent } from './session/session-goal/session-goal.component';

import { AgmCoreModule } from '@agm/core';
import { SessionMapComponent } from './session/session-map/session-map.component';
import { DeviceConnectionComponent } from './device-connection/device-connection.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundResourceComponent,
    LoginComponent,
    SignInComponent,
    RunningComponent,
    WalkingComponent,
    CyclingComponent,
    GymComponent,
    SwimmingComponent,
    IndoorRunComponent,
    DeviceConnectionComponent,
    SessionHeaderComponent,
    SessionDataComponent,
    SessionGoalComponent,
    SessionFooterComponent,
    SessionMapComponent
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
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

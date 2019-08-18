import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { TabsComponent } from './tabs/tabs.component';
import { HomeComponent } from './home/home.component';

import { SessionTabsComponent } from './session/session-tabs/session-tabs.component';
import { SessionMapComponent } from './session/session-map/session-map.component';
import { RunningStatsComponent } from './session/running-stats/running-stats.component';
import { CompleteGoalSettingsComponent } from './session/goal-settings/complete-goal-settings/complete-goal-settings.component';

import { DeviceConnectionComponent } from './device-connection/device-connection.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'running/goal_settings', component: CompleteGoalSettingsComponent },
  {
    path: 'running',
    component: SessionTabsComponent,
    children: [
      {
        path: 'stats',
        component: RunningStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
    { path: '**', component: NotFoundResourceComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotFoundResourceComponent } from './not-found-resource/not-found-resource.component';
import { LoginComponent } from './login/login.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { SessionTabsComponent } from './session/session-tabs/session-tabs.component';
import { SessionMapComponent } from './session/session-map/session-map.component';
import { SessionStatsComponent } from './session/session-stats/session-stats.component';
import { GoalSettingsComponent } from './session/goal-settings/goal-settings.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'sign-in', component: SignInComponent },
  {
    path: 'tabs',
    canActivate: [AuthGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'running/goal_settings',
    canActivate: [AuthGuard],
    component: GoalSettingsComponent
  },
  { path: 'walking/goal_settings',
  canActivate: [AuthGuard],
  component: GoalSettingsComponent },
  { path: 'cycling/goal_settings',
  canActivate: [AuthGuard],
  component: GoalSettingsComponent },
  { path: 'gym/goal_settings',
  canActivate: [AuthGuard],
  component: GoalSettingsComponent },
  { path: 'swimming/goal_settings',
  canActivate: [AuthGuard],
  component: GoalSettingsComponent },
  { path: 'indoor-run/goal_settings',
  canActivate: [AuthGuard],
  component: GoalSettingsComponent },
  {
    path: 'running',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
  {
    path: 'walking',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
  {
    path: 'cycling',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
  {
    path: 'gym',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
  {
    path: 'swimming',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
      },
      {
        path: 'map',
        component: SessionMapComponent
      }
    ]
  },
  {
    path: 'indoor-run',
    component: SessionTabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'stats',
        pathMatch: 'full'
      },
      {
        path: 'stats',
        component: SessionStatsComponent
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

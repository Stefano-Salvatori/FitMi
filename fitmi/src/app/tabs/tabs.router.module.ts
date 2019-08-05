import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';

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
        component: HomeComponent
      },
      {
        path: 'stats',
        component: HomeComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsComponentRoutingModule { }

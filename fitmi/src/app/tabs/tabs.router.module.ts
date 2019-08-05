import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';

import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  {
    path: '', component: TabsPage,
    children: [
      { path: 'home', component: HomePage },
      { path: 'leaderboard', component: HomePage },
      { path: 'stats', component: HomePage },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

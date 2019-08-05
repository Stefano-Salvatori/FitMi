import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { ProfileComponent } from '../profile/profile.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
    HomePage,
    ProfileComponent
  ]
})
export class TabsPageModule {}

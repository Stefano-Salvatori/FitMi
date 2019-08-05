import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsComponent } from './tabs.component';
import { HomeComponent } from '../home/home.component';
import { ProfileComponent } from '../profile/profile.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsComponent,
    HomeComponent,
    ProfileComponent
  ]
})
export class TabsPageModule {}

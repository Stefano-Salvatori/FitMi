import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HorizontalPercentBarChartComponent } from './horizontal-bar-chart.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [HorizontalPercentBarChartComponent],
  exports: [
    HorizontalPercentBarChartComponent,
  ]

})
export class HorizontalPercentBarChartComponentModule {}

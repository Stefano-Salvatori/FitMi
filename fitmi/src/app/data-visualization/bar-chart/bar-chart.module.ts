import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BarChartComponent } from './bar-chart.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [BarChartComponent],
  exports: [
    BarChartComponent,
  ]

})
export class BarChartComponentModule {}

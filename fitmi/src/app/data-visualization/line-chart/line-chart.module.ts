import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LineChartComponent } from './line-chart.component';


@NgModule({
  declarations: [LineChartComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    LineChartComponent,
  ]
})
export class LineChartComponentModule {}

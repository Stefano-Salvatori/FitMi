import { Component, ViewEncapsulation } from '@angular/core';
import { LineChartService } from './line-chart.service';


@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss'],

})
export class LineChartComponent  {
  private lineChart: LineChartService;

  constructor() {

    this.lineChart = new LineChartService();
    this.lineChart.setup('lineChart');

  }




}





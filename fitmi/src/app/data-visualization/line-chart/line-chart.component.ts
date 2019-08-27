import { Component, ViewEncapsulation, Input } from '@angular/core';
import { LineChartService } from './line-chart.service';


@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss'],

})
export class LineChartComponent  {
  private lineChart: LineChartService;

  @Input() src = 'assets/testdata.csv';
  @Input() timeFormat = '%d-%b-%y';
  constructor() {

    this.lineChart = new LineChartService();
    this.lineChart.setup('.lineChart');

  }




}





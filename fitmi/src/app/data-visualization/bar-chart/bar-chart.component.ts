import { Component, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';
import { BarChartService } from './bar-chart.service';

@Component({
  selector: 'bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit {


  @Input() src = 'assets/testdata.csv';
  @Input() timeFormat = '%d-%b-%y';
  private barChart: BarChartService;

  constructor() { }


  ngAfterViewInit() {
    this.barChart = new BarChartService();
    this.barChart.setup('.barChart');
    d3.csv(this.src).then(data => {
      const mappedData = data.map(d => [d3.timeParse(this.timeFormat)(d.date), d.close]);
      console.log(mappedData);
      this.barChart.populate(mappedData);

    });
  }

 
}


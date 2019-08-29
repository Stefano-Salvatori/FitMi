import { Component, AfterViewInit, ViewEncapsulation, Input, OnChanges, OnInit } from '@angular/core';
import { BarChartService } from './bar-chart.service';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnChanges, AfterViewInit {


  @Input() src: Array<[Date, number]> = [];
  @Input() xAxisDateFormat = '%d-%m-%y';

  private barChart: BarChartService;

  constructor() { }

  private createGraph() {
    this.barChart = new BarChartService();
    this.barChart.setXAxisTimeFormat(this.xAxisDateFormat);
    this.barChart.setup('#barChart');
    this.barChart.populate(this.src);
  }

  ngOnChanges() {
    if (this.src.length > 0) {
      this.createGraph();
    }

  }
  ngAfterViewInit() {
    this.createGraph();
  }


 
}


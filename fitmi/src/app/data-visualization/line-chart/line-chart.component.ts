import { Component, ViewEncapsulation, Input, OnChanges, OnInit, AfterViewInit } from '@angular/core';
import { LineChartService } from './line-chart.service';


@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart.component.scss'],

})
export class LineChartComponent implements AfterViewInit, OnChanges {
  private lineChart: LineChartService;

  @Input() src: Array<[Date, number]> = [];
  constructor() {

  }

  private createGraph() {
    this.lineChart = new LineChartService();
    this.lineChart.setup('#lineChart');
    this.lineChart.populate(this.src);
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





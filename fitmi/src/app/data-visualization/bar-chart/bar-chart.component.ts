import { Component, AfterViewInit, ViewEncapsulation, Input, OnChanges, OnInit } from '@angular/core';
import { BarChartService } from './bar-chart.service';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements  AfterViewInit, OnChanges {


  @Input() src: Array<[Date, number]> = [];
  @Input() xAxisDateFormat = '%d-%m-%y';
  @Input() scrollable = false;
  private barChart: BarChartService;

  constructor() { }

  private createGraph() {
    this.barChart = new BarChartService()
    .setXAxisTimeFormat(this.xAxisDateFormat)
    .setScrollable(this.scrollable);
    this.barChart.setup('#barChart');
    this.barChart.populate(this.src);
  }

  ngAfterViewInit() {
    this.createGraph();
  }


  ngOnChanges() {
    this.createGraph();
  }
}


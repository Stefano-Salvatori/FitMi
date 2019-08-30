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
  @Input() windowSize: number = 20;
  @Input() xTicks: number = 0;
  @Input() yTicks: number = 10;
  constructor() {

  }

  private createGraph() {
    this.lineChart = new LineChartService()
                        .setDataWindowSize(this.windowSize)
                        .setXTicks(this.xTicks)
                        .setYTicks(this.yTicks);
    this.lineChart.setup('#lineChart');
    this.lineChart.populate(this.src);
  }


  ngOnChanges() {
    this.createGraph();
  }

  ngAfterViewInit() {
    this.createGraph();
  }





}





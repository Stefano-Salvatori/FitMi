import { Component, AfterViewInit, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { HorizontalPercentBarChartService } from './horizontal-percent-bar-chart.service';

@Component({
  selector: 'horizontal-percent-bar-chart',
  templateUrl: './horizontal-percent-bar-chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./horizontal-percent-bar-chart.component.scss'],
})
export class HorizontalPercentBarChartComponent implements AfterViewInit, OnChanges {


  @Input() src: Array<[string, number]> = [];


  private barChart: HorizontalPercentBarChartService;

  constructor() { }

  private createGraph() {
    this.barChart = new HorizontalPercentBarChartService();
    this.barChart.setup('#horizontalPercentBarChart');
    this.barChart.populate(this.src);
  }

  ngOnChanges(){
    this.createGraph();
  }

  ngAfterViewInit() {
    this.createGraph();
  }
}


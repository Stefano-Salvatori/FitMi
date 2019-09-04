import { Injectable } from '@angular/core';
import * as d3 from 'd3';


/**
 * Class to generate a line chart
 */
@Injectable()
export class LineChartService {
  private host: any;
  private margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  private width: number;
  private height: number;
  private xScale: d3.ScaleTime<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private svg: any;
  private xAxis: d3.ScaleTime<number, number>;
  private yAxis: d3.ScaleLinear<number, number>;
  private xTicks: number = 0;
  private yTicks: number = 10;
  private data: { date: Date; close: number; }[];
  private path: any;
  private line: d3.Line<[number, number]>;
  private dataWindowSize: number = 20;
  private x: d3.ScaleTime<number, number>;
  private y: d3.ScaleLinear<number, number>;
  yGridiLines: any;

  constructor() {
    this.data = [];
  }

  public setXTicks(n: number): LineChartService {
    this.xTicks = n;
    return this;
  }
  public setYTicks(n: number): LineChartService {
    this.yTicks = n;
    return this;
  }

  /**
   * Set how many data are visualized in the graph
   * @param n number of data to be visualized
   */
  public setDataWindowSize(n: number): LineChartService {
    this.dataWindowSize = n;
    return this;
  }

  public setup(htmlSelector: string): void {
    this.host = d3.select(htmlSelector);
    this.margin = { top: 20, right: 10, bottom: 0, left: 20 };
    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight / 3 - this.margin.top - this.margin.bottom;
    this.xScale = d3.scaleTime().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);
    this.buildChart();
  }
  public populate(values: Array<[Date, number]>) {
    this.data = values.map(d => {
      return {
        date: d[0],
        close: +d[1]
      };
    });

    const dataWindow = this.data.slice(0, Math.min(this.data.length, this.dataWindowSize));

    this.x = this.xScale.domain(d3.extent(dataWindow, d => d.date));
    this.y = this.yScale.domain([0, d3.max(dataWindow, d => d.close)]);

    // add the Y gridlines
    this.yGridiLines = this.svg.append('g').attr('class', 'grid');
    this.yGridiLines.call(
      d3.axisLeft(this.yScale)
        .ticks(this.yTicks)
        .tickSize(-this.width)
    );


    this.path = this.svg.append('g')
      .attr('clip-path', 'url(#clip)')
      .append('path')
      .datum(dataWindow)
      .attr('class', 'line')
      .attr('d', this.line);


    // Add the X Axis
    this.xAxis = this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .attr('class', 'axisGray')
      .call(d3.axisBottom(this.xScale).ticks(this.xTicks).tickFormat(d3.timeFormat('%d-%m')));

    // Add the Y Axis
    this.yAxis = this.svg.append('g')
      .attr('class', 'axisGray')
      .call(d3.axisLeft(this.yScale).ticks(0));
  }


  /**
   * Add a new data and dynmically update the graph
   * @param newValue the new data to be added
   */
  public pushDynamic(newValue: [Date, number]) {
    const val = { date: newValue[0], close: +newValue[1] };
    this.data.unshift(val);
    const dataWindow = this.data.slice(0, Math.min(this.data.length, this.dataWindowSize));
    this.x = this.xScale.domain(d3.extent(dataWindow, d => d.date));
    this.y = this.yScale.domain([0, 250]);
    this.xAxis.call(d3.axisBottom(this.xScale).ticks(this.xTicks).tickFormat(d3.timeFormat('')));
    this.yAxis.call(d3.axisLeft(this.yScale).ticks(0));
    this.yGridiLines.call(
      d3.axisLeft(this.yScale)
        .ticks(this.yTicks)
        .tickSize(-this.width)
    );
    this.path
      .datum(dataWindow)
      .attr('class', 'line')
      .attr('d', this.line);


  }

  private buildChart() {
    this.host.html('');
    this.line = d3.line()
      .x((d: any) => this.xScale(d.date))
      .y((d: any) => this.yScale(d.close));

    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.svg.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);


  }

}

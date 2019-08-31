import { Injectable } from '@angular/core';
import * as d3 from 'd3';


@Injectable()
export class HorizontalPercentBarChartService {
  private host;
  private svg;
  private margin;
  private width;
  private height;
  private xScale;
  private xAxis: d3.Axis<d3.AxisDomain>;
  private yAxis: d3.Axis<d3.AxisDomain>;


  private y0;
  private barHeight: number;
  private colors: string[] = [];
  private data: any[] = [];

  constructor() {
  }

  public setup(htmlSelector: string): void {
    this.host = d3.select(htmlSelector);
    this.margin = { top: 20, right: 50, bottom: 30, left: 80 };
    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight / 3 - this.margin.top - this.margin.bottom;

    this.barHeight = 35;
    this.buildChart();
  }


  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public setColors(colors: string[]) {
    this.colors = colors;
  }

  private getWithoutDuplicates(array: any[]): any[] {
    const toRet = [];
    array.forEach(a => {
      if (!toRet.includes(a)) {
        toRet.push(a);
      }
    });

    return toRet;
  }
  public populate(values: Array<[string, number]>) {
    this.data = values.map(d => {
      return {
        category: d[0],
        num: +d[1],
        num2: +100
      };
    });

    const categories = this.getWithoutDuplicates(this.data.map(d => d.category));

    categories.forEach(c => this.colors.push(this.getRandomColor()));

    const color = d3.scaleOrdinal().range(['#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    // Creates the yScale
    this.y0 = d3.scaleBand()
      .domain(categories)
      .range([this.height, 0], 0);

    // Defines the y axis styles
    this.yAxis = d3.axisLeft(this.y0);

    // Sets the max for the xScale
    const maxX = d3.max(this.data, d => d.num2);

    // Gets the min for bar labeling
    const minX = d3.min(this.data, d => d.num);

    // Defines the xScale max
    this.xScale.domain([0, maxX]);

    // Appends the y axis
    const yAxisGroup = this.svg.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);

    // Appends the x axis
    const xAxisGroup = this.svg.append('g')
      .attr('class', 'x axis')
      .call(this.xAxis);

    // Binds the data to the bars
   
    const categoryGroup = this.svg.selectAll('.g-category-group')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'g-category-group')
      .attr('transform', d =>  'translate(0,' + this.y0(d.category) + ')');

    // Appends background bar
    const bars2 = categoryGroup.append('rect')
      .attr('width', d => this.xScale(d.num2))
      .attr('height', this.barHeight - 1)
      .attr('class', 'g-num2')
      .attr('transform', 'translate(0,4)');

    // Appends main bar
    const bars = categoryGroup.append('rect')
      .attr('width', d => this.xScale(d.num))
      .attr('height', this.barHeight - 1)
      .attr('class', 'g-num')
      .style('fill',  (d, i) =>  color(i))
      .attr('transform', 'translate(0,4)');

    // Binds data to labels
    const labelGroup = this.svg.selectAll('g-num')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'g-label-group')
      .style('fill', (d, i) => color(i))
      .attr('transform', d => 'translate(0,' + this.y0(d.category) + ')');

    // Appends main bar labels
    const barLabels = labelGroup.append('text')
      .text(d => d.num.toFixed(2) + '%')
      .attr('x', d => {
        if (minX > 32) {
          return this.xScale(d.num) - 37;
        } else {
          return this.xScale(d.num) + 6;
        }
      })
       .style('fill', d => 'none')
      .attr('y', this.y0.bandwidth() / 2)
      .attr('class', 'g-labels');

  }


  private buildChart() {
    this.host.html('');
    // Appends the svg to the chart-container div
    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // Creates the xScale
    this.xScale = d3.scaleLinear()
    .range([0, this.width]);




    // Defines the y axis styles
    this.xAxis = d3.axisBottom(this.xScale)
      .tickFormat((d: string) =>  d + '%')
      .tickSize(this.height);





  }


}

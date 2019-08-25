import { Component, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit {

  private host;
  private svg;
  private margin;
  private width;
  private height;
  private xScale;
  private yScale;
  private marginOverview: { top: number; right: number; bottom: number; left: number; };
  private heightOverview: number;
  private maxLength: number;
  private barWidth: number;
  private numBars: number;
  private isScrollDisplayed: boolean;
  private data: any[];
  private  selectorHeight: number;
  private displayed: d3.ScaleQuantize<number>;

  @Input() src = 'assets/testdata.csv';
  @Input() timeFormat = '%d-%b-%y';
  xAxis: d3.Axis<d3.AxisDomain>;
  yAxis: d3.Axis<d3.AxisDomain>;
  constructor() { }


  ngAfterViewInit() {
    this.host = d3.select('.barChart');
    this.setup();
  }

  private setup(): void {

    this.data = [];

    d3.csv(this.src).then(csv => {
      this.data = csv.map(d => {
        return {
          date: d3.timeParse(this.timeFormat)(d.date),
          label: d3.timeParse(this.timeFormat)(d.date).toDateString(),
          value: +d.close
        };
      });

      this.margin = { top: 20, right: 40, bottom: 30, left: 40 };
      this.width = window.innerWidth  - this.margin.left - this.margin.right;
      this.height = window.innerHeight / 3 - this.margin.top - this.margin.bottom;
      this.marginOverview = { top: 30, right: 10, bottom: 20, left: 40 };
      this.selectorHeight = 40;
      this.heightOverview = 80 - this.marginOverview.top - this.marginOverview.bottom;
      this.maxLength = d3.max(this.data.map(d => d.label.length));
      this.barWidth = this.maxLength * 3 ;
      this.numBars = Math.round(this.width / this.barWidth);
      this.isScrollDisplayed = this.barWidth * this.data.length > this.width;
      this.xScale = d3.scaleBand()
        .domain(this.data.slice(0, this.numBars).map(d => d.date))
        .range([0, this.width]);
      this.yScale = d3.scaleLinear()
        .domain([0, d3.max(this.data, d => d.value)])
        .range([this.height, 0]);
      this.buildChart();

    });
  }

  private buildChart() {
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.svg = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom + this.selectorHeight);

    const diagram = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.xAxisAttr( diagram.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + this.height + ')')
      .call(this.xAxis));

    diagram.append('g')
      .attr('class', 'y axis')
      .call(this.yAxis);

    const bars = diagram.append('g');

    bars.selectAll('rect')
      .data(this.data.slice(0, this.numBars), (d: any) => d.date)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => this.xScale(d.date))
      .attr('y', (d: any) => this.yScale(d.value))
      .attr('width', (this.width / this.data.length) - 5)
      .attr('height', (d: any) => this.height - this.yScale(d.value));


    if (this.isScrollDisplayed) {
       this.displayScrollableOverview(diagram, bars);
    }

  }

  private displayScrollableOverview(diagram, bars) {
    const xOverview = d3.scaleBand()
         .domain(this.data.map(d => d.date))
         .range([0, this.width]);
    const yOverview = d3.scaleLinear()
         .domain(this.yScale.domain())
         .range([this.heightOverview, 0]);
 
    const subBars = diagram.selectAll('.subBar').data(this.data);
 
    subBars.enter().append('rect')
         .classed('subBar', true)
         .attr('height', d => this.heightOverview - yOverview(d.value))
         .attr('width', (this.width / this.data.length) - 5)
         .attr('x', d => xOverview(d.date))
         .attr('y', d => this.height + this.heightOverview + yOverview(d.value));

    this.displayed = d3.scaleQuantize()
         .domain([0, this.width])
         .range(d3.range(this.data.length));
    const rect = diagram.append('rect');
    rect
     .attr('transform', 'translate(0, ' + (this.height + this.margin.bottom) + ')')
     .attr('class', 'mover')
     .attr('x', 0)
     .attr('y', 0)
     .attr('height', this.selectorHeight)
     .attr('width', Math.round(this.numBars * this.width / this.data.length))
     .attr('pointer-events', 'all')
     .attr('cursor', 'ew-resize')
     .call(d3.drag().on('drag', () => {
           // tslint:disable-next-line: radix
           const x = parseInt(rect.attr('x'));
           const nx = x + d3.event.dx;
           // tslint:disable-next-line: radix
           const w = parseInt(rect.attr('width'));
           let f, nf, newData, rects;
 
           if (nx < 0 || nx + w > this.width) { return; }
 
           rect.attr('x', nx);
 
           f = this.displayed(x);
           nf = this.displayed(nx);
 
           if (f === nf) { return; }
 
           newData = this.data.slice(nf, nf + this.numBars);
           this.xScale.domain(newData.map(d => d.date));
           this.xAxisAttr(diagram.select('.x.axis').call(this.xAxis));
 
           rects = bars.selectAll('rect').data(newData, d => d.date);

           rects.attr('x', d => this.xScale(d.date));

           rects.enter().append('rect')
             .attr('class', 'bar')
             .attr('x', d => this.xScale(d.date))
             .attr('y', d => this.yScale(d.value))
             .attr('width', (this.width / this.data.length) - 5)
             .attr('height', d => this.height - this.yScale(d.value));
 
           rects.exit().remove();
         }));
  }

  private xAxisAttr(x) {
    x.call(d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%d-%m')));

  }
}


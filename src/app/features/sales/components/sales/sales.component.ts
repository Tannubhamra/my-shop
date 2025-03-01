import { Component, ElementRef, inject, OnInit, ViewChild, effect } from '@angular/core';
import * as d3 from 'd3';
import { SalesStore } from '../../store/sales.store';

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})

export class SalesComponent implements OnInit {
  @ViewChild('chartContainer', {static : true}) chartContainer!: ElementRef;
  @ViewChild('tooltip', { static: true}) tooltip!:ElementRef

  private store = inject(SalesStore); 

  private svg:any;
  private xScale:any;
  private yScale:any;
  private margin = { top: 30, right: 30, bottom: 50, left: 50 };
  private svgWidth = 600 - this.margin.left - this.margin.right;
  private svgHeight = 400 - this.margin.top - this.margin.bottom;

  constructor(){
    effect(() => {
      const salesData = this.store.salesData();
      if(salesData) {
        this.createSvg();
        this.createBarChart();
      }
    })
  }

  ngOnInit(): void {
    this.store.getSales();
  }

  createSvg() {
    const chartContainer = this.chartContainer.nativeElement;
    d3.select(chartContainer).select('svg').remove(); // Clear previous chart
    
    this.svg = d3.select(chartContainer)
        .append('svg') // Append svg element here
        .attr('width', this.svgWidth + this.margin.left + this.margin.right)
        .attr('height', this.svgHeight + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  createBarChart() {

    interface StackedDatum {
      key: string;
      values: [number, number][]; // An array of [start, end] for each stack in the bar
    }
    const salesData = this.store.salesData();
    if(!salesData) return;

    const categories = Object.keys(salesData.salesByCategory);
    const months = salesData.months;
  
    // Stack the data
    const salesArray = salesData.months.map((month, index) => {
      let obj: { [key: string]: number } = { };
      categories.forEach(category => {
        obj[category] = salesData.salesByCategory[category][index];
      });
      return obj;
    });
        
    const stackedData = d3.stack().keys(categories)(salesArray);

    this.xScale = d3.scaleBand<string>()
      .domain(salesData.months)
      .range([0, this.svgWidth])
      .padding(0.2);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], (d: any) => d[1])!])
      .nice()
      .range([this.svgHeight, 0]);

      console.log(categories);

    // Color Scale
    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(["#ad2c23", "#4f802e", "#4d9294", "#9949a3"]); // Corresponding colors

    // Add X Axis
    this.svg.append("g")
      .attr("transform", `translate(0, ${this.svgHeight})`)
      .call(d3.axisBottom(this.xScale));

    // Add Y Axis
    this.svg.append("g")
      .call(d3.axisLeft(this.yScale));

    // Draw bars (Stacked)
    let barChart = this.svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", (d: { key: string }) => color(d.key))
      .selectAll("rect")
      .data((d: any) => d)
      .enter()
      .append("rect")
      .attr("x", (d: any, i: any) => this.xScale(months[i])) 
      .attr("y", (d: any[]) => this.yScale(d[1])) 
      .attr("height", (d: any[]) => this.yScale(d[0]) - this.yScale(d[1])) 
      .attr("width", this.xScale.bandwidth()); 

      barChart.on('mouseover', (event: any, d: any) => {
        const tooltip = d3.select(this.tooltip.nativeElement);  
        tooltip.transition().duration(200).style('opacity', 1);

       const salesValue = d[1] - d[0];
       const category = (d3.select(event.currentTarget.parentNode).datum() as StackedDatum).key;

        tooltip.html(`${category}: ${salesValue}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => {
        const tooltip = d3.select(this.tooltip.nativeElement);  
        tooltip.transition().duration(200).style('opacity', 0);
      });
      
  }

  

  
}

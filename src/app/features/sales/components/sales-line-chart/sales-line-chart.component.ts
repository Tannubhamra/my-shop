import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { SalesStore } from '../../store/sales.store';
import { salesChart } from '../../interfaces/sales';
import * as d3 from 'd3';

@Component({
  selector: 'app-sales-line-chart',
  imports: [],
  templateUrl: './sales-line-chart.component.html',
  styleUrl: './sales-line-chart.component.scss'
})
export class SalesLineChartComponent implements OnInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('tooltip', {static:true}) tooltip!:ElementRef;

  private store = inject(SalesStore);
  
  private svg: any;
  private margin = { top: 50, right: 30, bottom: 50, left: 50 };
  private width!: number;
  private height = 400 - this.margin.top - this.margin.bottom;
  private containerWidth : number = 0;

  private hiddenCategories: Set<string> = new Set();

  constructor() {
    effect(() => {
      const salesData = this.store.salesData();
      if (salesData) {
        this.createSvg();
        this.drawLineChart(salesData);
      }
    });
  }
  
  ngOnInit(): void {
    this.store.getSales();
    window.addEventListener('resize', this.handleResize)
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    this.createSvg();
    const salesData = this.store.salesData()!;
    this.drawLineChart(salesData);
  }

  createSvg(){
    const chartContainer = this.chartContainer.nativeElement;
    this.containerWidth = chartContainer.clientWidth;
    const containerHeight = 350;

    this.width = this.containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;
    

    d3.select(chartContainer).select('svg').remove(); // Clear previous chart
    
    this.svg = d3.select(chartContainer)
      .append('svg')
      .attr("viewBox", `0 0 ${this.containerWidth} ${containerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr('width', this.width )
      .attr('height', this.height + 100)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  drawLineChart(salesData: salesChart){
    const categories = Object.keys(salesData.salesByCategory)
    .filter(category => category !== "" && category !== null);
    const months = salesData.months;

    const xScale = d3.scalePoint()
      .domain(months)
      .range([0, this.width])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(Object.values(salesData.salesByCategory).flat())!])
      .nice()
      .range([this.height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(categories)
    .range(["#ad2c23", "#4f802e", "#4d9294", "#9949a3"]);

    const tooltip = d3.select(this.tooltip.nativeElement)
                  .style("position", "absolute")
                  .style("background", "white")
                  .style("color","black")
                  .style("padding", "5px")
                  .style("border", "1px solid #ccc")
                  .style("border-radius", "5px")
                  .style("opacity", 0);

    this.svg.append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(d3.axisBottom(xScale));

    this.svg.append("g").call(d3.axisLeft(yScale));

     // Line Generator
     const line = d3.line()
     .x((_, i) => xScale(months[i])!)
     .y((d: any) => yScale(d));

      // Draw lines and circles for each category
    const lines = this.svg.selectAll(".line-group")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "line-group");

    lines.append("path")
    .datum((d:string) => salesData.salesByCategory[d])
    .attr("class", (d: any, i:number) => `line-${categories[i]}`)
    .attr("fill", "none")
    .attr("stroke", (d: any, i:number) => color(categories[i]) as string)
    .attr("stroke-width", 2)
    .attr("d", (d: any) => line(d));

    // Add data points (circles) with tooltips
  categories.forEach((category) => {
    this.svg.selectAll(`.dot-${category}`)
      .data(salesData.salesByCategory[category])
      .enter()
      .append("circle")
      .attr("class", `dot-${category}`)
      .attr("cx", (_: any, i:number) => xScale(months[i])!)
      .attr("cy", (d:number) => yScale(d))
      .attr("r", 5)
      .attr("fill", color(category) as string)
      .on("mouseover", (event:any, d:number) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Category: ${category}<br>Sales: ${d}`)
          .style("left", `${event.pageX + 5}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
  });

   // Add legend
   const legend = this.svg.append("g")
   .attr("transform", `translate(${this.width /4}, ${this.height + 40})`);

  categories.forEach((category, i) => {
   const legendItem = legend.append("g")
     .attr("transform", `translate(${i * 120}, 0)`)
     .style("cursor", "pointer")
     .on('click', () => this.toggleCategory(category))

   legendItem.append("rect")
     .attr("width", 15)
     .attr("height", 15)
     .attr("fill", color(category) as string);

     legendItem.append("text")
     .attr("x", 20)
     .attr("y", 12)
     .style("font-size", "12px")
     .text(category);
  });

  }
  toggleCategory (category: string) {
    if (this.hiddenCategories.has(category)) {
      this.hiddenCategories.delete(category);
    } else {
      this.hiddenCategories.add(category);
    }

    this.svg.selectAll(`.line-${category}`)
    .transition()
    .duration(500)
    .style("opacity", this.hiddenCategories.has(category) ? 0 : 1);

    this.svg.selectAll(`.dot-${category}`)
      .transition()
      .duration(500)
      .style("opacity", this.hiddenCategories.has(category) ? 0 : 1);
  };
}

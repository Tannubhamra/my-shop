import { Component, ElementRef, inject, OnInit, ViewChild, effect, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { SalesStore } from '../../store/sales.store';
import { salesChart } from '../../interfaces/sales';

@Component({
  selector: 'app-sales-bar-chart',
  imports: [],
  templateUrl: './sales-bar-chart.component.html',
  styleUrl: './sales-bar-chart.component.scss'
})

export class SalesComponent implements OnInit , OnDestroy {
  @ViewChild('chartContainer', {static : true}) chartContainer!: ElementRef;
  @ViewChild('tooltip', { static: true}) tooltip!:ElementRef

  private store = inject(SalesStore); 

  private svg:any;
  private xScale:any;
  private yScale:any;
  private margin = { top: 30, right: 30, bottom: 50, left: 50 };
  private svgWidth!: number;
  private svgHeight = 400 - this.margin.top - this.margin.bottom;
  private containerWidth : number = 0;

  private hiddenCategories: Set<string> = new Set();

  constructor(){
    effect(() => {
      const salesData = this.store.salesData();
      if(salesData) {
        this.createSvg();
        this.createBarChart(salesData);
      }
    })
  }

  ngOnInit(): void {
    this.store.getSales();
    window.addEventListener("resize", this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.createSvg();
    this.createBarChart(this.store.getSales()!);
  };

  createSvg() {
    const chartContainer = this.chartContainer.nativeElement;
    this.containerWidth = chartContainer.clientWidth;
    const containerHeight = 350; 

    this.svgWidth = this.containerWidth - this.margin.left - this.margin.right;
    this.svgHeight = containerHeight - this.margin.top - this.margin.bottom;

    d3.select(chartContainer).select('svg').remove(); 
    
    this.svg = d3.select(chartContainer)
        .append('svg') 
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight + 100)
        .attr("viewBox", `0 0 ${this.containerWidth} ${containerHeight}`) 
        .attr("preserveAspectRatio", "xMidYMid meet") 
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
  }

  createBarChart(salesData:salesChart) {

    interface StackedDatum {
      key: string;
      values: [number, number][];
    }

    if(!salesData) return;

    const categories = Object.keys(salesData.salesByCategory);
    const months = salesData.months;

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

    const color = d3.scaleOrdinal()
      .domain(categories)
      .range(["#ad2c23", "#4f802e", "#4d9294", "#9949a3"]);

    this.svg.append("g")
      .attr("transform", `translate(0, ${this.svgHeight})`)
      .call(d3.axisBottom(this.xScale));

    this.svg.append("g")
      .call(d3.axisLeft(this.yScale));

    // Draw bars (Stacked)
    let barChart = this.svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", (d: any) => `bar-group-${d.key}`) 
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
        tooltip.transition().duration(300).style('opacity', 0);
      });

      const legend = this.svg.append("g")
      .attr("transform", `translate(${this.svgWidth /4 }, ${this.svgHeight + 40})`); // Position below chart

      const legendItem = legend.selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d: any, i: number) => `translate(${i * 100}, 0)`)
      .on("click", (_: any, category: any) => this.toggleCategory(category));
      
      // Colored squares
      legendItem.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d: string) => color(d));

      legendItem.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .style("font-size", "12px")
      .text((d: any) => d)
      .style("cursor", "pointer");
  }  
  
  toggleCategory(category: string) {

    if (this.hiddenCategories.has(category)) {
      this.hiddenCategories.delete(category);
    } else {
      this.hiddenCategories.add(category);
    }

    d3.selectAll(`.bar-group-${category}`)
    .transition()
    .duration(500)
    .style("opacity", this.hiddenCategories.has(category) ? 0 : 1)
    .attr("height", (d: any) =>
      this.hiddenCategories.has(category) ? 0 : this.yScale(d[0]) - this.yScale(d[1])
    );

  }    
}



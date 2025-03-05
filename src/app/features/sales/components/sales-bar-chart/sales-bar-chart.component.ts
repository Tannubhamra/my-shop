import { Component, ElementRef, inject, OnInit, ViewChild, effect } from '@angular/core';
import * as d3 from 'd3';
import { SalesStore } from '../../store/sales.store';

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales-bar-chart.component.html',
  styleUrl: './sales-bar-chart.component.scss'
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

  private hiddenCategories: Set<string> = new Set();

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
    d3.select(chartContainer).select('svg').remove(); 
    
    this.svg = d3.select(chartContainer)
        .append('svg') 
        .attr('width', this.svgWidth + this.margin.left + this.margin.right)
        .attr('height', this.svgHeight + this.margin.top + this.margin.bottom + 100)
        .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
        .attr('preserveAspectRatio', 'xMidYMid meet'); // Ensures responsiveness;
  }

  createBarChart() {

    interface StackedDatum {
      key: string;
      values: [number, number][];
    }
    const salesData = this.store.salesData();
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
      .attr("transform", `translate(0, ${this.svgHeight + 60})`); // Position below chart

      const legendItem = legend.selectAll(".legend-item")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d: any, i: number) => `translate(${i * 120}, 0)`)
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



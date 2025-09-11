import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import * as fc from 'd3fc';

export interface DataPoint {
  x: number;
  y: number;
}

@customElement('d3fc-line-chart')
export class D3FCLineChart extends LitElement {
  @property({ type: Array }) data: DataPoint[] = [];
  @property({ type: String }) title = 'D3FC Line Chart';
  @property({ type: String }) xLabel = 'X Axis';
  @property({ type: String }) yLabel = 'Y Axis';

  @query('#chart-container') chartContainer!: HTMLDivElement;

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .chart-title {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333;
    }

    #chart-container {
      width: 100%;
      height: 400px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    /* D3FC specific styles */
    #chart-container .line {
      stroke: #2563eb;
      stroke-width: 2px;
      fill: none;
    }

    #chart-container .point {
      fill: #2563eb;
      stroke: white;
      stroke-width: 2px;
    }
  `;

  firstUpdated() {
    console.log('D3FCLineChart firstUpdated, data:', this.data);
    this.renderChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('data')) {
      this.renderChart();
    }
  }

  private renderChart() {
    console.log('D3FC renderChart called, data:', this.data);
    
    if (!this.data || this.data.length === 0) {
      this.chartContainer.innerHTML = '<p style="text-align: center; padding: 50px;">No data available</p>';
      return;
    }

    try {
      // Clear previous chart
      this.chartContainer.innerHTML = '';

      // Set explicit dimensions
      const width = 700;
      const height = 300;
      const margin = { top: 20, right: 20, bottom: 40, left: 50 };

      // Create scales with explicit ranges
      const xExtent = d3.extent(this.data, d => d.x) as [number, number];
      const yExtent = d3.extent(this.data, d => d.y) as [number, number];
      
      console.log('Data extents - x:', xExtent, 'y:', yExtent);
      
      const xScale = d3.scaleLinear()
        .domain(xExtent)
        .range([0, width - margin.left - margin.right]);
        
      const yScale = d3.scaleLinear()
        .domain(yExtent)
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      console.log('Scales created');

      // Create line series using d3fc
      const lineSeries = fc.seriesSvgLine()
        .crossValue((d: DataPoint) => d.x)
        .mainValue((d: DataPoint) => d.y);

      console.log('Line series created');

      // Create point series using d3fc
      const pointSeries = fc.seriesSvgPoint()
        .crossValue((d: DataPoint) => d.x)
        .mainValue((d: DataPoint) => d.y)
        .size(64);

      console.log('Point series created');

      // Combine line and points
      const multiSeries = fc.seriesSvgMulti()
        .series([lineSeries, pointSeries]);

      console.log('Multi series created');

      // Create the chart without chartSize
      const chart = fc.chartCartesian(xScale, yScale)
        .xLabel(this.xLabel)
        .yLabel(this.yLabel)
        .svgPlotArea(multiSeries);

      console.log('Chart created');

      // Create container div
      const container = d3.select(this.chartContainer)
        .append('div')
        .style('width', width + 'px')
        .style('height', height + 'px');

      console.log('Container created, rendering with data:', this.data);

      // Render the chart
      container
        .datum(this.data)
        .call(chart);

      console.log('D3FC chart rendered successfully');

      // Check if SVG was created
      const svg = container.select('svg');
      if (svg.empty()) {
        console.error('No SVG created by d3fc');
        this.chartContainer.innerHTML = '<p style="color: red;">Failed to create SVG</p>';
      } else {
        console.log('SVG created successfully:', svg.node());
      }

    } catch (error) {
      console.error('Error rendering D3FC chart:', error);
      this.chartContainer.innerHTML = `<p style="color: red; text-align: center; padding: 50px;">Error: ${error}</p>`;
    }
  }

  render() {
    return html`
      <div class="chart-title">${this.title}</div>
      <div id="chart-container"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'd3fc-line-chart': D3FCLineChart;
  }
}

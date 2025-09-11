import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import * as fc from 'd3fc';

export interface DataPoint {
  x: number | Date;
  y: number;
}

@customElement('line-chart')
export class LineChart extends LitElement {
  @property({ type: Array }) data: DataPoint[] = [];
  @property({ type: String }) title = 'Line Chart';
  @property({ type: Number }) width = 800;
  @property({ type: Number }) height = 400;
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
      height: 500px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }

    /* d3fc default styles */
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

    #chart-container .axis text {
      font-size: 12px;
      color: #666;
    }

    #chart-container .gridline-x,
    #chart-container .gridline-y {
      stroke: #e5e7eb;
      stroke-width: 1px;
    }
  `;

  firstUpdated() {
    console.log('LineChart firstUpdated, data:', this.data);
    this.renderChart();
  }

  updated(changedProperties: Map<string, any>) {
    console.log('LineChart updated, changedProperties:', changedProperties);
    if (changedProperties.has('data') || 
        changedProperties.has('width') || 
        changedProperties.has('height')) {
      this.renderChart();
    }
  }

  private renderChart() {
    console.log('renderChart called, data:', this.data, 'length:', this.data?.length);
    
    if (!this.data || this.data.length === 0) {
      console.log('No data available, showing message');
      this.chartContainer.innerHTML = '<p style="text-align: center; padding: 50px;">No data available</p>';
      return;
    }

    console.log('Starting chart render with d3fc');
    
    // Clear previous chart
    this.chartContainer.innerHTML = '';

    try {
      // Create scales
      const xExtent = d3.extent(this.data, (d: DataPoint) => +d.x) as [number, number];
      const yExtent = d3.extent(this.data, (d: DataPoint) => d.y) as [number, number];
      
      const xScale = d3.scaleLinear().domain(xExtent);
      const yScale = d3.scaleLinear().domain(yExtent).nice();

      console.log('Scales created, xExtent:', xExtent, 'yExtent:', yExtent);

      // Create d3fc line series
      const line = fc.seriesSvgLine()
        .crossValue((d: DataPoint) => +d.x)
        .mainValue((d: DataPoint) => d.y);

      console.log('Line series created');

      // Create the chart using d3fc cartesian chart
      const chart = fc.chartCartesian(xScale, yScale)
        .xLabel(this.xLabel)
        .yLabel(this.yLabel)
        .svgPlotArea(line);

      console.log('Chart created');

      // Create container
      const container = d3.select(this.chartContainer)
        .append('div')
        .style('width', `${this.width}px`)
        .style('height', `${this.height}px`);

      console.log('Container created, data to render:', this.data);

      // Render the chart
      container
        .datum(this.data)
        .call(chart);

      console.log('Chart rendered successfully');

      // Add title
      const svg = container.select('svg');
      if (!svg.empty()) {
        svg.append('text')
          .attr('x', this.width / 2)
          .attr('y', 20)
          .attr('text-anchor', 'middle')
          .style('font-size', '16px')
          .style('font-weight', 'bold')
          .style('fill', '#333')
          .text(this.title);
        console.log('Title added');
      } else {
        console.warn('SVG not found for title');
      }

    } catch (error) {
      console.error('Error rendering chart:', error);
      this.chartContainer.innerHTML = `<p style="text-align: center; padding: 50px; color: red;">Error rendering chart: ${error}</p>`;
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
    'line-chart': LineChart;
  }
}

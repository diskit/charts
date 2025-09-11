import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as d3 from 'd3';

export interface DataPoint {
  x: number;
  y: number;
}

@customElement('basic-line-chart')
export class BasicLineChart extends LitElement {
  @property({ type: Array }) data: DataPoint[] = [];
  @property({ type: String }) title = 'Basic Line Chart';

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

    .line {
      fill: none;
      stroke: #2563eb;
      stroke-width: 2px;
    }

    .dot {
      fill: #2563eb;
      stroke: white;
      stroke-width: 2px;
    }

    .axis {
      color: #666;
    }
  `;

  firstUpdated() {
    console.log('BasicLineChart firstUpdated, data:', this.data);
    this.renderChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('data')) {
      this.renderChart();
    }
  }

  private renderChart() {
    console.log('renderChart called, data:', this.data);
    
    if (!this.data || this.data.length === 0) {
      this.chartContainer.innerHTML = '<p style="text-align: center; padding: 50px;">No data available</p>';
      return;
    }

    // Clear previous chart
    this.chartContainer.innerHTML = '';

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    // Create SVG
    const svg = d3.select(this.chartContainer)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.y) as [number, number])
      .nice()
      .range([height, 0]);

    // Create line generator
    const line = d3.line<DataPoint>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Add the line
    g.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', line);

    // Add dots
    g.selectAll('.dot')
      .data(this.data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4);

    // Add axes
    g.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(yScale));

    console.log('Basic chart rendered successfully');
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
    'basic-line-chart': BasicLineChart;
  }
}

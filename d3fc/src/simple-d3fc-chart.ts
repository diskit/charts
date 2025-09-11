import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import * as d3 from 'd3';
import * as fc from 'd3fc';

export interface DataPoint {
  x: number;
  y: number;
}

@customElement('simple-d3fc-chart')
export class SimpleD3FCChart extends LitElement {
  @property({ type: Array }) data: DataPoint[] = [];
  @property({ type: String }) title = 'Simple D3FC Chart';

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

    /* Ensure d3fc charts are visible */
    #chart-container svg {
      width: 100%;
      height: 100%;
    }
  `;

  firstUpdated() {
    this.renderChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('data')) {
      this.renderChart();
    }
  }

  private renderChart() {
    console.log('Simple D3FC renderChart called, data:', this.data);
    
    if (!this.data || this.data.length === 0) {
      this.chartContainer.innerHTML = '<p style="text-align: center; padding: 50px;">No data available</p>';
      return;
    }

    try {
      // Clear previous chart
      this.chartContainer.innerHTML = '';

      // Create scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.x) as [number, number]);
        
      const yScale = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.y) as [number, number])
        .nice();

      // Create only a line series for simplicity
      const line = fc.seriesSvgLine()
        .crossValue((d: DataPoint) => d.x)
        .mainValue((d: DataPoint) => d.y);

      // Create basic chart
      const chart = fc.chartCartesian(xScale, yScale)
        .svgPlotArea(line);

      // Create selection and render
      const selection = d3.select(this.chartContainer);
      
      selection
        .datum(this.data)
        .call(chart);

      console.log('Simple D3FC chart rendered');

      // Log SVG creation
      const svg = selection.select('svg');
      console.log('SVG element:', svg.node());
      console.log('SVG size:', svg.attr('width'), 'x', svg.attr('height'));

    } catch (error) {
      console.error('Error in simple D3FC chart:', error);
      this.chartContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
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
    'simple-d3fc-chart': SimpleD3FCChart;
  }
}

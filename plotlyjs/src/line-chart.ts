import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as Plotly from 'plotly.js-basic-dist';

@customElement('line-chart')
export class LineChart extends LitElement {
  @property({ type: Array })
  data: { x: number; y: number }[] = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 13 },
    { x: 4, y: 17 },
    { x: 5, y: 22 },
    { x: 6, y: 19 },
    { x: 7, y: 25 },
    { x: 8, y: 28 },
    { x: 9, y: 24 },
    { x: 10, y: 30 }
  ];

  @property({ type: String })
  title = 'Line Chart';

  @property({ type: String })
  xAxisTitle = 'X Axis';

  @property({ type: String })
  yAxisTitle = 'Y Axis';

  firstUpdated() {
    this.renderChart();
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('data') || 
        changedProperties.has('title') || 
        changedProperties.has('xAxisTitle') || 
        changedProperties.has('yAxisTitle')) {
      this.renderChart();
    }
  }

  private renderChart() {
    const chartDiv = this.shadowRoot?.getElementById('chart');
    if (!chartDiv) return;

    const xValues = this.data.map(d => d.x);
    const yValues = this.data.map(d => d.y);

    const trace = {
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines+markers',
      line: {
        color: '#1f77b4',
        width: 2
      },
      marker: {
        color: '#1f77b4',
        size: 6
      }
    } as any;

    const layout = {
      title: {
        text: this.title,
        font: {
          size: 18
        }
      },
      xaxis: {
        title: {
          text: this.xAxisTitle
        },
        showgrid: true,
        gridcolor: '#e6e6e6'
      },
      yaxis: {
        title: {
          text: this.yAxisTitle
        },
        showgrid: true,
        gridcolor: '#e6e6e6'
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      margin: {
        l: 60,
        r: 30,
        t: 60,
        b: 60
      }
    } as any;

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d']
    } as any;

    Plotly.newPlot(chartDiv, [trace], layout, config);
  }

  render() {
    return html`
      <div class="chart-container">
        <div id="chart"></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .chart-container {
      width: 100%;
      height: 400px;
      min-height: 400px;
    }

    #chart {
      width: 100%;
      height: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'line-chart': LineChart;
  }
}
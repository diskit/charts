import { LitElement, html, css } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface LineChartData {
  x: (string | number)[];
  y: number[];
  name?: string;
  line?: {
    color?: string;
    width?: number;
    dash?: 'solid' | 'dot' | 'dash' | 'longdash' | 'dashdot' | 'longdashdot';
  };
}

@customElement('line-chart')
export class LineChart extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 400px;
    }
    
    #chart {
      width: 100%;
      height: 100%;
    }
  `;

  @property({ type: Array })
  data: LineChartData[] = [];

  @property({ type: String })
  title = '';

  @property({ type: String })
  xAxisTitle = '';

  @property({ type: String })
  yAxisTitle = '';

  @property({ type: Number })
  width = 800;

  @property({ type: Number })
  height = 400;

  @property({ type: Boolean })
  showLegend = true;

  @property({ type: String })
  theme: 'light' | 'dark' = 'light';

  private chartElement?: HTMLElement;
  private plotly: any = null;

  async connectedCallback() {
    super.connectedCallback();
    // Dynamically import Plotly
    const plotlyModule = await import('plotly.js-dist-min');
    this.plotly = plotlyModule;
  }

  protected firstUpdated(): void {
    this.chartElement = this.shadowRoot?.getElementById('chart') as HTMLElement;
    if (this.plotly) {
      this.renderChart();
    }
  }

  protected updated(changedProperties: PropertyValues): void {
    if (this.chartElement && this.plotly && (
      changedProperties.has('data') ||
      changedProperties.has('title') ||
      changedProperties.has('xAxisTitle') ||
      changedProperties.has('yAxisTitle') ||
      changedProperties.has('width') ||
      changedProperties.has('height') ||
      changedProperties.has('showLegend') ||
      changedProperties.has('theme')
    )) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartElement || !this.data.length || !this.plotly) return;

    const traces = this.data.map(series => ({
      x: series.x,
      y: series.y,
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      name: series.name || '',
      line: {
        color: series.line?.color,
        width: series.line?.width || 2,
        dash: series.line?.dash || 'solid'
      },
      marker: {
        size: 6
      }
    }));

    const layout = {
      title: {
        text: this.title,
        font: { size: 16 }
      },
      xaxis: {
        title: {
          text: this.xAxisTitle,
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: this.theme === 'dark' ? '#444' : '#e0e0e0'
      },
      yaxis: {
        title: {
          text: this.yAxisTitle,
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: this.theme === 'dark' ? '#444' : '#e0e0e0'
      },
      showlegend: this.showLegend,
      legend: {
        orientation: 'h' as const,
        x: 0,
        y: -0.2
      },
      margin: {
        l: 60,
        r: 30,
        t: 60,
        b: 80
      },
      paper_bgcolor: this.theme === 'dark' ? '#2d2d2d' : '#fff',
      plot_bgcolor: this.theme === 'dark' ? '#1e1e1e' : '#fff',
      font: {
        color: this.theme === 'dark' ? '#fff' : '#000'
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: [
        'pan2d',
        'lasso2d',
        'select2d',
        'autoScale2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian'
      ],
      displaylogo: false
    };

    this.plotly.newPlot(this.chartElement, traces, layout, config);
  }

  /**
   * Update chart data
   */
  updateData(newData: LineChartData[]): void {
    this.data = [...newData];
  }

  /**
   * Add a new data series
   */
  addSeries(series: LineChartData): void {
    this.data = [...this.data, series];
  }

  /**
   * Remove a data series by name
   */
  removeSeries(name: string): void {
    this.data = this.data.filter(series => series.name !== name);
  }

  /**
   * Clear all data
   */
  clearData(): void {
    this.data = [];
  }

  /**
   * Export chart as PNG
   */
  async exportAsPNG(): Promise<string> {
    if (!this.chartElement || !this.plotly) throw new Error('Chart not initialized');
    
    const imgData = await this.plotly.toImage(this.chartElement, {
      format: 'png',
      width: this.width,
      height: this.height
    });
    
    return imgData;
  }

  /**
   * Export chart as SVG
   */
  async exportAsSVG(): Promise<string> {
    if (!this.chartElement || !this.plotly) throw new Error('Chart not initialized');
    
    const imgData = await this.plotly.toImage(this.chartElement, {
      format: 'svg',
      width: this.width,
      height: this.height
    });
    
    return imgData;
  }

  render() {
    return html`
      <div id="chart"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'line-chart': LineChart;
  }
}
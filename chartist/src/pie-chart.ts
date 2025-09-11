import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PieChart as ChartistPieChart } from 'chartist';

@customElement('pie-chart')
export class PieChart extends LitElement {
  @property({ type: Array })
  data = [12, 19, 3, 5, 2, 3];

  @property({ type: Array })
  labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  private chart?: ChartistPieChart;

  firstUpdated() {
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  private createChart() {
    const chartContainer = this.renderRoot.querySelector('#pie-chart');
    if (!chartContainer) {
      console.error('Chart container not found');
      return;
    }

    console.log('Creating pie chart with data:', this.data);
    console.log('Chart container:', chartContainer);

    try {
      this.chart = new ChartistPieChart(
        chartContainer as HTMLElement,
        {
          series: this.data,
          labels: this.labels
        },
        {
          width: 400,
          height: 400,
          donut: true,
          donutWidth: 60,
          startAngle: 270,
          total: 100,
          showLabel: true
        }
      );
      console.log('Pie chart created successfully:', this.chart);
    } catch (error) {
      console.error('Error creating pie chart:', error);
    }
  }

  render() {
    return html`
      <div class="chart-container">
        <h2>Pie Chart (Chartist)</h2>
        <div id="pie-chart" class="chart"></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
      line-height: 1.5;
    }

    .chart-container {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      line-height: 1.4;
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 1rem;
      line-height: 1.3;
    }

    .chart {
      height: 400px;
      width: 100%;
      min-width: 300px;
    }

    /* Chartist base styles for Shadow DOM */
    .ct-chart {
      position: relative;
      width: 100%;
    }
    
    .ct-chart .ct-series.ct-series-a .ct-slice-pie {
      fill: #d70206;
    }
    .ct-chart .ct-series.ct-series-b .ct-slice-pie {
      fill: #f05b4f;
    }
    .ct-chart .ct-series.ct-series-c .ct-slice-pie {
      fill: #f4c63d;
    }
    .ct-chart .ct-series.ct-series-d .ct-slice-pie {
      fill: #453d3f;
    }
    .ct-chart .ct-series.ct-series-e .ct-slice-pie {
      fill: #59922b;
    }
    .ct-chart .ct-series.ct-series-f .ct-slice-pie {
      fill: #0544d3;
    }

    .ct-chart .ct-label {
      fill: rgba(0, 0, 0, 0.4);
      color: rgba(0, 0, 0, 0.4);
      font-size: 0.75rem;
      line-height: 1;
    }

    .ct-chart .ct-slice-donut {
      stroke: #fff;
      stroke-width: 2px;
    }

    @media (prefers-color-scheme: dark) {
      .chart-container {
        background: #1a1a1a;
        color: white;
      }
      
      h2 {
        color: white;
      }

      .ct-chart .ct-label {
        fill: rgba(255, 255, 255, 0.4);
        color: rgba(255, 255, 255, 0.4);
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'pie-chart': PieChart;
  }
}

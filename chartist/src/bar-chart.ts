import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BarChart as ChartistBarChart } from 'chartist';

@customElement('bar-chart')
export class BarChart extends LitElement {
  @property({ type: Array })
  data = [12, 19, 3, 17, 6, 11];

  @property({ type: Array })
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  private chart?: ChartistBarChart;

  firstUpdated() {
    setTimeout(() => {
      this.createChart();
    }, 100);
  }

  private createChart() {
    const chartContainer = this.renderRoot.querySelector('#bar-chart');
    if (!chartContainer) {
      console.error('Chart container not found');
      return;
    }

    console.log('Creating chart with data:', this.data);
    console.log('Labels:', this.labels);
    console.log('Chart container:', chartContainer);
    console.log('Container dimensions:', chartContainer.getBoundingClientRect());

    try {
      // より確実な設定に変更
      const chartData = {
        labels: this.labels,
        series: [this.data]
      };
      
      const options = {
        axisX: {
          showGrid: false,
          offset: 30
        },
        axisY: {
          showGrid: true,
          onlyInteger: true,
          offset: 40
        },
        low: 0,
        chartPadding: {
          top: 15,
          right: 15,
          bottom: 30,
          left: 40
        },
        seriesBarDistance: 15,
        stackBars: false,
        horizontalBars: false,
        reverseData: false,
        // バーの方向を明示的に垂直に設定
        plugins: []
      };
      
      console.log('Chart data:', chartData);
      console.log('Chart options:', options);
      
      this.chart = new ChartistBarChart(
        chartContainer as HTMLElement,
        chartData,
        options
      );
      console.log('Chart created successfully:', this.chart);
      
      // チャート描画完了後のデバッグ
      this.chart.on('draw', (data: any) => {
        console.log('Drawing:', data.type, data);
        if (data.type === 'bar') {
          console.log('Bar element:', data.element._node);
          console.log('Bar coordinates - x1:', data.x1, 'x2:', data.x2, 'y1:', data.y1, 'y2:', data.y2);
          console.log('Bar value:', data.value);
          
          // バーの幅が0の場合、最小幅を設定
          if (data.x1 === data.x2) {
            console.warn('Bar width is 0, adjusting...');
            const minWidth = 10;
            data.element.attr({
              x1: data.x1 - minWidth / 2,
              x2: data.x2 + minWidth / 2
            });
          }
          
          // y1とy2が同じ場合（高さが0）、適切な高さを設定
          if (data.y1 === data.y2) {
            console.warn('Bar height is 0, adjusting...');
            // ベースライン（通常はチャートの下部）からデータ値に応じた高さを設定
            const baseY = data.chartRect.y2;
            const valueHeight = (data.value.y || data.value) * (data.chartRect.height() / Math.max(...this.data));
            data.element.attr({
              y1: baseY,
              y2: baseY - valueHeight
            });
          }
          
          // 直接色を白に設定
          data.element.attr({
            'stroke': '#ffffff',
            'stroke-width': '20px'
          });
        }
        
        if (data.type === 'line') {
          // ライン要素も白に設定
          data.element.attr({
            'stroke': '#ffffff',
            'stroke-width': '2px'
          });
        }
      });
      
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  render() {
    return html`
      <div class="chart-container">
        <h2>Bar Chart (Chartist)</h2>
        <div id="bar-chart" class="chart"></div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
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
      min-width: 400px;
    }

    /* Chartist base styles for Shadow DOM */
    .ct-chart {
      position: relative;
      width: 100%;
    }

    .ct-chart .ct-series.ct-series-a .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }
    .ct-chart .ct-series.ct-series-b .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }
    .ct-chart .ct-series.ct-series-c .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }
    .ct-chart .ct-series.ct-series-d .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }
    .ct-chart .ct-series.ct-series-e .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }
    .ct-chart .ct-series.ct-series-f .ct-bar {
      stroke: #ffffff !important;
      stroke-width: 20px !important;
      stroke-linecap: round;
    }

    /* バーの最小幅を確保 */
    .ct-chart .ct-bar {
      stroke: #ffffff !important;
      stroke-linecap: round;
      min-width: 10px;
    }

    .ct-chart .ct-label {
      fill: rgba(0, 0, 0, 0.4);
      color: rgba(0, 0, 0, 0.4);
      font-size: 0.75rem;
      line-height: 1;
    }

    .ct-chart .ct-grid {
      stroke: rgba(0, 0, 0, 0.2);
      stroke-width: 1px;
      stroke-dasharray: 2px;
    }

    .ct-chart .ct-line {
      fill: none;
      stroke: #ffffff !important;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* 全てのSVG要素を強制的に白に */
    .ct-chart svg line {
      stroke: #ffffff !important;
    }
    
    .ct-chart svg path {
      stroke: #ffffff !important;
    }

    /* バーを垂直に強制 */
    .ct-chart .ct-bar {
      transform-origin: center;
    }

    .ct-chart .ct-bar {
      stroke-linecap: round;
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

      .ct-chart .ct-grid {
        stroke: rgba(255, 255, 255, 0.2);
      }

      /* ダークモードでは少し薄い白に */
      .ct-chart .ct-bar,
      .ct-chart .ct-line {
        stroke: #f0f0f0;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'bar-chart': BarChart;
  }
}

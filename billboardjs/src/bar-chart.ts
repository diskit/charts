import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import bb from 'billboard.js';

interface ChartData {
  label: string;
  value: number;
}

@customElement('bar-chart')
export class BarChart extends LitElement {
  @property({ type: Array })
  data: ChartData[] = [
    { label: 'A', value: 30 },
    { label: 'B', value: 80 },
    { label: 'C', value: 45 },
    { label: 'D', value: 60 },
    { label: 'E', value: 20 },
    { label: 'F', value: 90 },
    { label: 'G', value: 55 }
  ];

  @property({ type: Number })
  width = 500;

  @property({ type: Number })
  height = 300;

  private chart: bb.Chart | null = null;

  firstUpdated() {
    this.createChart();
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('data') || changedProperties.has('width') || changedProperties.has('height')) {
      this.createChart();
    }
  }

  createChart() {
    const chartContainer = this.shadowRoot?.querySelector('#chart');
    if (!chartContainer) return;

    // 既存のチャートを破棄
    if (this.chart) {
      this.chart.destroy();
    }

    // データをBillboard.jsの形式に変換
    const columns = [
      ['data1', ...this.data.map(d => d.value)]
    ];

    const categories = this.data.map(d => d.label);

    this.chart = bb.generate({
      bindto: chartContainer,
      data: {
        columns: columns,
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: categories
        }
      },
      size: {
        width: this.width,
        height: this.height
      },
      bar: {
        width: {
          ratio: 0.8
        }
      },
      color: {
        pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2']
      },
      tooltip: {
        format: {
          value: (value: number, ratio: number, id: string, index: number) => {
            return `${categories[index]}: ${value}`;
          }
        }
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  render() {
    return html`
      <div class="chart-container">
        <h3>Billboard.js 棒グラフサンプル</h3>
        <div id="chart"></div>
        <div class="controls">
          <button @click=${this.randomizeData}>データをランダム化</button>
          <button @click=${this.addData}>データ追加</button>
        </div>
      </div>
    `;
  }

  randomizeData() {
    this.data = this.data.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 100) + 10
    }));
  }

  addData() {
    const newLabel = String.fromCharCode(65 + this.data.length);
    this.data = [...this.data, {
      label: newLabel,
      value: Math.floor(Math.random() * 100) + 10
    }];
  }

  static styles = css`
    .chart-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    h3 {
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    }

    #chart {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    button {
      background: #646cff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    button:hover {
      background: #535bf2;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'bar-chart': BarChart;
  }
}

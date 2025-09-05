import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import bb from 'billboard.js';

interface PieData {
  label: string;
  value: number;
  color?: string;
}

@customElement('pie-chart')
export class PieChart extends LitElement {
  @property({ type: Array })
  data: PieData[] = [
    { label: 'Apple', value: 25 },
    { label: 'Orange', value: 30 },
    { label: 'Banana', value: 20 },
    { label: 'Grape', value: 15 },
    { label: 'Strawberry', value: 10 }
  ];

  @property({ type: Number })
  width = 400;

  @property({ type: Number })
  height = 400;

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
    const chartContainer = this.shadowRoot?.querySelector('#pie-chart');
    if (!chartContainer) return;

    // 既存のチャートを破棄
    if (this.chart) {
      this.chart.destroy();
    }

    // データをBillboard.jsの形式に変換
    const columns = this.data.map((item, index) => [
      `data${index + 1}`,
      item.value
    ]);

    const colors: { [key: string]: string } = {};
    this.data.forEach((item, index) => {
      colors[`data${index + 1}`] = item.color || this.getDefaultColor(index);
    });

    this.chart = bb.generate({
      bindto: chartContainer,
      data: {
        columns: columns,
        type: 'pie'
      },
      size: {
        width: this.width,
        height: this.height
      },
      color: {
        pattern: Object.values(colors)
      },
      pie: {
        label: {
          format: (value: number, ratio: number, id: string) => {
            const index = parseInt(id.replace('data', '')) - 1;
            const item = this.data[index];
            const percentage = (ratio * 100).toFixed(1);
            return `${item.label}: ${percentage}%`;
          }
        }
      },
      tooltip: {
        format: {
          value: (value: number, ratio: number, id: string) => {
            const index = parseInt(id.replace('data', '')) - 1;
            const item = this.data[index];
            const percentage = (ratio * 100).toFixed(1);
            return `${item.label}: ${value} (${percentage}%)`;
          }
        }
      },
      legend: {
        show: true,
        position: 'right'
      }
    });
  }

  private getDefaultColor(index: number): string {
    const colors = [
      '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
      '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ];
    return colors[index % colors.length];
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
        <h3>Billboard.js 円グラフサンプル</h3>
        <div id="pie-chart"></div>
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
      value: Math.floor(Math.random() * 50) + 5
    }));
  }

  addData() {
    const fruits = ['Mango', 'Pineapple', 'Kiwi', 'Peach', 'Cherry', 'Blueberry'];
    const availableFruits = fruits.filter(fruit => 
      !this.data.some(item => item.label === fruit)
    );
    
    if (availableFruits.length > 0) {
      const newFruit = availableFruits[Math.floor(Math.random() * availableFruits.length)];
      this.data = [...this.data, {
        label: newFruit,
        value: Math.floor(Math.random() * 30) + 5
      }];
    }
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

    #pie-chart {
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
    'pie-chart': PieChart;
  }
}

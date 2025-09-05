import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as d3 from 'd3';

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

  @property({ type: Object })
  margin = { top: 20, right: 30, bottom: 40, left: 40 };

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

    // 既存のSVGを削除
    d3.select(chartContainer).selectAll('*').remove();

    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

    // SVG要素を作成
    const svg = d3.select(chartContainer)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // スケールを設定
    const xScale = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) || 0])
      .range([innerHeight, 0]);

    // カラースケール
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // 棒グラフを描画
    g.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', (_d, i) => colorScale(i.toString()))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.7);
        
        // ツールチップ表示
        const tooltip = d3.select(chartContainer)
          .append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .style('pointer-events', 'none')
          .style('opacity', 0);

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);

        tooltip.html(`${d.label}: ${d.value}`)
          .style('left', (event.layerX + 10) + 'px')
          .style('top', (event.layerY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        d3.select(chartContainer).select('.tooltip').remove();
      });

    // X軸を描画
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    // Y軸を描画
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));

    // 軸のスタイル
    g.selectAll('.x-axis text, .y-axis text')
      .style('font-family', 'Arial, sans-serif')
      .style('font-size', '12px');

    g.selectAll('.x-axis path, .y-axis path, .x-axis line, .y-axis line')
      .style('stroke', '#333')
      .style('stroke-width', '1px');
  }

  render() {
    return html`
      <div class="chart-container">
        <h3>D3.js 棒グラフサンプル</h3>
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

    .bar {
      cursor: pointer;
      transition: opacity 0.2s;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'bar-chart': BarChart;
  }
}

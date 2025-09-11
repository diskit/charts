import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as d3 from 'd3';


interface LineSeries {
  name: string;
  color?: string;
  data: Array<{ x: Date; y: number }>;
}

@customElement('line-chart')
export class LineChart extends LitElement {
  @property({ type: Array })
  series: LineSeries[] = [
    {
      name: 'Series 1',
      color: '#646cff',
      data: [
        { x: new Date('2024-01-01'), y: 10 },
        { x: new Date('2024-01-02'), y: 40 },
        { x: new Date('2024-01-03'), y: 25 },
        { x: new Date('2024-01-04'), y: 60 },
        { x: new Date('2024-01-05'), y: 35 },
        { x: new Date('2024-01-06'), y: 80 },
        { x: new Date('2024-01-07'), y: 55 }
      ]
    },
    {
      name: 'Series 2',
      color: '#ff9800',
      data: [
        { x: new Date('2024-01-01'), y: 20 },
        { x: new Date('2024-01-02'), y: 30 },
        { x: new Date('2024-01-03'), y: 50 },
        { x: new Date('2024-01-04'), y: 40 },
        { x: new Date('2024-01-05'), y: 60 },
        { x: new Date('2024-01-06'), y: 30 },
        { x: new Date('2024-01-07'), y: 70 }
      ]
    }
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
    if (changedProperties.has('series') || changedProperties.has('width') || changedProperties.has('height')) {
      this.createChart();
    }
  }

  createChart() {
    const chartContainer = this.shadowRoot?.querySelector('#line-chart');
    if (!chartContainer) return;
    d3.select(chartContainer).selectAll('*').remove();

    const innerWidth = this.width - this.margin.left - this.margin.right;
    const innerHeight = this.height - this.margin.top - this.margin.bottom;

    const svg = d3.select(chartContainer)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // 全系列のx/y値をまとめてスケールを作成
    const allX = this.series.flatMap(s => s.data.map(d => d.x));
    const allY = this.series.flatMap(s => s.data.map(d => d.y));

    const xScale = d3.scaleTime()
      .domain([d3.min(allX) || new Date(), d3.max(allX) || new Date()])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allY) || 0])
      .range([innerHeight, 0]);

    // 軸
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeDay.every(1)));

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

    // 各系列ごとに線と点を描画
    this.series.forEach((s, idx) => {
      const line = d3.line<{ x: Date; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      g.append('path')
        .datum(s.data)
        .attr('fill', 'none')
        .attr('stroke', s.color || d3.schemeCategory10[idx % 10])
        .attr('stroke-width', 3)
        .attr('d', line);

      g.selectAll(`.dot.series${idx}`)
        .data(s.data)
        .enter().append('circle')
        .attr('class', `dot series${idx}`)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 5)
        .attr('fill', s.color || d3.schemeCategory10[idx % 10])
        .on('mouseover', function(event, d) {
          d3.select(this).attr('fill', '#ff9800');
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
          tooltip.html(`${s.name}<br>日付: ${d.x.toLocaleDateString()}<br>値: ${d.y}`)
            .style('left', (event.layerX + 10) + 'px')
            .style('top', (event.layerY - 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', s.color || d3.schemeCategory10[idx % 10]);
          d3.select(chartContainer).select('.tooltip').remove();
        });
    });

    // 凡例
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 120}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(this.series)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => d.color || d3.schemeCategory10[i % 10]);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .text(d => d.name);
  }

  render() {
    return html`
      <div class="chart-container">
        <h3>D3.js 日付軸ラインチャートサンプル</h3>
        <div id="line-chart"></div>
        <div class="controls">
          <button @click=${this.randomizeData}>データをランダム化</button>
          <button @click=${this.addSeries}>系列追加</button>
        </div>
      </div>
    `;
  }

  randomizeData() {
    this.series = this.series.map(s => ({
      ...s,
      data: s.data.map(item => ({
        ...item,
        y: Math.floor(Math.random() * 100) + 10
      }))
    }));
  }

  addSeries() {
    const nextIdx = this.series.length + 1;
    const color = d3.schemeCategory10[nextIdx % 10];
    const baseDate = new Date('2024-01-01');
    const newSeries: LineSeries = {
      name: `Series ${nextIdx}`,
      color,
      data: Array.from({ length: 7 }, (_, i) => ({ 
        x: new Date(baseDate.getTime() + i * 24 * 60 * 60 * 1000), 
        y: Math.floor(Math.random() * 100) + 10 
      }))
    };
    this.series = [...this.series, newSeries];
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
    #line-chart {
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
    .dot {
      cursor: pointer;
      transition: fill 0.2s;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'line-chart': LineChart;
  }
}

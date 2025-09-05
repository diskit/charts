import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as d3 from 'd3';

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

  @property({ type: Number })
  radius = 150;

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

    // 既存のSVGを削除
    d3.select(chartContainer).selectAll('*').remove();

    // SVG要素を作成
    const svg = d3.select(chartContainer)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const g = svg.append('g')
      .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

    // パイチャート用の関数を設定
    const pie = d3.pie<PieData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(0)
      .outerRadius(this.radius);

    const arcHover = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(0)
      .outerRadius(this.radius + 10);

    // カラースケール
    const colorScale = d3.scaleOrdinal(d3.schemeSet3);

    // パイチャートのセクションを作成
    const arcs = g.selectAll('.arc')
      .data(pie(this.data))
      .enter().append('g')
      .attr('class', 'arc');

    // パスを描画
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => d.data.color || colorScale(i.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d) => {
        const element = event.currentTarget as SVGPathElement;
        d3.select(element)
          .transition()
          .duration(200)
          .attr('d', arcHover(d) || '');

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

        const total = d3.sum(this.data, p => p.value);
        const percentage = ((d.value / total) * 100).toFixed(1);
        tooltip.html(`${d.data.label}: ${d.data.value} (${percentage}%)`)
          .style('left', (event.layerX + 10) + 'px')
          .style('top', (event.layerY - 10) + 'px');
      })
      .on('mouseout', (event, d) => {
        const element = event.currentTarget as SVGPathElement;
        d3.select(element)
          .transition()
          .duration(200)
          .attr('d', arc(d) || '');
        
        d3.select(chartContainer).select('.tooltip').remove();
      });

    // ラベルを追加
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.7)')
      .text(d => {
        const percentage = ((d.value / d3.sum(this.data, p => p.value)) * 100);
        return percentage > 5 ? d.data.label : ''; // 5%以下は表示しない
      });

    // 凡例を作成
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 120}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(this.data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (_d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => d.color || colorScale(i.toString()));

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .text(d => d.label);
  }

  render() {
    return html`
      <div class="chart-container">
        <h3>D3.js 円グラフサンプル</h3>
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

    .arc {
      transition: all 0.2s;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'pie-chart': PieChart;
  }
}

import { css, html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as Plotly from 'plotly.js-dist-min';

interface ChartData {
    trace1: Plotly.Data;
    trace2: Plotly.Data;
}

@customElement('line-chart')
export class LineChart extends LitElement {

    firstUpdated() {
        this.initializeChart();
    }

    private async initializeChart() {
        try {
            const data = await this.fetchApi();
            this.createChart(data)
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
        }
    }

    private fetchApi(): Promise<ChartData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // APIから取得するデータをシミュレート
                const chartData: ChartData = {
                    trace1: {
                        x: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
                        y: [20, 14, 23, 25, 22, 16],
                        name: 'データセット1',
                        type: 'scatter',
                        mode: 'lines+markers'
                    },
                    trace2: {
                        x: ['2024-04', '2024-05', '2024-06'],
                        y: [19, 15, 20],
                        name: 'データセット2',
                        type: 'scatter',
                        mode: 'lines+markers'
                    }
                };
                resolve(chartData);
            }, 1000); // 1秒後にデータを返す
        });
    }

    private createChart(chartData: ChartData) {
        const chartDiv = this.shadowRoot?.querySelector('#chart') as HTMLDivElement;
        if (!chartDiv) return;

        const data = [chartData.trace1, chartData.trace2];

        const layout: Partial<Plotly.Layout> = {
            margin: { t: 0 },
            legend: {
                x: 0.98,
                y: 0.98,
                xanchor: 'right' as const,
                yanchor: 'top' as const
            }
        };

        const config= {
            displayModeBar: false,
            responsive: true
        };

        Plotly.newPlot(chartDiv, data, layout, config);
    }

    render() {
        return html`<div id="chart"></div>`
    }

    static styles = css`
        :host {
            display: block;
        }

        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            font-size: 16px;
            color: #666;
            background: #f9f9f9;
            border-radius: 8px;
        }

        .main-svg {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;

            .draglayer {
                pointer-events: all;
            }
        }


        .chart-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 24px;
            max-width: 1000px;
            margin: 0 auto;
        }

        h2 {
            color: #1F2937;
            margin: 0 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }

    `;
}
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import * as Plotly from 'plotly.js-dist-min';

@customElement('line-chart')
export class LineChart extends LitElement {

    firstUpdated() {
        this.createChart();
    }

    private createChart() {
        const chartDiv = this.shadowRoot?.querySelector('#chart') as HTMLDivElement;
        if (!chartDiv) return;

        // サンプルデータ
        const trace1: Plotly.Data = {
            x: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
            y: [20, 14, 23, 25, 22, 16]
        };

        const trace2 = {
            x: ['2024-04', '2024-05', '2024-06'],
            y: [19, 15, 20]
        };

        const data = [trace1, trace2];

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
        return html`
            <div id="chart"></div>
        `;
    }

    static styles = css`
        :host {
            display: block;
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
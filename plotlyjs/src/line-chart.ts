import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as Plotly from 'plotly.js-dist-min';

@customElement('line-chart')
export class LineChart extends LitElement {
    @property({ type: Boolean }) darkMode = false;

    firstUpdated() {
        this.createChart();
    }

    updated(changedProperties: Map<string, any>) {
        if (changedProperties.has('darkMode')) {
            this.updateChart();
        }
    }

    private createChart() {
        const chartDiv = this.shadowRoot?.querySelector('#chart') as HTMLDivElement;
        if (!chartDiv) return;

        // サンプルデータ
        const trace1: Plotly.Data = {
            x: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06'],
            y: [20, 14, 23, 25, 22, 16],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'データセット1',
            line: { color: this.darkMode ? '#60A5FA' : '#3B82F6' }
        };

        const trace2: Plotly.Data = {
            x: ['2024-04', '2024-05', '2024-06'],
            y: [19, 15, 20],
            type: 'scatter',
            mode: 'lines+markers',
            name: 'データセット2',
            line: { color: this.darkMode ? '#F87171' : '#EF4444' }
        };

        const data = [trace1, trace2];
        const layout = this.getLayout();
        const config = this.getConfig();

        Plotly.newPlot(chartDiv, data, layout, config);
    }

    private updateChart() {
        const chartDiv = this.shadowRoot?.querySelector('#chart') as HTMLDivElement;
        if (!chartDiv) return;

        const layout = this.getLayout();
        
        // データの色も更新
        const update = {
            'line.color': [
                this.darkMode ? '#60A5FA' : '#3B82F6',
                this.darkMode ? '#F87171' : '#EF4444'
            ]
        };

        Plotly.restyle(chartDiv, update);
        Plotly.relayout(chartDiv, layout);
    }

    private getLayout(): Partial<Plotly.Layout> {
        return {
            margin: { t: 0 },
            paper_bgcolor: this.darkMode ? '#1F2937' : '#FFFFFF',
            plot_bgcolor: this.darkMode ? '#374151' : '#FAFAFA',
            font: {
                color: this.darkMode ? '#F9FAFB' : '#1F2937'
            },
            xaxis: {
                gridcolor: this.darkMode ? '#4B5563' : '#E5E7EB',
                tickfont: { color: this.darkMode ? '#E5E7EB' : '#374151' }
            },
            yaxis: {
                gridcolor: this.darkMode ? '#4B5563' : '#E5E7EB',
                tickfont: { color: this.darkMode ? '#E5E7EB' : '#374151' }
            },
            legend: {
                x: 0.98,
                y: 0.98,
                xanchor: 'right' as const,
                yanchor: 'top' as const,
                bgcolor: this.darkMode ? 'rgba(31,41,55,0.8)' : 'rgba(255,255,255,0.8)',
                bordercolor: this.darkMode ? 'rgba(75,85,99,0.3)' : 'rgba(0,0,0,0.1)',
                font: { color: this.darkMode ? '#F9FAFB' : '#1F2937' }
            }
        };
    }

    private getConfig() {
        return {
            displayModeBar: false,
            responsive: true
        };
    }

    private toggleTheme() {
        this.darkMode = !this.darkMode;
    }

    render() {
        return html`
            <div class="container ${this.darkMode ? 'dark' : 'light'}">
                <div class="header">
                    <h2>Plotly.js Line Chart</h2>
                    <button @click="${this.toggleTheme}" class="theme-toggle">
                        ${this.darkMode ? '☀️' : '🌙'} ${this.darkMode ? 'Light' : 'Dark'}
                    </button>
                </div>
                <div id="chart"></div>
            </div>
        `;
    }

    static styles = css`
        :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
            padding: 20px;
            border-radius: 12px;
            transition: all 0.3s ease;
        }

        .container.light {
            background: #ffffff;
            color: #1F2937;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .container.dark {
            background: #1F2937;
            color: #F9FAFB;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .theme-toggle {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .light .theme-toggle {
            background: #F3F4F6;
            color: #374151;
        }

        .light .theme-toggle:hover {
            background: #E5E7EB;
        }

        .dark .theme-toggle {
            background: #374151;
            color: #F9FAFB;
        }

        .dark .theme-toggle:hover {
            background: #4B5563;
        }

        #chart {
            width: 100%;
            height: 500px;
            min-height: 400px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .header {
                flex-direction: column;
                gap: 16px;
                text-align: center;
            }
            
            #chart {
                height: 400px;
                min-height: 300px;
            }
        }
    `;
}
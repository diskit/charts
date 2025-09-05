# Lit TypeScript + Vite Project

このプロジェクトは、Vite + Lit TypeScript で作成されたWebコンポーネントプロジェクトです。

## 技術スタック

- **Lit**: 軽量なWebコンポーネントライブラリ
- **TypeScript**: 型安全性を提供するJavaScriptスーパーセット
- **Vite**: 高速なビルドツール
- **pnpm**: 効率的なパッケージマネージャー
- **D3.js**: データ駆動型ドキュメント操作ライブラリ

## セットアップ

### 依存関係のインストール

```bash
pnpm install
```

## 開発

### 開発サーバーの起動

```bash
pnpm run dev
```

開発サーバーが起動し、http://localhost:5173/ でアプリケーションにアクセスできます。

### ビルド

```bash
pnpm run build
```

プロダクション用にプロジェクトをビルドします。

### プレビュー

```bash
pnpm run preview
```

ビルド済みのプロジェクトをプレビューします。

## プロジェクト構造

```
├── index.html          # エントリーポイント
├── src/
│   ├── main.ts         # メインエントリーファイル
│   ├── my-element.ts   # Litコンポーネント
│   ├── bar-chart.ts    # D3.js棒グラフコンポーネント
│   └── pie-chart.ts    # D3.js円グラフコンポーネント
├── public/             # 静的ファイル
├── tsconfig.json       # TypeScript設定
├── package.json        # プロジェクト設定
└── vite.config.ts      # Vite設定
```

## 作成されたチャートコンポーネント

### 棒グラフ (`<bar-chart>`)

- インタラクティブな棒グラフ
- ホバー時のツールチップ表示
- データのランダム化・追加機能
- カスタマイズ可能なサイズとマージン

### 円グラフ (`<pie-chart>`)

- インタラクティブな円グラフ  
- ホバー時のアニメーションとツールチップ
- 凡例表示
- パーセンテージ表示
- データのランダム化・追加機能

## チャートの使用方法

HTMLで直接使用：
```html
<bar-chart></bar-chart>
<pie-chart></pie-chart>
```

カスタムデータで使用：
```typescript
const barChart = document.querySelector('bar-chart');
barChart.data = [
  { label: 'A', value: 30 },
  { label: 'B', value: 80 },
  // ...
];

const pieChart = document.querySelector('pie-chart');
pieChart.data = [
  { label: 'Apple', value: 25 },
  { label: 'Orange', value: 30 },
  // ...
];
```

## コンポーネント開発

`src/my-element.ts` にLitコンポーネントのサンプルがあります。新しいコンポーネントを作成する際の参考にしてください。

## D3.js の使用

D3.jsライブラリがインストールされています。Litコンポーネント内でD3.jsを使用する例：

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as d3 from 'd3';

@customElement('chart-component')
export class ChartComponent extends LitElement {
  @property({ type: Array })
  data = [];

  firstUpdated() {
    this.createChart();
  }

  createChart() {
    const svg = d3.select(this.shadowRoot?.querySelector('#chart'))
      .append('svg')
      .attr('width', 400)
      .attr('height', 300);
    
    // D3.jsを使用したチャート作成コード
  }

  render() {
    return html`<div id="chart"></div>`;
  }
}
```

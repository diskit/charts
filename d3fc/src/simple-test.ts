import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('simple-test')
export class SimpleTest extends LitElement {
  @property() message = 'Test component works!';

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      background: lightblue;
      margin: 10px;
    }
  `;

  render() {
    return html`
      <h2>${this.message}</h2>
      <p>If you see this, Lit components are working correctly.</p>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'simple-test': SimpleTest;
  }
}

import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { IgcButtonComponent, defineComponents } from "igniteui-webcomponents";

@customElement("pane-welcome")
export class PaneWelcome extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcButtonComponent);
  }

  protected override render(): unknown {
    return html`
      <span>Welcome!</span>
      <br />
      <igc-button @click=${this._handleClick}>Close</igc-button>
    `;
  }

  private _handleClick() {
    this.dispatchEvent(new Event("finish-introduction"));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-welcome": PaneWelcome;
  }
}

import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  IgcAvatarComponent,
  IgcIconComponent,
  IgcNavbarComponent,
  defineComponents,
  registerIcon,
} from "igniteui-webcomponents";

import iconMenu from "@material-symbols/svg-400/rounded/menu.svg";

import { currentSession } from "session";

@customElement("partial-navbar")
export class PartialNavbar extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcAvatarComponent, IgcIconComponent, IgcNavbarComponent);

    registerIcon("menu", iconMenu);
  }

  @state()
  private _session = currentSession();

  protected override render(): unknown {
    return html`
      <igc-navbar>
        <igc-icon
          name="menu"
          slot="start"
          @click=${() => {
            this.dispatchEvent(new Event("open-menu"));
          }}
        ></igc-icon>
        <h1>The Sign Link</h1>
        <igc-avatar
          slot="end"
          shape="circle"
          src=${this._session.photo}
          alt="User photo"
          @click=${() => {
            this.dispatchEvent(
              new CustomEvent("goto-url", {
                composed: true,
                detail: "/stats",
              }),
            );
          }}
        >
        </igc-avatar>
      </igc-navbar>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "partial-navbar": PartialNavbar;
  }
}

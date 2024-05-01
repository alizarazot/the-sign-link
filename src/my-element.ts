import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  defineComponents,
  IgcIconComponent,
  IgcNavbarComponent,
  IgcNavDrawerComponent,
  registerIcon,
} from "igniteui-webcomponents";

import "igniteui-webcomponents/themes/light/bootstrap.css";

import iconMenu from "@material-symbols/svg-400/rounded/menu.svg";
import iconHome from "@material-symbols/svg-400/rounded/home.svg";
import iconTrophy from "@material-symbols/svg-400/rounded/trophy.svg";

import * as logging from "pkg/logging";

import { registerServiceWorker } from "internal/service-worker";

import "internal/pane/home.ts";

@customElement("my-element")
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();

    logging.setDefaultLogger(new logging.Logger("TSL", logging.Level.Debug));

    defineComponents(
      IgcIconComponent,
      IgcNavbarComponent,
      IgcNavDrawerComponent,
    );

    registerServiceWorker();

    registerIcon("menu", iconMenu);
    registerIcon("home", iconHome);
    registerIcon("trophy", iconTrophy);
  }

  @query("igc-nav-drawer", true)
  private _navDrawer!: IgcNavDrawerComponent;

  override render() {
    return html`
      <igc-navbar>
        <igc-icon
          name="menu"
          slot="start"
          @click=${() => {
            this._navDrawer.show();
          }}
        ></igc-icon>
        <h1>The Sign Link</h1>
      </igc-navbar>

      <igc-nav-drawer>
        <igc-nav-drawer-header-item> The Sign Link </igc-nav-drawer-header-item>
        <igc-nav-drawer-item>
          <igc-icon slot="icon" name="home"></igc-icon>
          <span slot="content">Inicio</span>
        </igc-nav-drawer-item>
        <igc-nav-drawer-item>
          <igc-icon slot="icon" name="trophy"></igc-icon>
          <span slot="content">Clasificación</span>
        </igc-nav-drawer-item>
      </igc-nav-drawer>

      <pane-home></pane-home>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

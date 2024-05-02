import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  IgcIconComponent,
  IgcNavDrawerComponent,
  IgcNavbarComponent,
  defineComponents,
  registerIcon,
} from "igniteui-webcomponents";

import "igniteui-webcomponents/themes/light/bootstrap.css";

import iconMenu from "@material-symbols/svg-400/rounded/menu.svg";
import iconHome from "@material-symbols/svg-400/rounded/home.svg";
import iconTrophy from "@material-symbols/svg-400/rounded/trophy.svg";

import * as logging from "pkg/logging";

import { registerServiceWorker } from "internal/service-worker";

import "internal/pane/home.ts";
import "internal/pane/lesson.ts";
import type { Lesson } from "internal/pane/lesson.ts";
import type { PaneHome } from "internal/pane/home.ts";

@customElement("my-element")
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .pane {
      flex-grow: 1;
      overflow-y: auto;
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

    registerIcon("menu", iconMenu);
    registerIcon("home", iconHome);
    registerIcon("trophy", iconTrophy);

    registerServiceWorker();
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
        <igc-nav-drawer-item @click=${this.showHome}>
          <igc-icon slot="icon" name="home"></igc-icon>
          <span slot="content">Inicio</span>
        </igc-nav-drawer-item>
        <igc-nav-drawer-item>
          <igc-icon slot="icon" name="trophy"></igc-icon>
          <span slot="content">Clasificación</span>
        </igc-nav-drawer-item>
      </igc-nav-drawer>

      <div class="pane">
        <pane-home @start-lesson=${this._handleStartLesson}></pane-home>
        <pane-lesson hidden></pane-lesson>
      </div>
    `;
  }

  @query("pane-home", true)
  private _paneHome!: PaneHome;
  @query("pane-lesson", true)
  private _paneLesson!: Lesson;

  protected showHome() {
    this._paneLesson.setAttribute("hidden", "");
    this._paneHome.removeAttribute("hidden");
    this._navDrawer.toggle();
  }

  private _handleStartLesson(e: Event) {
    const elem = e.target as PaneHome;

    elem.setAttribute("hidden", "");
    this._paneLesson.removeAttribute("hidden");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

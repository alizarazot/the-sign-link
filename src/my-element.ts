import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import {
  IgcIconComponent,
  IgcNavDrawerComponent,
  IgcNavbarComponent,
  IgcAvatarComponent,
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
import "internal/pane/diagnostic-test.ts";

import type { Lesson } from "internal/pane/lesson.ts";
import type { PaneHome } from "internal/pane/home.ts";
import type { PaneDiagnosticTest } from "internal/pane/diagnostic-test.ts";

import { currentSession } from "internal/session";

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
      IgcAvatarComponent,
    );

    registerIcon("menu", iconMenu);
    registerIcon("home", iconHome);
    registerIcon("trophy", iconTrophy);

    registerServiceWorker();
  }

  @state()
  private _currentSession = currentSession();

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
        <igc-avatar
          slot="end"
          shape="circle"
          src=${this._currentSession.photo}
          alt="User photo"
        >
        </igc-avatar>
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
        <pane-home
          @start-lesson=${this._handleStartLesson}
          @start-diagnostic-test=${this._handleStartDiagnosticTest}
        ></pane-home>
        <pane-lesson hidden></pane-lesson>
        <pane-diagnostic-test hidden></pane-diagnostic-test>
      </div>
    `;
  }

  @query("pane-home", true)
  private _paneHome!: PaneHome;
  @query("pane-lesson", true)
  private _paneLesson!: Lesson;
  @query("pane-diagnostic-test", true)
  private _paneDiagnosticTest!: PaneDiagnosticTest;

  protected showHome() {
    this._paneLesson.setAttribute("hidden", "");
    this._paneDiagnosticTest.setAttribute("hidden", "");

    this._paneHome.removeAttribute("hidden");
    this._navDrawer.toggle();
  }

  private _handleStartLesson(e: Event) {
    const elem = e.target as PaneHome;

    elem.setAttribute("hidden", "");
    this._paneLesson.removeAttribute("hidden");
  }

  private _handleStartDiagnosticTest() {
    this._paneHome.setAttribute("hidden", "");
    this._paneDiagnosticTest.removeAttribute("hidden");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

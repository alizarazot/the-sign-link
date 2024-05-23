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

import "igniteui-webcomponents/themes/light/fluent.css";

import iconMenu from "@material-symbols/svg-400/rounded/menu.svg";
import iconHome from "@material-symbols/svg-400/rounded/home.svg";
import iconTrophy from "@material-symbols/svg-400/rounded/trophy.svg";
import iconStar from "@material-symbols/svg-400/rounded/star.svg";

import * as logging from "pkg/logging";

import { registerServiceWorker } from "internal/service-worker";

import "internal/pane/welcome.ts";
import "internal/pane/home.ts";
import "internal/pane/lesson.ts";

import type { PaneHome } from "internal/pane/home.ts";
import type { PaneWelcome } from "internal/pane/welcome.ts";
import type { PaneLesson } from "internal/pane/lesson.ts";

import { currentSession } from "internal/session";

import type { Lesson } from "internal/lesson";

@customElement("my-element")
export class MyElement extends LitElement {
  static override styles = css`
    :host,
    #root-pane {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    #root-pane[hidden=""] {
      display: none;
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
    registerIcon("star", iconStar);

    registerServiceWorker();
  }

  @state()
  private _currentSession = currentSession();

  @query("igc-nav-drawer", true)
  private _navDrawer!: IgcNavDrawerComponent;

  @query("#root-pane")
  private _rootPane!: HTMLDivElement;
  @query("pane-welcome")
  private _paneWelcome!: PaneWelcome;

  override render() {
    return html`
      <pane-welcome
        @finish-introduction=${() => {
          this._rootPane.removeAttribute("hidden");
          this._paneWelcome.setAttribute("hidden", "");
        }}
      ></pane-welcome>
      <div id="root-pane" hidden>
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
          <igc-nav-drawer-header-item>
            The Sign Link
          </igc-nav-drawer-header-item>
          <igc-nav-drawer-item @click=${this.showHome}>
            <igc-icon slot="icon" name="home"></igc-icon>
            <span slot="content">Inicio</span>
          </igc-nav-drawer-item>
          <igc-nav-drawer-item>
            <igc-icon slot="icon" name="trophy"></igc-icon>
            <span slot="content">Clasificación</span>
          </igc-nav-drawer-item>
          <igc-nav-drawer-item
            @click=${() => {
              this._paneWelcome.restart();
              this._paneWelcome.removeAttribute("hidden");
              this._rootPane.setAttribute("hidden", "");
              this._navDrawer.hide();
            }}
          >
            <igc-icon slot="icon" name="star"></igc-icon>
            <span slot="content">Motivación</span>
          </igc-nav-drawer-item>
        </igc-nav-drawer>

        <div class="pane">
          <pane-home @start-lesson=${this._handleStartLesson}></pane-home>
          <pane-lesson
            @end-lesson=${() => {
              this._paneHome.totalScore = 0;
              for (let i in this._currentSession.listPoints()) {
                this._paneHome.totalScore += this._currentSession.getPoints(i);
              }

              this.showHome();
            }}
            hidden
          ></pane-lesson>
        </div>
      </div>
    `;
  }

  @query("pane-home", true)
  private _paneHome!: PaneHome;
  @query("pane-lesson", true)
  private _paneLesson!: PaneLesson;

  protected showHome() {
    this._paneLesson.setAttribute("hidden", "");
    this._paneHome.removeAttribute("hidden");
    this._navDrawer.hide();
  }

  private _handleStartLesson(e: CustomEvent) {
    const elem = e.target as PaneHome;
    const lesson = e.detail as Lesson;

    this._paneLesson.lesson = lesson;

    elem.setAttribute("hidden", "");
    this._paneLesson.removeAttribute("hidden");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

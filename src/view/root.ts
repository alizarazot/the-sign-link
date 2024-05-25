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

import { registerServiceWorker } from "internal/service-worker";

import "view/welcome";
import "view/home";
import "view/lesson";
import "view/ranking";
import "view/stats";

import type { ViewHome } from "view/home";
import type { ViewWelcome } from "view/welcome";
import type { ViewLesson } from "view/lesson";
import type { ViewRanking } from "view/ranking";
import type { ViewStats } from "view/stats";

import type { Lesson } from "internal/lesson";
import { currentSession } from "internal/session";

@customElement("view-root")
export class ViewRoot extends LitElement {
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
  private _rootView!: HTMLDivElement;
  @query("view-welcome")
  private _viewWelcome!: ViewWelcome;

  override render() {
    return html`
      <view-welcome
        @finish-introduction=${() => {
          this._rootView.removeAttribute("hidden");
          this._viewWelcome.setAttribute("hidden", "");
        }}
      ></view-welcome>
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
            @click=${this._showStats}
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

          <igc-nav-drawer-item @click=${this.showRanking}>
            <igc-icon slot="icon" name="trophy"></igc-icon>
            <span slot="content">Clasificación</span>
          </igc-nav-drawer-item>

          <igc-nav-drawer-item
            @click=${() => {
              this._viewWelcome.restart();
              this._viewWelcome.removeAttribute("hidden");
              this._rootView.setAttribute("hidden", "");
              this._navDrawer.hide();
            }}
          >
            <igc-icon slot="icon" name="star"></igc-icon>
            <span slot="content">Motivación</span>
          </igc-nav-drawer-item>
        </igc-nav-drawer>

        <div class="pane">
          <view-home @start-lesson=${this._handleStartLesson}></view-home>
          <view-lesson
            @end-lesson=${() => {
              this._viewHome.loadTotalScore();
              this.showHome();
            }}
            hidden
          ></view-lesson>
          <view-stats hidden></view-stats>
          <view-ranking hidden></view-ranking>
        </div>
      </div>
    `;
  }

  @query("view-home", true)
  private _viewHome!: ViewHome;
  @query("view-lesson", true)
  private _viewLesson!: ViewLesson;
  @query("view-ranking", true)
  private _viewRanking!: ViewRanking;
  @query("view-stats")
  private _viewStats!: ViewStats;

  protected showHome() {
    this._viewLesson.setAttribute("hidden", "");
    this._viewStats.setAttribute("hidden", "");
    this._viewHome.removeAttribute("hidden");
    this._viewRanking.setAttribute("hidden", "");
    this._navDrawer.hide();
  }

  protected showRanking() {
    this._viewLesson.setAttribute("hidden", "");
    this._viewHome.setAttribute("hidden", "");
    this._viewRanking.removeAttribute("hidden"); // Muestra el ranking al hacer clic en la opción de clasificación
    this._navDrawer.toggle();
  }

  private _handleStartLesson(e: CustomEvent) {
    const elem = e.target as ViewHome;
    const lesson = e.detail as Lesson;

    this._viewLesson.reset();
    this._viewLesson.lesson = lesson;

    elem.setAttribute("hidden", "");
    this._viewLesson.removeAttribute("hidden");
    this._viewRanking.setAttribute("hidden", ""); // Oculta el ranking al mostrar una lección
  }

  private _showStats() {
    this._viewStats.lessons = this._viewHome.lessons;
    this._viewStats.points = this._currentSession.listPoints();
    this._viewHome.setAttribute("hidden", "");
    this._viewLesson.setAttribute("hidden", "");
    this._viewRanking.setAttribute("hidden", "");
    this._viewStats.removeAttribute("hidden");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-root": ViewRoot;
  }
}

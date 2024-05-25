import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import "igniteui-webcomponents/themes/light/fluent.css";

import { registerServiceWorker } from "internal/service-worker";

import "view/welcome";
import "view/home";
import "view/lesson";
import "view/ranking";
import "view/stats";

import type { ViewHome } from "view/home";
import type { ViewLesson } from "view/lesson";

import { PartialNavDrawer } from "./partial/nav-drawer";
import "./partial/navbar";

import type { Lesson } from "internal/lesson";

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

    registerServiceWorker();
  }

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  override render() {
    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>

      <div id="root-pane" hidden>
        <div class="pane">
          <view-home @start-lesson=${this._handleStartLesson}></view-home>
          <view-lesson></view-lesson>
        </div>
      </div>

      <partial-nav-drawer></partial-nav-drawer>
    `;
  }

  @query("view-lesson", true)
  private _viewLesson!: ViewLesson;

  private _handleStartLesson(e: CustomEvent) {
    const elem = e.target as ViewHome;
    const lesson = e.detail as Lesson;

    this._viewLesson.reset();
    this._viewLesson.lesson = lesson;

    elem.setAttribute("hidden", "");
    this._viewLesson.removeAttribute("hidden");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-root": ViewRoot;
  }
}

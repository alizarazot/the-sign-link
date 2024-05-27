import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
} from "igniteui-webcomponents";

import { Lesson, avaibleLessons, loadLesson } from "lesson";
import { currentSession } from "session";

import type { PartialNavDrawer } from "./partial/nav-drawer";

import "./partial/navbar";
import "./partial/nav-drawer";

@customElement("view-home")
export class ViewHome extends LitElement {
  static override styles = css`
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      padding: 20px;
    }

    :host([hidden]) {
      display: none;
    }

    igc-card {
      width: 480px;
    }

    igc-dialog:not([open]) {
      display: none;
    }

    igc-dialog::part(base) {
      width: 80vw;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();

    defineComponents(IgcDialogComponent, IgcCardComponent, IgcButtonComponent);

    avaibleLessons().then((lessons) => {
      for (let id of lessons) {
        loadLesson(id).then((lesson) => {
          this._lessons.set(id, lesson);
          this.requestUpdate();
        });
      }
    });

    this.loadTotalScore();
  }

  @state()
  private _lessons = new Map<string, Lesson>();

  @state()
  private _session = currentSession();

  @property({ type: Number })
  totalScore = 0;

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  override render() {
    if (this._lessons.size === 0) {
      return html`Loading...`;
    }

    const lessons = new Map<string, Lesson>();

    for (let [id, lesson] of this._lessons) {
      if (this._session.getPoints(id) <= 75) {
        lessons.set(id, lesson);
      }
    }

    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <div class="container">
        <igc-card>
          <igc-card-header>
            <h2 slot="title">Puntos totales: ${this.totalScore}</h2>
          </igc-card-header>
        </igc-card>
        ${(() => {
          const render = new Array<TemplateResult>();

          for (let [id, lesson] of lessons) {
            render.push(html`
              <igc-card>
                <igc-card-header>
                  <h2 slot="title">${lesson.name}</h2>
                </igc-card-header>
                <igc-card-content>
                  <p>${lesson.description}</p>
                </igc-card-content>
                <igc-card-actions>
                  <igc-button
                    slot="start"
                    @click=${() => {
                      this._startLesson(id);
                    }}
                    >Comenzar</igc-button
                  >
                </igc-card-actions>
              </igc-card>
            `);
          }

          return render;
        })()}
      </div>
    `;
  }

  private _startLesson(id: string) {
    this.dispatchEvent(
      new CustomEvent("goto-url", {
        composed: true,
        detail: `/lesson/${id}`,
      }),
    );
  }

  loadTotalScore() {
    this.totalScore = 0;
    for (let i in this._session.listPoints()) {
      this.totalScore += this._session.getPoints(i);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-home": ViewHome;
  }
}

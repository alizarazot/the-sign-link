import { LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
  registerIcon,
} from "igniteui-webcomponents";

import iconTrophy from "@material-symbols/svg-400/rounded/trophy.svg";

import { Lesson, avaibleLessons, loadLesson } from "lesson";
import { currentSession } from "session";

import type { PartialNavDrawer } from "./partial/nav-drawer";

import "./partial/navbar";
import "./partial/nav-drawer";

@customElement("view-home")
export class ViewHome extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;

      font-family: sans-serif;
    }

    :host([hidden]) {
      display: none;
    }

    .lessons {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      gap: 16px;
    }

    igc-card,
    igc-button.next-lesson {
      width: 100%;
      max-width: 480px;
      margin: auto;
    }

    .performance .horizontal {
      background-color: #0078d7;
    }

    .performance h2,
    .performance h3,
    .performance igc-icon {
      color: #fefefe;
    }

    .performance igc-icon {
      --size: 64px;
      padding-left: 16px;
    }

    igc-card .horizontal {
      display: flex;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();

    defineComponents(IgcDialogComponent, IgcCardComponent, IgcButtonComponent);
    registerIcon("trophy", iconTrophy);

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

    const colors = ["#d13438", "#038387", "#c30052", "#6b69d6"];

    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <div class="lessons">
        <igc-card class="performance">
          <div class="horizontal">
            <igc-card-media>
              <igc-icon name="trophy"></igc-icon>
            </igc-card-media>
            <igc-card-header>
              <h2 slot="title">Tu desempeño</h2>
              <h3 slot="subtitle">Puntuación total: ${this.totalScore}</h3>
            </igc-card-header>
          </div>
        </igc-card>

        <h2>Lecciones</h2>

        <igc-button
          class="next-lesson"
          @click=${() => {
            this._startLesson(lessons.entries().next().value[0]);
          }}
          >Siguiente lección</igc-button
        >

        ${(() => {
          const render = new Array<TemplateResult>();

          for (let [_, lesson] of lessons) {
            render.push(html`
              <igc-card
                style="border-color: ${colors[
                  Math.floor(Math.random() * colors.length)
                ]}"
              >
                <div class="horizontal">
                  <igc-card-media>
                    <img src=${lesson.image} />
                  </igc-card-media>
                  <div>
                    <igc-card-header>
                      <h2 slot="title">${lesson.name}</h2>
                    </igc-card-header>
                    <igc-card-content>
                      <p>${lesson.description}</p>
                    </igc-card-content>
                  </div>
                </div>
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

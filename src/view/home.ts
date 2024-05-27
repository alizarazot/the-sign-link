import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
} from "igniteui-webcomponents";

import { LessonData, LessonMetadata, avaibleLessons } from "lesson";
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
      this._lessonsMetadata = lessons;

      for (let [id] of this._lessonsMetadata) {
        this._lessonsMetadata
          .get(id)!
          .load()
          .then((lesson) => {
            this._lessonsData.set(id, lesson);
            this.requestUpdate();
          });
      }
    });

    this.loadTotalScore();
  }

  @state()
  private _lessonsMetadata = new Map<string, LessonMetadata>();
  @state()
  private _lessonsData = new Map<string, LessonData>();

  @state()
  private _session = currentSession();

  @property({ type: Number })
  totalScore = 0;

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  override render() {
    if (this._lessonsData.size === 0) {
      return html`Loading...`;
    }

    const lessonsId: string[] = [];
    for (let [id] of this._lessonsMetadata) {
      if (this._session.getPoints(id) <= 75) {
        lessonsId.push(id);
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
        ${lessonsId.map(
          (id) => html`
            <igc-card>
              <igc-card-header>
                <h2 slot="title">${this._lessonsMetadata.get(id)!.name}</h2>
                <h3 slot="subtitle">${this._lessonsData.get(id)!.title}</h3>
              </igc-card-header>
              <igc-card-content>
                <p>${this._lessonsData.get(id)!.description}</p>
              </igc-card-content>
              <igc-card-actions>
                <igc-button
                  slot="start"
                  @click=${() => {
                    this._startLesson(id);
                  }}
                  >Comenzar</igc-button
                >
                <igc-button
                  slot="end"
                  @click=${() => {
                    this._showLessonDescription(this._lessonsData.get(id)!);
                  }}
                  >Previsualizar</igc-button
                >
              </igc-card-actions>
            </igc-card>
          `,
        )}
      </div>

      <igc-dialog title="Descripción">
        <p>Por hacer...</p>
      </igc-dialog>
    `;
  }

  @query("igc-dialog", true)
  private _dialog!: IgcDialogComponent;

  private _showLessonDescription(lesson: LessonData) {
    this._dialog.innerHTML = `<p>${lesson.summary}</p>`;
    this._dialog.show();
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

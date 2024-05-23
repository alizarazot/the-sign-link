import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
} from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";
import { currentSession } from "internal/session";

@customElement("pane-home")
export class PaneHome extends LitElement {
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

    Lesson.avaible().then((lessons) => {
      this._lessons = lessons;
    });

    this.loadTotalScore();
  }

  @state()
  private _lessons: Lesson[] = [];

  @state()
  private _session = currentSession();

  @property({ type: Number })
  totalScore = 0;

  override render() {
    const lessons = this._lessons.filter(
      (lesson) => this._session.getPoints(lesson.id) <= 75,
    );

    return html`
      <div class="container">
        <igc-card>
          <igc-card-header>
            <h2 slot="title">Puntos totales: ${this.totalScore}</h2>
          </igc-card-header>
        </igc-card>
        ${lessons.map(
          (i) => html`
            <igc-card>
              <igc-card-header>
                <h2 slot="title">${i.name}</h2>
                <h3 slot="subtitle">${i.title}</h3>
              </igc-card-header>
              <igc-card-content>
                <p>${i.description}</p>
              </igc-card-content>
              <igc-card-actions>
                <igc-button
                  slot="start"
                  @click=${() => {
                    this._startLesson(i);
                  }}
                  >Comenzar</igc-button
                >
                <igc-button
                  slot="end"
                  @click=${() => {
                    this._showLessonDescription(i);
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

  private _showLessonDescription(lesson: Lesson) {
    this._dialog.innerHTML = `<p>${lesson.summary}</p>`;
    this._dialog.show();
  }

  private _startLesson(lesson: Lesson) {
    this.dispatchEvent(new CustomEvent("start-lesson", { detail: lesson }));
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
    "pane-home": PaneHome;
  }
}

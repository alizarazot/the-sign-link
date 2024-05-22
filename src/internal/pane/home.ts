import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
} from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";

@customElement("pane-home")
export class PaneHome extends LitElement {
  static override styles = css`
    :host {
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
  }

  @state()
  private _lessons: Lesson[] = [];

  override render() {
    return html`
      ${this._lessons.map(
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
              <igc-button slot="start" @click=${this._startLesson}
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

  private _startLesson() {
    this.dispatchEvent(new Event("start-lesson"));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-home": PaneHome;
  }
}

import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  defineComponents,
  IgcCardComponent,
  IgcButtonComponent,
  IgcDialogComponent,
} from "igniteui-webcomponents";

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
  }

  override render() {
    return html`
      <igc-card>
        <igc-card-header>
          <h2 slot="title">Lección 1</h2>
          <h3 slot="subtitle">Conceptos básicos de LSC</h3>
        </igc-card-header>
        <igc-card-content>
          <p>Aprende los conceptos básicos de Lengua de Señas Colombiana.</p>
        </igc-card-content>
        <igc-card-actions>
          <igc-button slot="start" @click=${this._startLesson}
            >Comenzar</igc-button
          >
          <igc-button slot="end" @click=${this._handleLessonDescription}
            >Previsualizar</igc-button
          >
        </igc-card-actions>
      </igc-card>

      <igc-card>
        <igc-card-header>
          <h2 slot="title">Lección 2</h2>
          <h3 slot="subtitle">Alfabeto</h3>
        </igc-card-header>
        <igc-card-content>
          <p>Aprende el alfabeto de la Lengua de Señas Colombiana.</p>
        </igc-card-content>
        <igc-card-actions>
          <igc-button slot="start">Comenzar</igc-button>
          <igc-button slot="end" @click=${this._handleLessonDescription}
            >Previsualizar</igc-button
          >
        </igc-card-actions>
      </igc-card>

      <igc-card>
        <igc-card-header>
          <h2 slot="title">Lección 3</h2>
          <h3 slot="subtitle">Gramática</h3>
        </igc-card-header>
        <igc-card-content>
          <p>Aprende la gramática de la Lengua de Señas Colombiana.</p>
        </igc-card-content>
        <igc-card-actions>
          <igc-button slot="start">Comenzar</igc-button>
          <igc-button slot="end" @click=${this._handleLessonDescription}
            >Previsualizar</igc-button
          >
        </igc-card-actions>
      </igc-card>

      <igc-dialog title="Descripción">
        <p>Por hacer...</p>
      </igc-dialog>
    `;
  }

  @query("igc-dialog", true)
  private _dialog!: IgcDialogComponent;

  private _handleLessonDescription() {
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

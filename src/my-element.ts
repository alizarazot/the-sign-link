import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  defineComponents,
  IgcNavbarComponent,
  IgcCardComponent,
  IgcDialogComponent,
  IgcButtonComponent,
} from "igniteui-webcomponents";

import "igniteui-webcomponents/themes/light/bootstrap.css";

import { registerServiceWorker } from "service-worker";

import * as logging from "pkg/logging";

@customElement("my-element")
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
      padding: 20px;
    }

    igc-card {
      width: 480px;
    }

    igc-dialog::part(base) {
      width: 80vw;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();

    logging.setDefaultLogger(new logging.Logger("TSL", logging.Level.Debug));

    defineComponents(
      IgcNavbarComponent,
      IgcCardComponent,
      IgcDialogComponent,
      IgcButtonComponent,
    );

    registerServiceWorker();
  }

  override render() {
    return html`
      <igc-navbar>
        <h1>The Sign Link</h1>
      </igc-navbar>

      <div class="container">
        <igc-card>
          <igc-card-header>
            <h2 slot="title">Lección 1</h2>
            <h3 slot="subtitle">Conceptos básicos de LSC</h3>
          </igc-card-header>
          <igc-card-content>
            <p>Aprende los conceptos básicos de Lengua de Señas Colombiana.</p>
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
            <h2 slot="title">Lección 2</h2>
            <h3 slot="subtitle">Alfabeto</h3>
          </igc-card-header>
          <igc-card-content>
            <p>Aprende el alfabeto de la Lengua de Señas Colombiana.</p>
          </igc-card-content>
          <igc-card-actions>
            <igc-button slot="start">Comenzar</igc-button>
            <igc-button slot="end">Previsualizar</igc-button>
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
            <igc-button slot="end">Previsualizar</igc-button>
          </igc-card-actions>
        </igc-card>
      </div>

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
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

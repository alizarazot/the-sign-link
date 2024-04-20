import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import {
  defineComponents,
  IgcNavbarComponent,
  IgcCardComponent,
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
      display: grid;
      place-items: center;
      margin-top: 20px;
    }

    igc-card {
      max-width: 320px;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();

    logging.setDefaultLogger(new logging.Logger("TSL", logging.Level.Debug));

    defineComponents(IgcNavbarComponent, IgcCardComponent, IgcButtonComponent);

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
            <h2 slot="title">¡Esta aplicación está en construcción!</h2>
            <h3 slot="subtitle">
              Un viaje a través de la Lengua de Señas Colombiana
            </h3>
          </igc-card-header>
          <igc-card-content>
            <p>
              Un proyecto que busca promover el aprendizaje y la valoración de
              la Lengua de Señas Colombiana (LSC) en todo el país.
            </p>
            <p>
              El objetivo es fortalecer la identidad cultural de la comunidad
              sorda, fomentar el respeto y la comprensión hacia la diversidad
              lingüística, y ampliar la oferta educativa inclusiva.
            </p>
          </igc-card-content>
          <igc-card-actions>
            <igc-button
              slot="start"
              href="https://github.com/alizarazot/the-sign-link"
              >Ver el código fuente</igc-button
            >
          </igc-card-actions>
        </igc-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}

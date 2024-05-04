import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import {
  IgcNavbarComponent,
  IgcStepperComponent,
  defineComponents,
} from "igniteui-webcomponents";

@customElement("pane-diagnostic-test")
export class PaneDiagnosticTest extends LitElement {
  static override styles = css`
    :host {
      display: block;
      height: 80px;
    }

    :host([hidden]) {
      display: none;
    }

    igc-stepper {
      padding: 2px;
      overflow-x: auto;
    }

    .container {
      max-width: 70ch;
      margin: auto;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcStepperComponent, IgcNavbarComponent);
  }

  protected override render() {
    return html`
      <igc-navbar>
        <h1>Prueba diagnóstica</h1>
      </igc-navbar>

      <igc-stepper>
        <igc-step>
          <span slot="title">Introducción</span>

          <div class="container">
            <h2>Introducción a la prueba diagnóstica de LSC</h2>
            <p>
              ¡Hola a todos! El presente examen tiene como objetivo evaluar el
              conocimiento de las personas en Lengua de Señas Colombiana (LSC).
            </p>
            <p>
              La prueba está diseñada para ser una herramienta útil para
              educadores, padres de familia y personas interesadas en medir su
              nivel de comprensión y dominio de la LSC.
            </p>

            <h2>¿Qué es la LSC?</h2>
            <p>
              La Lengua de Señas Colombiana (LSC) es una lengua natural y
              completa que utilizan las personas sordas y con dificultades
              auditivas en Colombia. Es un idioma visual que se expresa a través
              de gestos, expresiones faciales y movimientos corporales.
            </p>
            <p>
              La LSC tiene su propia gramática, sintaxis y vocabulario, y es tan
              compleja y rica como cualquier otra lengua hablada.
            </p>

            <h2>¿Por qué es importante aprender LSC?</h2>
            <p>
              Aprender LSC es fundamental para las personas sordas y con
              dificultades auditivas, ya que les permite comunicarse de manera
              efectiva con otros usuarios de la lengua y participar plenamente
              en la sociedad.
            </p>
            <p>
              Además, la LSC puede aportar grandes beneficios a las personas
              oyentes, como mejorar su capacidad de comunicación con personas
              sordas, ampliar su perspectiva cultural y desarrollar su empatía.
            </p>

            <h2>¿En qué consiste la prueba diagnóstica?</h2>

            <p>
              La prueba diagnóstica de LSC está compuesta por una serie de
              preguntas y actividades que evalúan diferentes aspectos del
              conocimiento de la lengua, como:
            </p>
            <ul>
              <li>Vocabulario</li>
              <li>Gramática</li>
              <li>Sintaxis</li>
              <li>Uso de la lengua en contextos reales</li>
            </ul>
            <p>
              La prueba está diseñada para ser accesible a personas de
              diferentes niveles de conocimiento de la LSC.
            </p>
          </div>
        </igc-step>

        <igc-step>
          <span slot="title">Instrucciones</span>

          <div class="container">
            <p>
              Por favor, lea atentamente cada pregunta y responda de la manera
              más completa y precisa posible. Si no está seguro de la respuesta
              a una pregunta, puede omitirla y volver a ella más tarde.
            </p>
            <p>
              No se preocupe si no sabe todas las respuestas, lo importante es
              que demuestre su conocimiento y comprensión de la LSC.
            </p>
          </div>
        </igc-step>

        <igc-step>
          <span slot="title">Preguntas</span>

          <div class="container">
            <p>TODO(alizarazot): Añadir preguntas.</p>
          </div>
        </igc-step>

        <igc-step>
          <span slot="title">Resumen</span>

          <div class="container">
            <p>
              Esperamos que esta prueba sea una herramienta útil para usted y
              para el desarrollo de la LSC en Colombia.
            </p>
          </div>
        </igc-step>
      </igc-stepper>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-diagnostic-test": PaneDiagnosticTest;
  }
}

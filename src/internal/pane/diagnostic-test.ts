import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  IgcNavbarComponent,
  IgcRadioComponent,
  IgcRadioGroupComponent,
  IgcStepperComponent,
  defineComponents,
} from "igniteui-webcomponents";

//import "internal/component/multiple-selection.ts";
//import { ComponentSingleChoiceQuestion } from "internal/component/multiple-selection.ts";

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

    .container component-multiple-selection {
      margin-bottom: 40px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(
      IgcStepperComponent,
      IgcNavbarComponent,
      IgcRadioGroupComponent,
      IgcRadioComponent,
    );
  }

  @state()
  private _score = 0;

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
            <component-multiple-selection
              question="¿Cuál es el alfabeto manual de la Lengua de Señas Colombiana?"
              correctAnswer="Un conjunto de gestos que representan las letras del abecedario español."
              answer1="El mismo que el alfabeto dactilológico español."
              answer2="Un alfabeto único que no se basa en ninguna otra lengua."
              answer3="La LSC no tiene un alfabeto manual."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Cómo se indica el plural en la LSC?"
              correctAnswer="Repitiendo el signo principal varias veces."
              answer1="Agregando un gesto específico que significa 'plural'."
              answer2="Usando expresiones faciales y corporales enfáticas."
              answer3="La LSC no tiene una forma específica para indicar el plural."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Qué son los clasificadores en la LSC?"
              correctAnswer="Gestos manuales que representan la forma, el tamaño o la ubicación de objetos o conceptos."
              answer1="Palabras señadas que se utilizan para describir características específicas."
              answer2="Marcadores gramaticales que indican la función de las palabras en una oración."
              answer3="La LSC no utiliza clasificadores."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Cuál es la estructura básica de una oración en la LSC?"
              correctAnswer="Sujeto-Verbo-Objeto (SVO)."
              answer1="Verbo-Sujeto-Objeto (VSO)."
              answer2="Objeto-Verbo-Sujeto (OVS)."
              answer3="La LSC no tiene una estructura de oración definida."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Qué son los modismos en la LSC?"
              correctAnswer="Expresiones idiomáticas que tienen un significado diferente al de las palabras individuales."
              answer1="Gestos manuales que representan emociones o ideas abstractas."
              answer2="Palabras señadas que se utilizan en contextos específicos."
              answer3="La LSC no tiene modismos."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Cómo se considera la Lengua de Señas Colombiana en Colombia?"
              correctAnswer="Una lengua oficial con los mismos derechos que el español."
              answer1="Un dialecto del español."
              answer2="Una lengua minoritaria sin reconocimiento oficial."
              answer3="La LSC no tiene un estatus legal definido en Colombia."
            ></component-multiple-selection>

            <component-multiple-selection
              question="¿Cuál es la importancia de aprender Lengua de Señas Colombiana?"
              correctAnswer="Todas las anteriores."
              answer1="Para comunicarse con personas sordas o con dificultades auditivas."
              answer2="Para promover la inclusión y la diversidad cultural."
              answer3="Para comprender mejor la cultura sorda en Colombia."
            ></component-multiple-selection>
          </div>
        </igc-step>

        <igc-step>
          <span slot="title">Resumen</span>

          <div class="container">
            <p>
              Esperamos que esta prueba sea una herramienta útil para usted y
              para el desarrollo de la LSC en Colombia.
            </p>
            <igc-button @click=${this._getScore}>Calcular puntaje</igc-button>
            <p>Su puntaje fue: ${this._score}</p>
          </div>
        </igc-step>
      </igc-stepper>
    `;
  }

  private _getScore() {
    this._score = 0;

    this.renderRoot
      .querySelectorAll<ComponentSingleChoiceQuestion>(
        "component-multiple-selection",
      )
      .forEach((elem) => {
        if (elem.isActiveCorrectAnswer()) {
          this._score++;
        }
      });

    this._score *= 100 / 7;
    this._score = Math.round(this._score);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-diagnostic-test": PaneDiagnosticTest;
  }
}

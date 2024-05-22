import { LitElement, css, html, type CSSResultGroup } from "lit";
import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";

import {
  IgcNavbarComponent,
  IgcStepperComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";
import { ComponentSingleChoiceQuestion } from "internal/component/single-choice-question.ts";

@customElement("pane-lesson")
export class PaneLesson extends LitElement {
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

    .container component-single-choice-question {
      margin-bottom: 40px;
    }

    .result {
      text-align: center;
      font-weight: bold;
      font-size: 50px;
      display: block;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcNavbarComponent, IgcStepperComponent);
  }

  @property({ attribute: false })
  lesson = new Lesson("", "", "", [], "", "", [], []); // Prevent undefined lesson.

  @state()
  private _score = 0;

  protected override render(): unknown {
    let questions: ComponentSingleChoiceQuestion[] = [];

    for (let question of this.lesson.questions) {
      questions.push(new ComponentSingleChoiceQuestion(question));
    }

    return html`
      <igc-navbar>
        <h1>${this.lesson.name}</h1>
      </igc-navbar>

      <igc-stepper @igcActiveStepChanging=${this._calculateScore}>
        <igc-step>
          <span slot="title">Descripción</span>
          <div class="container">
            ${this.lesson.content.map((i) => {
              switch (i.type) {
                case "title":
                  return html`<h2>${i.content}</h2>`;
                  break;
                case "paragraph":
                  return html`<p>${i.content}</p>`;
                  break;
                case "image":
                  return html`<img src=${i.content} />`;
                  break;
              }
            })}
          </div>
        </igc-step>
        <igc-step>
          <span slot="title">Preguntas</span>
          <div class="container">${questions}</div>
        </igc-step>
        <igc-step>
          <span slot="title">Resultados</span>
          <div class="container">
            <p>Estos son los resultados de tu prueba:</p>
            <span class="result">${this._score}/100.</span>
          </div>
        </igc-step>
      </igc-stepper>
    `;
  }

  @queryAll("component-single-choice-question")
  private _singleChoiceQuestions!: ComponentSingleChoiceQuestion[];

  protected _calculateScore() {
    this._score = 0;

    this._singleChoiceQuestions.forEach((question) => {
      if (question.isActiveCorrectAnswer()) {
        this._score += 100 / this._singleChoiceQuestions.length;
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-lesson": PaneLesson;
  }
}

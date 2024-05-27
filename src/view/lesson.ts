import { LitElement, css, html } from "lit";

import {
  customElement,
  property,
  query,
  queryAll,
  state,
} from "lit/decorators.js";

import {
  IgcButtonComponent,
  IgcStepperComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { ComponentSingleChoiceQuestion } from "component/single-choice-question";

import { Lesson, loadLesson } from "lesson";
import { currentSession } from "session";

import type { PartialNavDrawer } from "view/partial/nav-drawer";

import "view/partial/nav-drawer";
import "view/partial/navbar";

@customElement("view-lesson")
export class ViewLesson extends LitElement {
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

    img {
      max-width: 80%;
      width: 300px;
      margin: 40px auto;
      display: block;
      border: 5px solid #000;
      border-radius: 25px;
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

    if (this._lesson == null) {
      loadLesson(this.lessonId).then((lesson) => {
        this._lesson = lesson;
      });
    }

    defineComponents(IgcButtonComponent, IgcStepperComponent);
  }

  @property()
  lessonId: string = "";

  @state()
  private _lesson?: Lesson;

  @state()
  private _score = 0;

  @query("partial-nav-drawer")
  private _navDrawer!: PartialNavDrawer;

  protected override render(): unknown {
    if (this._lesson == null) {
      return html`Loading...`;
    }

    let questions: ComponentSingleChoiceQuestion[] = [];

    for (let [_, question] of this._lesson.questions) {
      questions.push(new ComponentSingleChoiceQuestion(question));
    }

    console.log(this._lesson);

    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <igc-stepper @igcActiveStepChanging=${this._calculateScore}>
        <igc-step>
          <span slot="title">Descripción</span>
          <div class="container">
            ${this._lesson.questions.get("q-1")!.information.map((i) => {
              // ^ Temporary workarount.
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
            <igc-button @click=${this._handleLessonEnd}
              >Finalizar lección</igc-button
            >
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

  private _handleLessonEnd() {
    if (this._lesson != null) {
      currentSession().setPoints(this.lessonId, this._score);
    }

    this.dispatchEvent(
      new CustomEvent("goto-url", { composed: true, detail: "/" }),
    );
  }

  @query("igc-stepper")
  private _igcStepper!: IgcStepperComponent;

  reset() {
    this._igcStepper.navigateTo(0);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-lesson": ViewLesson;
  }
}

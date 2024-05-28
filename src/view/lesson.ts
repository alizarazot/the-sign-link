import { LitElement, css, html } from "lit";

import { customElement, property, queryAll, state } from "lit/decorators.js";

import {
  IgcButtonComponent,
  IgcCardComponent,
  IgcCircularProgressComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { ComponentSingleChoiceQuestion } from "component/single-choice-question";

import { Lesson, loadLesson } from "lesson";
import { currentSession } from "session";

@customElement("view-lesson")
export class ViewLesson extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100dvh;
      padding: 16px;
      gap: 16px;
      box-sizing: border-box;
    }

    igc-circular-progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
    }

    igc-button.close {
      align-self: flex-start;
    }

    igc-card {
      width: fit-content;
      align-self: center;
      margin: auto;

      display: flex;
      flex-direction: row;
    }

    .content {
      max-width: 70ch;
    }

    @media (max-width: 500px) {
      igc-card {
        flex-direction: column;
      }

      .media {
        overflow-y: hidden;
      }
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    if (this._lesson == null) {
      loadLesson(this.lessonId).then((lesson) => {
        this._lesson = lesson;
      });
    }

    defineComponents(
      IgcButtonComponent,
      IgcCardComponent,
      IgcCircularProgressComponent,
    );
  }

  @property()
  lessonId: string = "";

  @state()
  private _lesson?: Lesson;
  @state()
  private _currentQuestion = "";
  @state()
  private _score = 0;

  protected override render(): unknown {
    if (this._lesson == null) {
      return html`
        <!-- Show a spinner while lesson loads. -->
        <igc-circular-progress indeterminate></igc-circular-progress>
      `;
    }

    if (this._currentQuestion === "") {
      return html`
        <igc-button class="close" @click=${this._handleLessonEnd}
          >Volver al inicio</igc-button
        >
        <igc-card>
          <div class="media">
            <igc-card-media>
              <img src=${this._lesson.image} />
            </igc-card-media>
          </div>
          <div class="content">
            <igc-card-header>
              <h2>${this._lesson.name}</h2>
            </igc-card-header>
            <igc-card-content>
              <p>${this._lesson.description}</p>
            </igc-card-content>
            <igc-card-actions>
              <igc-button @click=${this._nextQuestion}>
                Comenzar lección
              </igc-button>
            </igc-card-actions>
          </div>
        </igc-card>
      `;
    }

    return html`
      <igc-button class="close" @click=${this._handleLessonEnd}
        >Volver al inicio</igc-button
      >
      <igc-card>
        <igc-card-header><h2 slot="title">Títutlo</h2></igc-card-header>
        <igc-card-content>This is content</igc-card-content>
        <igc-card-actions>
          <igc-button>Verificar</igc-button>
        </igc-card-actions>
      </igc-card>
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

  private _nextQuestion() {
    this._currentQuestion = this._lesson?.questions.entries().next().value[0];
  }

  private _handleLessonEnd() {
    if (this._lesson != null) {
      currentSession().setPoints(this.lessonId, this._score);
    }

    this.dispatchEvent(
      new CustomEvent("goto-url", { composed: true, detail: "/" }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-lesson": ViewLesson;
  }
}

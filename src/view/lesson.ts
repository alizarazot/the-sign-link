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
  IgcCardComponent,
  IgcCardContentComponent,
  IgcCircularProgressComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { ComponentSingleChoiceQuestion } from "component/single-choice-question";

import { Lesson, Question, loadLesson } from "lesson";
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
      width: 100%;
      max-width: 70ch;

      align-self: center;
      margin: auto;
    }

    igc-card.resume {
      width: fit-content;
      max-width: none;

      display: flex;
      flex-direction: row;
    }

    .resume .content {
      max-width: 70ch;
    }

    igc-card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    igc-card-content img {
      width: 100%;
      max-width: 35ch;
      display: block;
      margin: 0 auto;
    }

    igc-button.next {
      width: 100%;
    }

    @media (max-width: 500px) {
      igc-card.resume {
        flex-direction: column;
      }

      .resume .media {
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
        <igc-card class="resume">
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

    const question = this._lesson.questions.get(this._currentQuestion)!;

    return html`
      <igc-button class="close" @click=${this._handleLessonEnd}
        >Volver al inicio</igc-button
      >
      <igc-card>
        <igc-card-header>
          <h2 slot="title">Tema</h2>
          <h3 slot="subtitle">${this._lesson.name}</h3>
        </igc-card-header>
        <igc-card-content>
          ${question.information.map((info) => {
            switch (info.type) {
              case "title":
                return html`<h4>${info.content}</h4>`;
              case "paragraph":
                return html`<p>${info.content}</p>`;
              case "image":
                return html`<img src=${info.content} />`;
            }
          })}
        </igc-card-content>
        <igc-card-actions>
          <igc-button class="next" @click=${this._nextQuestion}
            >Continuar</igc-button
          >
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

  @state()
  private _questionIterator?: IterableIterator<[string, Question]>;
  @query("igc-card-content")
  private _informationContainer!: IgcCardContentComponent;

  private _nextQuestion() {
    if (this._questionIterator == null) {
      this._questionIterator = this._lesson?.questions.entries();
    }

    const nextQuestion = this._questionIterator?.next().value?.[0];

    if (nextQuestion == null) {
      this._handleLessonEnd();
      return;
    }

    this._currentQuestion = nextQuestion;
    this._informationContainer.scrollTop = 0;
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

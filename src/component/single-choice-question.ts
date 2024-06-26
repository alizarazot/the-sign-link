import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import {
  IgcRadioComponent,
  IgcRadioGroupComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { Question } from "lesson";

@customElement("component-single-choice-question")
export class ComponentSingleChoiceQuestion extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    h4 {
      margin-top: 0;
    }

    igc-radio {
      padding-left: 20px;
    }
  `;

  constructor(question: Question) {
    super();

    this.question = question;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcRadioGroupComponent, IgcRadioComponent);
  }

  @property({ attribute: false })
  question: Question;

  @state()
  private _lastRadio = -1;

  override render() {
    return html`
      <h4>${this.question.question}</h4>
      <igc-radio-group>
        ${this.question.answers.map(
          (elem, i) => html`
            <igc-radio @click=${this._handleRadioClick} data-index=${i}>
              ${elem}
            </igc-radio>
          `,
        )}
      </igc-radio-group>
    `;
  }

  private _handleRadioClick(e: Event) {
    if (this._lastRadio >= 0) {
      (
        this.shadowRoot?.querySelectorAll("igc-radio")[
          this._lastRadio
        ] as IgcRadioComponent
      ).checked = false;
    }

    (e.target as IgcRadioComponent).checked = true;

    this._lastRadio = parseInt(
      (e.target as IgcRadioComponent).getAttribute("data-index") ?? "-1",
    );
  }

  isActiveCorrectAnswer(): boolean {
    if (this._lastRadio < 0) {
      return false;
    }

    if (this._lastRadio === this.question.correct) {
      return true;
    }

    return false;
  }
}

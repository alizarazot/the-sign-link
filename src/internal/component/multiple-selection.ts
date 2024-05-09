import {
  IgcRadioComponent,
  IgcRadioGroupComponent,
  defineComponents,
} from "igniteui-webcomponents";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("component-multiple-selection")
export class ComponentMultipleSelection extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    igc-radio {
      padding-left: 20px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcRadioGroupComponent, IgcRadioComponent);
  }

  @property({ type: String, reflect: true })
  question: string = "";

  @property({ type: String, reflect: true })
  correctAnswer: string = "";

  @property({ type: String, reflect: true })
  answer1: string = "";
  @property({ type: String, reflect: true })
  answer2: string = "";
  @property({ type: String, reflect: true })
  answer3: string = "";

  @state()
  private _lastRadio = -1;

  override render() {
    return html` <span>${this.question}</span>
      <igc-radio-group>
        ${[this.correctAnswer, this.answer1, this.answer2, this.answer3].map(
          (elem, i) =>
            html`<igc-radio @click=${this._handleRadioClick} data-index=${i}
              >${elem}</igc-radio
            >`,
        )}
      </igc-radio-group>`;
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

    if (
      (
        this.shadowRoot?.querySelectorAll("igc-radio")[
          this._lastRadio
        ] as IgcRadioComponent
      ).innerText === this.correctAnswer
    ) {
      return true;
    }

    return false;
  }
}

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  IgcNavbarComponent,
  IgcStepperComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";

@customElement("pane-lesson")
export class PaneLesson extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcNavbarComponent, IgcStepperComponent);
  }

  @property({ attribute: false })
  lesson = new Lesson("", "", "", [], "", "", [], []); // Prevent undefined lesson.

  protected override render(): unknown {
    console.log(this.lesson.content);
    return html`
      <igc-navbar>
        <h1>${this.lesson.name}</h1>
      </igc-navbar>

      <igc-stepper>
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
      </igc-stepper>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-lesson": PaneLesson;
  }
}

import type { Lesson } from "internal/lesson";
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("pane-lesson")
export class PaneLesson extends LitElement {
  @property({ attribute: false })
  lesson!: Lesson;

  protected override render(): unknown {
    return html`Current lesson: ${JSON.stringify(this.lesson)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-lesson": PaneLesson;
  }
}

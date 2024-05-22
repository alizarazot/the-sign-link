import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("pane-lesson")
export class PaneLesson extends LitElement {
  protected override render(): unknown {
    return html` Contenido de la lección. `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-lesson": PaneLesson;
  }
}

import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  IgcListComponent,
  IgcNavbarComponent,
  defineComponents,
} from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";

@customElement("pane-stats")
export class PaneStats extends LitElement {
  static override styles = css`
    igc-list {
      padding: 15px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcNavbarComponent, IgcListComponent);
  }

  @property({ attribute: false })
  lessons: Lesson[] = [];
  @property({ attribute: false })
  points: { [id: string]: number } = {};

  protected override render(): unknown {
    return html`
      <igc-navbar>
        <h2>Estadísticas</h2>
      </igc-navbar>

      <igc-list>
        ${this.lessons
          .filter((i) => (this.points[i.id] ?? 0) != 0)
          .map(
            (i) => html`
              <igc-list-item
                >${i.name}: ${this.points[i.id]} puntos.</igc-list-item
              >
            `,
          )}
      </igc-list>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-stats": PaneStats;
  }
}

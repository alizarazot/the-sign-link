import { LitElement, css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { IgcListComponent, defineComponents } from "igniteui-webcomponents";

import { Lesson } from "internal/lesson";

import type { PartialNavDrawer } from "./partial/nav-drawer";

import "view/partial/navbar";
import "view/partial/nav-drawer";

@customElement("view-stats")
export class ViewStats extends LitElement {
  static override styles = css`
    igc-list {
      padding: 15px;
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcListComponent);
  }

  @property({ attribute: false })
  lessons: Lesson[] = [];
  @property({ attribute: false })
  points: { [id: string]: number } = {};

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  protected override render(): unknown {
    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <h1>Estadísticas</h1>

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
    "view-stats": ViewStats;
  }
}

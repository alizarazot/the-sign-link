import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import { IgcListComponent, defineComponents } from "igniteui-webcomponents";

import { Lesson } from "lesson";
import { currentSession } from "internal/session";

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

    Lesson.avaible().then((lessons) => {
      this._lessons = lessons;
    });

    defineComponents(IgcListComponent);
  }

  @state()
  private _lessons: { [id: string]: Lesson } = {};
  @state()
  private _session = currentSession();

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  protected override render(): unknown {
    const idsWithPoints = [];
    for (let id in this._lessons) {
      if (this._session.getPoints(id) > 0) {
        idsWithPoints.push(id);
      }
    }

    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <h1>Estadísticas</h1>

      <igc-list>
        ${idsWithPoints.map(
          (id) => html`
            <igc-list-item
              >${this._lessons[id].name}: ${this._session.getPoints(id)}
              puntos.</igc-list-item
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

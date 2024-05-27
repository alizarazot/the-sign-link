import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import { IgcListComponent, defineComponents } from "igniteui-webcomponents";

import { Lesson, avaibleLessons, loadLesson } from "lesson";
import { currentSession } from "session";

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

    avaibleLessons().then((lessons) => {
      for (let id of lessons) {
        loadLesson(id).then((lesson) => {
          this._lessons.set(id, lesson);
          this.requestUpdate();
        });
      }
    });

    defineComponents(IgcListComponent);
  }

  @state()
  private _lessons = new Map<string, Lesson>();
  @state()
  private _session = currentSession();

  @query("partial-nav-drawer", true)
  private _navDrawer!: PartialNavDrawer;

  protected override render(): unknown {
    const lessonsWithPoints = new Array<{ name: string; points: number }>();
    for (let [id, lesson] of this._lessons) {
      const points = this._session.getPoints(id);
      if (points > 0) {
        lessonsWithPoints.push({ name: lesson.name, points: points });
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
        ${lessonsWithPoints.map(
          (lesson) => html`
            <igc-list-item
              >${lesson.name}: ${lesson.points} puntos.</igc-list-item
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

import { LitElement, css, html, type TemplateResult } from "lit";
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
    :host {
      font-family: sans-serif;
    }

    h2 {
      text-align: center;
    }

    igc-list {
      margin: auto;
      max-width: 70ch;
    }

    strong {
      font-weight: bold;
    }

    p.nothing {
      text-align: center;
      margin: 0 16px;
      margin-bottom: 8px;
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

    let points: TemplateResult;

    if (lessonsWithPoints.length === 0) {
      points = html`
        <p class="nothing">¡Aun no hay puntos!</p>
        <p class="nothing">Haz lecciones para ganar puntos.</p>
      `;
    } else {
      points = html`
        <igc-list>
          ${lessonsWithPoints.map(
            (lesson) => html`
              <igc-list-item>
                <strong>${lesson.name}:</strong> ${lesson.points} puntos.
              </igc-list-item>
            `,
          )}
        </igc-list>
      `;
    }

    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <h2>Estadísticas</h2>

      ${points}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-stats": ViewStats;
  }
}

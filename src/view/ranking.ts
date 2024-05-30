import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import type { PartialNavDrawer } from "./partial/nav-drawer";

import "./partial/navbar";
import "./partial/nav-drawer";
import { IgcListComponent, defineComponents } from "igniteui-webcomponents";

interface Player {
  name: string;
  score: number;
}

@customElement("view-ranking")
export class ViewRanking extends LitElement {
  static override styles = css`
    :host {
      font-family: sans-serif;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    partial-navbar {
      align-self: stretch;
    }

    h2 {
      margin: 0;
    }

    strong {
      font-weight: bold;
    }
  `;

  private players: Player[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.usuarios();

    defineComponents(IgcListComponent);
  }

  addPlayer(name: string, score: number) {
    this.players.push({ name, score });
    this.players.sort((a, b) => b.score - a.score); // Ordena el ranking por puntaje (de mayor a menor)
    this.requestUpdate(); // Actualiza el DOM
  }

  @query("partial-nav-drawer")
  private _navDrawer!: PartialNavDrawer;

  override render() {
    return html`
      <partial-navbar
        @open-menu=${() => {
          this._navDrawer.show();
        }}
      ></partial-navbar>
      <partial-nav-drawer></partial-nav-drawer>

      <h2>Ranking</h2>
      <igc-list>
        ${this.players.map(
          (player) => html`
            <igc-list-item>
              <strong>${player.name}:</strong> ${player.score} puntos.
            </igc-list-item>
          `,
        )}
      </igc-list>
    `;
  }

  private usuarios() {
    const ranking = this;

    ranking.addPlayer("Usuario anónimo", 100);
    ranking.addPlayer("Usuario anónimo", 80);
    ranking.addPlayer("Usuario anónimo", 120);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-ranking": ViewRanking;
  }
}

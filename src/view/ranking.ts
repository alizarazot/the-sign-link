import { LitElement, css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import type { PartialNavDrawer } from "./partial/nav-drawer";

import "./partial/navbar";
import "./partial/nav-drawer";

interface Player {
  name: string;
  score: number;
}

@customElement("view-ranking")
export class ViewRanking extends LitElement {
  static override styles = css`
    h2 {
      display: flex;
      justify-content: center;
    }
    ul {
      display: grid;
      place-items: center;
    }
  `;

  private players: Player[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.usuarios();
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
      <ul>
        ${this.players.map(
          (player) => html`<li>${player.name}: ${player.score + " pts"}</li>`,
        )}
      </ul>
    `;
  }

  private usuarios() {
    const ranking = this;

    // Ejemplo: Agregar usuarios al ranking
    ranking.addPlayer("Usuario 1", 100);
    ranking.addPlayer("Usuario 2", 80);
    ranking.addPlayer("Usuario 3", 120);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "view-ranking": ViewRanking;
  }
}

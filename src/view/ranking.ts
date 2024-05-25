import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

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

  constructor() {
    super();
    this.usuarios();
  }

  addPlayer(name: string, score: number) {
    this.players.push({ name, score });
    this.players.sort((a, b) => b.score - a.score); // Ordena el ranking por puntaje (de mayor a menor)
    this.requestUpdate(); // Actualiza el DOM
  }

  override render() {
    return html`
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

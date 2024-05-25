import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import {
  IgcIconButtonComponent,
  defineComponents,
  registerIcon,
} from "igniteui-webcomponents";

import iconArrowBack from "@material-symbols/svg-400/rounded/arrow_back.svg";
import iconArrowForward from "@material-symbols/svg-400/rounded/arrow_forward.svg";

@customElement("view-welcome")
export class ViewWelcome extends LitElement {
  static override styles = css`
    :host {
      user-select: none;
    }

    .container {
      font-family: sans-serif;
      color: white;

      height: 100vh;
      box-sizing: border-box;

      transition: background-color linear 2s;

      display: grid;
      grid-template-areas:
        "back title forward"
        "back desc forward";
    }

    .title,
    .desc {
      display: block;
      text-align: center;
      margin: 30px;
    }

    .title {
      grid-area: title;
      font-size: 60px;
    }

    .desc {
      grid-area: desc;
      font-size: 35px;
    }

    igc-icon-button,
    igc-icon-button::part(base) {
      height: 100%;
      width: 15vw;
      background-color: transparent;
      border-radius: 0;
    }

    igc-icon-button::part(base):hover {
      background-color: rgba(0, 0, 0, 0.2);
      box-shadow: none;
    }

    igc-icon-button::part(base):active {
      background-color: rgba(0, 0, 0, 0.4);
      box-shadow: none;
    }

    igc-icon-button::part(base):focus {
      box-shadow: none;
    }

    [name="arrow-back"] {
      grid-area: back;
    }

    [name="arrow-forward"] {
      grid-area: forward;
    }

    @media (max-width: 700px) {
      .container {
        grid-template-areas:
          "title title"
          "desc desc"
          "back forward";
      }

      igc-icon-button,
      igc-icon-button::part(base) {
        width: 50vw;
      }
    }

    @media (max-width: 1200px) {
      .title {
        font-size: 40px;
      }

      .desc {
        font-size: 20px;
      }
    }

    @media (max-width: 330px) {
      .title,
      .desc {
        margin: 10px;
      }

      .title {
        font-size: 30px;
      }

      .desc {
        font-size: 16px;
      }
    }
  `;

  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcIconButtonComponent);

    registerIcon("arrow-back", iconArrowBack);
    registerIcon("arrow-forward", iconArrowForward);

    if (localStorage.getItem("no-welcome") === "1") {
      this._removeWelcome();
    }
  }

  @state()
  private _screenIndex = 0;

  protected override render(): unknown {
    return html`
      <div
        class="container"
        style="background-color: ${screens[this._screenIndex].color}"
      >
        <span class="title">${screens[this._screenIndex].title}</span>
        <span class="desc">${screens[this._screenIndex].desc}</span>
        <igc-icon-button
          name="arrow-back"
          @click=${() => {
            if (this._screenIndex > 0) {
              this._screenIndex--;
            }
          }}
        ></igc-icon-button>
        <igc-icon-button
          name="arrow-forward"
          @click=${() => {
            if (this._screenIndex < screens.length - 1) {
              this._screenIndex++;
              return;
            }

            this._removeWelcome();
          }}
        ></igc-icon-button>
      </div>
    `;
  }

  private _removeWelcome() {
    this.dispatchEvent(new Event("finish-introduction"));
    localStorage.setItem("no-welcome", "1");
  }

  restart() {
    this._screenIndex = 0;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "view-welcome": ViewWelcome;
  }
}

class Screen {
  constructor(
    public color: string,
    public title: string,
    public desc: string,
  ) {}
}

const screens = [
  new Screen(
    "#0078d7",
    "¡Derriba barreras de comunicación!",
    "Genera un impacto positivo al facilitar la inclusión y la accesibilidad para las personas sordas en tu entorno.",
  ),
  new Screen(
    "#d13438",
    "¡Desarrolla nuevas habilidades!",
    "Amplía tus perspectivas al desarrollar una nueva forma de comunicación y expresión.",
  ),
  new Screen(
    "#038387",
    "¡Abre nuevas oportunidades!",
    "Contribuye a la sociedad al participar en proyectos de inclusión y ayudar a crear una sociedad más justa.",
  ),
  new Screen(
    "#c30052",
    "¡Experimenta la satisfacción personal!",
    "Contribuye a una causa noble al apoyar a la comunidad sorda y luchar por sus derechos.",
  ),
  new Screen(
    "#6b69d6",
    "¡Un idioma único y fascinante!",
    "¡Anímate a aprender Lengua de Señas Colombiana y descubre un mundo de nuevas posibilidades!",
  ),
];

import { LitElement, html } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  IgcIconComponent,
  IgcNavDrawerComponent,
  defineComponents,
  registerIcon,
} from "igniteui-webcomponents";

import iconHome from "@material-symbols/svg-400/rounded/home.svg";
import iconTrophy from "@material-symbols/svg-400/rounded/trophy.svg";
import iconStar from "@material-symbols/svg-400/rounded/star.svg";

@customElement("partial-nav-drawer")
export class PartialNavDrawer extends LitElement {
  override connectedCallback(): void {
    super.connectedCallback();

    defineComponents(IgcIconComponent, IgcNavDrawerComponent);

    registerIcon("home", iconHome);
    registerIcon("trophy", iconTrophy);
    registerIcon("star", iconStar);
  }

  protected override render(): unknown {
    return html`
      <igc-nav-drawer>
        <igc-nav-drawer-header-item> The Sign Link </igc-nav-drawer-header-item>
        <igc-nav-drawer-item
          @click=${() => {
            this._goto("/");
          }}
        >
          <igc-icon slot="icon" name="home"></igc-icon>
          <span slot="content">Inicio</span>
        </igc-nav-drawer-item>

        <igc-nav-drawer-item
          @click=${() => {
            this._goto("/ranking");
          }}
        >
          <igc-icon slot="icon" name="trophy"></igc-icon>
          <span slot="content">Clasificación</span>
        </igc-nav-drawer-item>

        <igc-nav-drawer-item
          @click=${() => {
            this._goto("/motivation");
          }}
        >
          <igc-icon slot="icon" name="star"></igc-icon>
          <span slot="content">Motivación</span>
        </igc-nav-drawer-item>
      </igc-nav-drawer>
    `;
  }

  @query("igc-nav-drawer", true)
  private _navDrawer!: IgcNavDrawerComponent;

  show(): void {
    this._navDrawer.show();
  }

  hide(): void {
    this._navDrawer.hide();
  }

  private _goto(url: string): void {
    this.dispatchEvent(
      new CustomEvent("goto-url", {
        composed: true,
        detail: url,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "partial-nav-drawer": PartialNavDrawer;
  }
}

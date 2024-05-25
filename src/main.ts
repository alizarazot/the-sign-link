import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { Router } from "@lit-labs/router";
import "urlpattern-polyfill";

import { registerServiceWorker } from "internal/service-worker";

import "igniteui-webcomponents/themes/light/fluent.css";

import "view/root.ts";

@customElement("main-component")
export class MainComponent extends LitElement {
  private router = new Router(this, [
    { path: "/", render: () => html`<view-root></view-root>` },
  ]);

  override connectedCallback(): void {
    super.connectedCallback();

    registerServiceWorker();
  }

  protected override render(): unknown {
    return this.router.outlet();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "main-component": MainComponent;
  }
}

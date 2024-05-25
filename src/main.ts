import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import { Router } from "@lit-labs/router";
import "urlpattern-polyfill";

import { registerServiceWorker } from "internal/service-worker";

import "igniteui-webcomponents/themes/light/fluent.css";

import "view/home";
import "view/motivation";
import "view/ranking";
import "view/stats";

@customElement("main-component")
export class MainComponent extends LitElement {
  private router = new Router(this, [
    { path: "/", render: () => html`<view-home></view-home>` },
    {
      path: "/motivation",
      render: () => html`<view-motivation></view-motivation>`,
    },
    {
      path: "/ranking",
      render: () => html`<view-ranking></view-ranking>`,
    },
    {
      path: "/stats",
      render: () => html`<view-stats></view-stats>`,
    },
  ]);

  override connectedCallback(): void {
    super.connectedCallback();

    registerServiceWorker();

    // @ts-ignore: Event declared in `view/partial/nav-drawer.ts`.
    this.addEventListener("goto-url", (e: CustomEvent) => {
      this.router.goto(e.detail);
    });
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

import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement('main-app')
export class MainApp extends LitElement {
    static override styles = css`
        h1 {
            text-align: center;
        }
    `

    override render() {
        return html`
            <h1> The Sign Link. </h1>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'main-app': MainApp;
    }
}
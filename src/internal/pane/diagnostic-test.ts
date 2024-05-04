import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("pane-diagnostic-test")
export class PaneDiagnosticTest extends LitElement {
  protected override render() {
    return html`TODO(alizarazot): Escribir prueba diagnóstica.`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pane-diagnostic-test": PaneDiagnosticTest;
  }
}

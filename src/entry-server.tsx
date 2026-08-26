import { renderToString } from "react-dom/server";
import App from "./App";

/**
 * Entrada de renderização no servidor, usada só no build.
 *
 * `scripts/prerender.mjs` chama esta função para gerar o HTML completo da
 * página e injetá-lo em dist/index.html. Sem isso, o site entrega apenas
 * <div id="root"></div> — e rastreador que não executa JavaScript, como a
 * maioria dos agentes de IA, não encontra nem conteúdo nem dados estruturados.
 */
export function render(): string {
  return renderToString(<App />);
}

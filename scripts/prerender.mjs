/**
 * Pré-renderiza a página e injeta o HTML em dist/index.html.
 *
 * O site é uma SPA: sem este passo, o servidor entrega
 * `<div id="root"></div>` e mais nada. Rastreadores de IA — GPTBot,
 * OAI-SearchBot, PerplexityBot — em geral não executam JavaScript, então
 * encontrariam a página vazia, sem texto e sem JSON-LD.
 *
 * Roda depois dos dois builds do Vite (cliente e SSR), no fim de `npm run build`.
 */

import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paginaPath = join(root, "dist/index.html");

const { render } = await import(join(root, "dist-ssr/entry-server.js"));

const html = render();
const original = await readFile(paginaPath, "utf8");

const alvo = '<div id="root"></div>';
if (!original.includes(alvo)) {
  throw new Error(`Âncora ${alvo} não encontrada em dist/index.html`);
}

const saida = original.replace(alvo, `<div id="root">${html}</div>`);
await writeFile(paginaPath, saida, "utf8");

const texto = saida
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

console.log(`pré-renderizado: ${(html.length / 1024).toFixed(0)} kB de marcação`);
console.log(`texto legível sem JavaScript: ${texto.length} caracteres`);
console.log(`blocos JSON-LD no HTML: ${(saida.match(/application\/ld\+json/g) || []).length}`);

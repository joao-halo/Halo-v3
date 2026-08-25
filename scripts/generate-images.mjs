/**
 * Gera as imagens estáticas do site a partir dos assets de marca:
 *
 *   public/og.jpg        cartão 1200×630 para Open Graph / Twitter
 *   public/images/*.jpg  placeholders das seções e dos projetos
 *
 * Tudo é desenhado com os tokens do design system (as mesmas cores e
 * gradientes de src/styles/tokens.css) e com o anel HALO de
 * public/brand/halo-mark.svg. O texto do cartão é convertido em
 * contorno vetorial com opentype.js, para sair na tipografia da marca
 * mesmo sem as fontes instaladas no sistema.
 *
 * Uso: npm run generate:images
 */

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------------------------------------- tokens do design system */

const COLOR = {
  green: "#006D40",
  blue: "#3D7CBF",
  gold: "#D4AF37",
  greenDark: "#00331E",
  charcoal: "#2A2D2F",
  white: "#FFFFFF",
  neutral300: "#B7BBBE",
};

/** Os cinco gradientes nomeados do design system. */
const GRADIENTS = {
  brand: [
    { offset: "0%", color: COLOR.gold },
    { offset: "55%", color: COLOR.green },
    { offset: "100%", color: COLOR.blue },
  ],
  emerald: [
    { offset: "0%", color: COLOR.green },
    { offset: "100%", color: COLOR.blue },
  ],
  gold: [
    { offset: "0%", color: COLOR.gold },
    { offset: "100%", color: COLOR.green },
  ],
  sun: [
    { offset: "0%", color: COLOR.gold },
    { offset: "100%", color: COLOR.blue },
  ],
  dark: [
    { offset: "0%", color: COLOR.charcoal },
    { offset: "100%", color: COLOR.greenDark },
  ],
};

const linearGradient = (id, stops) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    ${stops.map((s) => `<stop offset="${s.offset}" stop-color="${s.color}"/>`).join("")}
  </linearGradient>`;

/* ------------------------------------------------------- anel da marca */

/** Os três arcos de public/brand/halo-mark.svg, em viewBox 100×100. */
const RING_ARCS = [
  "M17.96 31.5A37 37 0 0 1 86.86 46.77",
  "M86.86 46.77A37 37 0 0 1 40.42 85.74",
  "M40.42 85.74A37 37 0 0 1 13 50",
];

/** Anel monocromático, para marca d'água. */
function ringMono({ x, y, size, color, opacity = 1, strokeWidth = 13 }) {
  const scale = size / 100;
  return `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}">
    <path d="${RING_ARCS.join(" ")}" fill="none" stroke="${color}"
          stroke-width="${strokeWidth}" stroke-linecap="round"/>
  </g>`;
}

/** Anel com o gradiente Aurora, na ordem fixa ouro → verde → azul. */
function ringAurora({ x, y, size, opacity = 1, idPrefix = "og" }) {
  const scale = size / 100;
  return `
  <defs>
    <linearGradient id="${idPrefix}-a" gradientUnits="userSpaceOnUse" x1="17.96" y1="31.5" x2="86.86" y2="46.77">
      <stop offset="0" stop-color="${COLOR.gold}"/><stop offset="1" stop-color="${COLOR.green}"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-b" gradientUnits="userSpaceOnUse" x1="86.86" y1="46.77" x2="40.42" y2="85.74">
      <stop offset="0" stop-color="${COLOR.green}"/><stop offset="1" stop-color="${COLOR.blue}"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-c" gradientUnits="userSpaceOnUse" x1="40.42" y1="85.74" x2="13" y2="50">
      <stop offset="0" stop-color="${COLOR.blue}"/><stop offset="1" stop-color="#4F8FD0"/>
    </linearGradient>
  </defs>
  <g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"
     fill="none" stroke-width="13" stroke-linecap="round">
    <path d="${RING_ARCS[0]}" stroke="url(#${idPrefix}-a)"/>
    <path d="${RING_ARCS[1]}" stroke="url(#${idPrefix}-b)"/>
    <path d="${RING_ARCS[2]}" stroke="url(#${idPrefix}-c)"/>
  </g>`;
}

/* ------------------------------------------------- texto como contorno */

const fonts = {
  display: opentype.loadSync(join(root, "scripts/fonts/fraunces-700.woff")),
  brand: opentype.loadSync(join(root, "scripts/fonts/outfit-600.woff")),
};

/** Converte texto em `<path>`, aplicando tracking manualmente por glifo. */
function textPath(font, text, { x, y, size, fill, tracking = 0 }) {
  const letterGap = tracking * size;
  let cursor = x;
  let data = "";

  for (const char of text) {
    const glyph = font.charToGlyph(char);
    data += glyph.getPath(cursor, y, size).toPathData(2);
    cursor += (glyph.advanceWidth / font.unitsPerEm) * size + letterGap;
  }

  return { path: `<path d="${data}" fill="${fill}"/>`, width: cursor - x - letterGap };
}

/** Largura que o texto ocuparia, para centralizar ou quebrar linha. */
function measure(font, text, size, tracking = 0) {
  let width = 0;
  for (const char of text) {
    width += (font.charToGlyph(char).advanceWidth / font.unitsPerEm) * size + tracking * size;
  }
  return width - tracking * size;
}

/* -------------------------------------------------------- gravação */

async function writeJpeg(svg, outPath, { width, height, quality = 82 }) {
  const absolute = join(root, outPath);
  await mkdir(dirname(absolute), { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .jpeg({ quality, progressive: true, mozjpeg: true })
    .toFile(absolute);
  return absolute;
}

/* ----------------------------------------------- cartão Open Graph */

async function generateOg() {
  const W = 1200;
  const H = 630;

  const eyebrow = "FOTOVOLTAICO · ARMAZENAMENTO · RECARGA VE";
  const headline = ["Energia projetada", "com engenharia."];
  const place = "Belo Horizonte · Minas Gerais";

  const eyebrowText = textPath(fonts.brand, eyebrow, {
    x: 80,
    y: 232,
    size: 20,
    fill: COLOR.gold,
    tracking: 0.18,
  });

  const headlineSize = 68;
  const headlinePaths = headline
    .map(
      (line, index) =>
        textPath(fonts.display, line, {
          x: 80,
          y: 340 + index * (headlineSize * 1.15),
          size: headlineSize,
          fill: COLOR.white,
        }).path,
    )
    .join("");

  const wordmark = textPath(fonts.brand, "Halo", {
    x: 168,
    y: 118,
    size: 44,
    fill: COLOR.white,
    tracking: -0.01,
  });

  const placeText = textPath(fonts.brand, place, {
    x: 80,
    y: 552,
    size: 22,
    fill: COLOR.neutral300,
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="halo-blue" cx="0.8" cy="0.1" r="0.9">
      <stop offset="0" stop-color="${COLOR.blue}" stop-opacity="0.28"/>
      <stop offset="0.6" stop-color="${COLOR.blue}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo-gold" cx="0.08" cy="0.95" r="0.8">
      <stop offset="0" stop-color="${COLOR.gold}" stop-opacity="0.2"/>
      <stop offset="0.55" stop-color="${COLOR.gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${COLOR.charcoal}"/>
  <rect width="${W}" height="${H}" fill="url(#halo-blue)"/>
  <rect width="${W}" height="${H}" fill="url(#halo-gold)"/>

  ${ringAurora({ x: 820, y: 150, size: 340, opacity: 0.9, idPrefix: "og" })}

  ${ringMono({ x: 80, y: 62, size: 72, color: COLOR.white, opacity: 0.95 })}
  ${wordmark.path}

  <rect x="80" y="180" width="120" height="2" fill="${COLOR.white}" opacity="0.9"/>
  ${eyebrowText.path}
  ${headlinePaths}
  <rect x="80" y="500" width="64" height="1" fill="${COLOR.gold}"/>
  ${placeText.path}
</svg>`;

  await writeJpeg(svg, "public/og.jpg", { width: W, height: H, quality: 88 });
  return "public/og.jpg";
}

/* ------------------------------------------- placeholders de imagem */

/**
 * Placeholder de marca: superfície em gradiente do design system com o
 * anel HALO como marca d'água. Sem texto — o significado da imagem vive
 * no nome do arquivo e no `alt`, e a foto real entra no lugar depois.
 */
function placeholderSvg({ width, height, gradient, ringScale = 0.72 }) {
  const ringSize = Math.min(width, height) * ringScale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${linearGradient("bg", GRADIENTS[gradient])}</defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  ${ringMono({
    x: width - ringSize * 0.78,
    y: height - ringSize * 0.82,
    size: ringSize,
    color: COLOR.white,
    opacity: 0.16,
  })}
  ${ringMono({
    x: -ringSize * 0.3,
    y: -ringSize * 0.35,
    size: ringSize * 0.7,
    color: COLOR.white,
    opacity: 0.1,
  })}
</svg>`;
}

const PLACEHOLDERS = [
  // cards da seção "Halo Engenharia" — 4:3
  { file: "projeto-fotovoltaico-residencial.jpg", w: 800, h: 600, gradient: "sun" },
  { file: "projeto-fotovoltaico-comercial.jpg", w: 800, h: 600, gradient: "emerald" },
  { file: "projeto-fotovoltaico-ci.jpg", w: 800, h: 600, gradient: "gold" },
  { file: "projeto-baterias-armazenamento.jpg", w: 800, h: 600, gradient: "dark" },
  { file: "projeto-eletromobilidade-eletroposto.jpg", w: 800, h: 600, gradient: "brand" },
  { file: "projeto-operacao-manutencao.jpg", w: 800, h: 600, gradient: "emerald" },
  // imagens de seção — retrato
  { file: "fotovoltaico-instalacao-modulos.jpg", w: 900, h: 1100, gradient: "emerald" },
  { file: "armazenamento-banco-baterias-sala-tecnica.jpg", w: 900, h: 1100, gradient: "dark" },
];

/**
 * Gera um placeholder para cada imagem que AINDA NÃO EXISTE.
 *
 * Foto real colocada na pasta nunca é sobrescrita — rodar o script de novo
 * depois de trocar uma imagem é seguro. Use `--force` para regerar tudo.
 */
async function generatePlaceholders({ force = false } = {}) {
  const written = [];
  const kept = [];

  for (const item of PLACEHOLDERS) {
    const target = `public/images/${item.file}`;
    if (!force && existsSync(join(root, target))) {
      kept.push(target);
      continue;
    }
    const svg = placeholderSvg({ width: item.w, height: item.h, gradient: item.gradient });
    await writeJpeg(svg, target, { width: item.w, height: item.h });
    written.push(target);
  }

  return { written, kept };
}

/* ------------------------------------------------------------ main */

const force = process.argv.includes("--force");

const og = await generateOg();
const { written, kept } = await generatePlaceholders({ force });

await writeFile(
  join(root, "public/images/LEIA-ME.txt"),
  [
    "Algumas destas imagens são PLACEHOLDERS gerados a partir dos assets de marca;",
    "outras já são fotos reais de obra. Para trocar um placeholder por foto real,",
    "substitua o arquivo mantendo o mesmo nome e a mesma proporção (4:3 nos cards,",
    "retrato nas imagens de seção). O texto alternativo fica em src/data/content.ts.",
    "",
    "Rodar `npm run generate:images` NÃO sobrescreve foto que já existe.",
    "Para regerar todos os placeholders do zero: npm run generate:images -- --force",
    "",
    ...PLACEHOLDERS.map((item) => `${item.file} — ${item.w}×${item.h}`),
  ].join("\n"),
  "utf8",
);

console.log(`gerado: ${og}`);
for (const file of written) console.log(`gerado: ${file}`);
for (const file of kept) console.log(`preservado (já existe): ${file}`);

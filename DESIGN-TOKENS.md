# HALO — Tokens e Componentes

Relatório da extração do design system em [`HALO-Design-System/`](HALO-Design-System/)
para código. **O design system é a fonte de verdade visual do projeto** — onde a
especificação do site divergir de paleta, tipografia, raios ou estilo de componente,
o design system vence.

Materializado em:

| Arquivo | Papel |
|---|---|
| [`src/styles/tokens.css`](src/styles/tokens.css) | Única fonte de verdade dos valores brutos (CSS custom properties) |
| [`tailwind.config.ts`](tailwind.config.ts) | `theme.extend` apontando para as variáveis — nenhum hex solto |
| [`src/styles/fonts.css`](src/styles/fonts.css) | Carregamento de Fraunces + Outfit (Google Fonts) |
| [`src/styles/index.css`](src/styles/index.css) | Folha raiz: importa fontes e tokens, camada base e o CSS do slider |
| [`public/brand/`](public/brand/) | Assets de logo otimizados |
| [`src/components/ui/`](src/components/ui/) | Componentes replicados do design system |

---

## 1. Inventário da pasta de design

A pasta real chama-se **`HALO-Design-System/`** (não `design-system/`). Não há
`.dc.html`, `_ds_manifest.json`, imagens raster, ícones nem arquivos de fonte —
o sistema é documentação em Markdown + tokens + um SVG + uma página de demonstração.

| Arquivo | O que define |
|---|---|
| `README.md` | Princípio condutor, proporção de uso das cores (60/30/7/3), as 5 "regras de ouro", mapa da pasta |
| `01-fundamentos/cores.md` | 3 cores de marca, 4 escalas de 10 tons, 5 gradientes nomeados, 12 papéis semânticos, tabela de contraste WCAG |
| `01-fundamentos/tipografia.md` | Famílias (Fraunces/Outfit), URL do Google Fonts, escala de 9 níveis, 5 pesos, entrelinhas, trackings, padrão "Overline + Título" |
| `01-fundamentos/espacamento-e-layout.md` | Escala de 8px (10 degraus), grade de 12 col/gutter 24/container 1200, 6 raios, 4 sombras, 5 princípios de layout |
| `01-fundamentos/logotipo-e-marca.md` | Anatomia do símbolo, regras do wordmark, 4 versões, área de proteção (x/2), tamanho mínimo (24px/10mm), 5 usos proibidos, tom de voz |
| `02-componentes/botoes.md` | 6 variantes, 3 tamanhos (altura/padding/fonte), 4 estados, CSS de referência |
| `02-componentes/cards-e-blocos.md` | Card, estatística, card de equipe, feature com ícone, bloco escuro, linha de processo — com anatomia e CSS |
| `02-componentes/padroes-de-slide.md` | 9 layouts de slide 16:9, margem de segurança 64px, checklist de consistência |
| `03-tokens/tokens.css` | **Fonte de verdade dos valores brutos** — 100+ custom properties |
| `03-tokens/tokens.json` | Os mesmos tokens no formato W3C Design Tokens (sem os tokens de layout/transição) |
| `assets/halo-logo.svg` | Símbolo: anel aberto r=37 em viewBox 100×100, stroke 13 arredondado, 3 arcos com gradiente ouro→verde→azul, abertura à esquerda |
| `showcase.html` | Implementação de referência — **única fonte para valores que a documentação não fixa**: hero, alturas de chip, tamanhos de h3/h4, avatar, seta do processo, quebra em 780px |

**Lido visualmente:** não há PNG/JPG na pasta. O único recurso gráfico é o
`halo-logo.svg`, cuja geometria foi lida no código e reproduzida arco a arco.

---

## 2. Tokens extraídos

Notação de origem: nome do arquivo · `[showcase]` = medido em `showcase.html`
porque a documentação é silente · `[derivado]` = extensão coerente criada aqui.

### 2.1 Cores — escalas

Todas as escalas vêm idênticas de `cores.md` §2 / `tokens.css` / `tokens.json`.
Em `src/styles/tokens.css` cada tom existe em duas formas: canais RGB
(`--green-500-ch: 0 109 64`) e cor resolvida (`--green-500`). Os canais são uma
**extensão técnica** `[derivado]` que preserva os modificadores de opacidade do
Tailwind (`bg-primary/60`) sem introduzir nenhum valor novo.

| Escala | 50 | 100 | 200 | 300 | 400 | **500** | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| Verde Esmeralda | `#E9F5EF` | `#C8E6D6` | `#92CDAC` | `#34B277` | `#08995A` | **`#006D40`** | `#005C36` | `#00472A` | `#00331E` | `#002415` |
| Azul Médio | `#ECF3FA` | `#CFE0F1` | `#A4C4E4` | `#79A8D6` | `#5E92CC` | **`#3D7CBF`** | `#33669D` | `#29507C` | `#1F3B5B` | `#15273B` |
| Amarelo Ouro | `#FBF6E7` | `#F5E9BE` | `#EBD485` | `#E1BF4D` | `#D9B23E` | **`#D4AF37`** | `#B0902C` | `#8A7122` | `#635119` | `#3D3210` |

Neutros (grafite) — `0 #FFFFFF` · `50 #F6F7F7` · `100 #ECEDEE` · `200 #D7D9DB` ·
`300 #B7BBBE` · `400 #8E9396` · `500 #6B7073` · `600 #4E5255` · `700 #3A3E40` ·
**`800 #2A2D2F`** (charcoal do template) · `900 #1B1D1E` · `950 #0F1011`.

### 2.2 Cores — papéis semânticos

| Token | Valor | Tailwind | Origem |
|---|---|---|---|
| `--color-primary` | verde 500 `#006D40` | `primary` | `cores.md` §4 |
| `--color-primary-hover` | verde 600 `#005C36` | `primary-hover` | `tokens.css` |
| `--color-primary-soft` | verde 50 `#E9F5EF` | `primary-soft` | `tokens.css` |
| `--color-secondary` | azul 500 `#3D7CBF` | `secondary` | `cores.md` §4 |
| `--color-secondary-hover` | azul 600 `#33669D` | `secondary-hover` | `tokens.css` |
| `--color-secondary-soft` | azul 50 `#ECF3FA` | `secondary-soft` | `tokens.css` |
| `--color-accent` | ouro 500 `#D4AF37` | `accent` | `cores.md` §4 |
| `--color-accent-hover` | ouro 600 `#B0902C` | `accent-hover` | `tokens.css` |
| `--color-accent-soft` | ouro 50 `#FBF6E7` | `accent-soft` | `tokens.css` |
| `--color-text` | neutro 900 `#1B1D1E` | `ink` | `cores.md` §4 |
| `--color-text-muted` | neutro 500 `#6B7073` | `ink-muted` | `cores.md` §4 |
| `--color-text-inverse` | `#FFFFFF` | `ink-inverse` | `tokens.css` |
| `--color-text-on-accent` | neutro 900 | `ink-on-accent` | `cores.md` §5 `[derivado]` — nomeia a regra "texto sobre ouro é escuro" |
| `--color-bg` | `#FFFFFF` | `canvas` | `tokens.css` |
| `--color-bg-subtle` | neutro 50 `#F6F7F7` | `canvas-subtle` | `tokens.css` |
| `--color-surface` | `#FFFFFF` | `surface` | `tokens.css` |
| `--color-surface-dark` | neutro 800 `#2A2D2F` | `surface-dark` | `cores.md` §4 |
| `--color-border` | neutro 200 `#D7D9DB` | `line` | `tokens.css` |
| `--color-border-strong` | neutro 300 `#B7BBBE` | `line-strong` | `tokens.css` |
| `--color-success` / soft | `#1F9159` / `#E7F4EC` | `success` / `success-soft` | `tokens.css` |
| `--color-info` / soft | azul 500 / azul 50 | `info` / `info-soft` | `tokens.css` |
| `--color-warning` / soft | ouro 500 / ouro 50 | `warning` / `warning-soft` | `tokens.css` |
| `--color-danger` / soft | `#C8372D` / `#FBEAE8` | `danger` / `danger-soft` | `tokens.css` |

### 2.3 Gradientes — `cores.md` §3 / `tokens.css` §4

| Token | Valor | Uso |
|---|---|---|
| `--gradient-brand` | `linear-gradient(135deg,#D4AF37 0%,#006D40 55%,#3D7CBF 100%)` | Aurora — logo, capas |
| `--gradient-emerald` | `linear-gradient(135deg,#006D40 0%,#3D7CBF 100%)` | Botão principal / CTA |
| `--gradient-gold` | `linear-gradient(135deg,#D4AF37 0%,#006D40 100%)` | Destaques premium |
| `--gradient-sun` | `linear-gradient(135deg,#D4AF37 0%,#3D7CBF 100%)` | Cabeçalhos, banners |
| `--gradient-dark` | `linear-gradient(135deg,#2A2D2F 0%,#00331E 100%)` | Seções escuras |

A ordem ouro→verde→azul é **fixa** (`logotipo-e-marca.md` §5). Gradiente só em
superfície grande, nunca em texto pequeno (`README.md`, regra 5).

### 2.4 Contraste — `cores.md` §5 (restrições que o site deve respeitar)

| Combinação | Contraste | Regra |
|---|---|---|
| Neutro 900 sobre branco | 16.1:1 | AAA — texto padrão |
| Branco sobre verde 500 | 5.9:1 | AA em qualquer tamanho |
| Branco sobre azul 500 | 4.0:1 | **só a partir de 18px** |
| Branco sobre ouro 500 | 1.9:1 | **proibido** |
| Neutro 900 sobre ouro 500 | 8.3:1 | AAA — é assim que se usa ouro |

### 2.5 Tipografia

Famílias — `tipografia.md` §1 / `tokens.css` §5. **Ambas do Google Fonts**; não há
arquivo de fonte na pasta de design, portanto `public/fonts/` não foi criado.

| Token | Valor | Uso |
|---|---|---|
| `--font-display` | `"Fraunces", Georgia, "Times New Roman", serif` | H1–H4, números-herói |
| `--font-body` | `"Outfit", "Segoe UI", system-ui, sans-serif` | Parágrafos, UI |
| `--font-brand` | igual a `--font-body` | Wordmark "Halo", overlines, botões |

Fraunces é variável com eixo óptico `opsz 9..144` → `font-optical-sizing: auto`
aplicado em `base.css` e no componente `Heading`.

| Nível | Token | Tamanho | Peso | Entrelinha | Tracking | Fonte | Origem |
|---|---|---|---|---|---|---|---|
| Display | `--text-4xl` | 56px | 700 | 1.15 | −0.02em | Fraunces | `tipografia.md` §2 |
| H1 | `--text-3xl` | 40px | 700 | 1.15 | −0.015em | Fraunces | §2 + `[showcase]` tracking |
| H2 | `--text-2xl` | 32px | 600 | 1.15 | −0.015em | Fraunces | §2 + `[showcase]` |
| H3 | `--text-xl` | 24px | 600 | 1.3 | −0.015em | Fraunces | §2 + `[showcase]` |
| Body L | `--text-lg` | 18px | 400 | 1.6 | 0 | Outfit | §2 |
| Body | `--text-base` | 16px | 400 | 1.6 | 0 | Outfit | §2 |
| Small | `--text-sm` | 14px | 400 | 1.6 | 0 | Outfit | §2 |
| Caption | `--text-caption` | 12px | 400 | 1.6 | 0 | Outfit | §2 |
| Overline | `--text-overline` | 12px | 600 | 1.6 | 0.18em, uppercase | Outfit | §2/§3 |

Pesos: 300 light · 400 regular · 500 medium · 600 semibold · 700 bold (§4).
Entrelinhas: `tight 1.15` · `snug 1.3` · `normal 1.6` (§5).
Trackings adicionais `[showcase]`: `--tracking-hero-sub 0.06em` (subtítulo da capa),
`--tracking-topbar 0.14em` (barra superior), `--tracking-brand −0.01em` (wordmark, §5).

### 2.6 Espaçamento — `espacamento-e-layout.md` §1

Grade de 8px; 4px só para ajuste fino.

| Token | px | Uso documentado |
|---|---|---|
| `--space-1` | 4 | ícone ↔ texto |
| `--space-2` | 8 | elementos próximos |
| `--space-3` | 12 | padding interno pequeno |
| `--space-4` | 16 | padding padrão |
| `--space-5` | 24 | gutter da grade, entre cards |
| `--space-6` | 32 | padding de card, entre blocos |
| `--space-7` | 48 | entre seções |
| `--space-8` | 64 | margem de slide / segurança |
| `--space-9` | 96 | respiro de capa |
| `--space-10` | 128 | grandes vazios editoriais |

Padding vertical de seção: **80px** `[showcase]` (`--section-py`) — a documentação
não fixa esse valor.

### 2.7 Grade, container e quebras

| Token | Valor | Origem |
|---|---|---|
| `--container-max` | 1200px | `espacamento-e-layout.md` §2 |
| `--container-wrap` | 1120px | `[showcase]` — largura real do `.wrap` |
| `--container-pad` | 32px | `[showcase]` |
| `--grid-columns` | 12 | §2 |
| `--grid-gutter` | 24px | §2 |
| `--slide-ratio` / `--slide-safe` | 16/9 · 64px | §2, `padroes-de-slide.md` |
| `--measure` / `--measure-narrow` | 62ch · 54ch | `[showcase]` (`.sec-desc`, `.block--dark p`) |
| `--bp-md` | **780px** | `[showcase]` — **única quebra do sistema** |
| `--bp-sm` / `--bp-lg` / `--bp-xl` | 640 / 1024 / 1280 | `[derivado]` |

Layouts recorrentes (§2): meio a meio (6+6), terços (3×4 col), quartos (4×3 col),
imagem dominante (7–8 col + caixa sobreposta) → componente `Grid`.

### 2.8 Formas e profundidade — `espacamento-e-layout.md` §3–4

| Token | Valor | Uso |
|---|---|---|
| `--radius-none` | 0 | **imagens e caixas corporativas** |
| `--radius-sm` | 4px | inputs, tags |
| `--radius-md` | 8px | cards |
| `--radius-lg` | 16px | cards de destaque, painéis |
| `--radius-xl` | 24px | containers grandes |
| `--radius-full` | 999px | **botões pílula** |
| `--shadow-sm` | `0 1px 2px rgba(15,16,17,.06)` | bordas sutis |
| `--shadow-md` | `0 4px 12px rgba(15,16,17,.08)` | cards padrão |
| `--shadow-lg` | `0 12px 28px rgba(15,16,17,.12)` | hover / destaque |
| `--shadow-xl` | `0 24px 48px rgba(15,16,17,.16)` | modais, caixas sobre imagem |

Bordas: 1px `--color-border` (neutro 200); fio-régua de marca 1px × 64px em neutro
300 ou ouro. Botões usam borda de **2px** (transparente nas variantes sólidas) para
que o contorno não desloque o layout. Transição: `200ms cubic-bezier(.4,0,.2,1)`.

### 2.9 Logo — `logotipo-e-marca.md`

| Item | Valor |
|---|---|
| Símbolo | Anel aberto, r=37 em viewBox 100×100, `stroke-width` 13, `stroke-linecap: round`, 3 arcos, abertura à esquerda |
| Gradiente | Aurora, ordem **fixa** ouro → verde → azul (o 3º arco fecha em `#4F8FD0`) |
| Wordmark | "Halo" — só o **H** maiúsculo, Outfit 600, tracking −0.01em |
| Cor do wordmark | verde 700 `#00472A` em fundo claro · branco em fundo escuro |
| Versões | principal · invertida · monocromática · apenas símbolo |
| Área de proteção | altura do anel ÷ 2 |
| Tamanho mínimo | 24px (digital) / 10mm (impresso) |
| Proibido | distorcer, rotacionar, trocar/inverter cores do gradiente, "HALO" ou "halo", outra fonte no wordmark |

Assets em `public/brand/`: `halo-mark.svg` (Aurora), `halo-mark-mono.svg`
(`currentColor`, arcos unidos em um único path), `halo-lockup.svg` e
`halo-lockup-inverse.svg` (anel + wordmark), `favicon.svg` (stroke engrossado
para 15 — legibilidade em 16–32px). Todos minificados; o original de 1.186 B virou
961 B. Não há PNG/JPG na pasta de design, portanto não houve conversão para WebP.

---

## 3. Componentes replicados

Em `src/components/ui/`, cada arquivo cita a seção de origem no cabeçalho.

| Componente | Variantes / tamanhos / estados | Origem |
|---|---|---|
| `Button`, `ButtonLink` | 6 variantes (`primary` gradiente · `solid` · `secondary` · `accent` · `outline` · `ghost`) × 3 tamanhos (sm 32px/8×16/14px · md 44px/12×24/16px · lg 56px/16×32/18px) × 5 estados (default, hover, active −1px, focus-visible, disabled 45%) | `botoes.md` §1–4 |
| `Card` | 3 elevações, 4 paddings, hover `sm→lg`, raio md | `cards-e-blocos.md` §1 |
| `Stat` | 3 tons (verde/azul/ouro), rótulo sempre em ouro, valor em Fraunces 700 40px | §2 |
| `TeamCard` | com foto (raio md) ou avatar de gradiente 56px em 4 variações | §3 + `[showcase]` |
| `FeatureCard` / `FeatureIcon` | círculo 64px, tons `soft` (verde 50) e `gradient` (esmeralda + ícone branco) | §4 |
| `DarkBlock` | `solid` (neutro 800) e `gradient` (grafite→verde), overline sempre ouro, padding 48px, raio lg | §5 |
| `ProcessSteps` | numeração automática `01…`, seta em ouro entre etapas, 3–5 passos | §6 |
| `Hero` | capa grafite com halos radiais azul/ouro, barra superior, dois fios de 2px, título `clamp(44px,7vw,72px)`, imagem opcional sob overlay 70% | `padroes-de-slide.md` §1 + `[showcase]` |
| `Heading`, `Text`, `Overline`, `Rule` | 4 níveis de título, 4 tamanhos de texto, overline em 3 tons, fio curto/largo | `tipografia.md` §2–3, layout §5.3 |
| `Container`, `Section`, `Grid`, `SectionHeader` | 2 larguras, 3 tons de faixa, grades meio a meio/terços/quartos, cabeçalho "overline + título + descrição" | `espacamento-e-layout.md` §2 |
| `HaloLogo`, `HaloMark`, `HaloWordmark` | horizontal/vertical, claro/escuro, mono, só símbolo, área de proteção aplicada | `logotipo-e-marca.md` |

---

## 4. Divergências resolvidas

Precedência aplicada: **documentação normativa (`.md`) > `tokens.css`/`tokens.json`
> `showcase.html`**. O showcase só governa onde a documentação é silente.

| Ponto | Documentação | Showcase | Adotado |
|---|---|---|---|
| Padding do botão md | 12×24px | 12×26px | **12×24px** (doc) |
| Valor da estatística | `--text-3xl` (40px) | 42px | **40px** (doc) |
| Tracking do rótulo da estatística | `--tracking-overline` 0.18em | 0.16em | **0.18em** (doc) |
| Tracking dos títulos | só `--tracking-tight` −0.02em (display) | −0.015em em h1–h4 | −0.02em no display, **−0.015em** nos demais (doc silente) |
| Margem sob o cabeçalho de seção | escala de 8px | 40px (fora da escala) | **48px** (`--space-7`) — a regra da grade prevalece |
| Container | 1200px | 1120px | ambos disponíveis; `Container` usa 1120 por padrão |
| Margem sob o ícone de feature | silente | 18px | **18px** (showcase governa) |

### Divergências com o padrão Tailwind — leia antes de escrever classes

`tailwind.config.ts` **sobrescreve** a escala numérica padrão para impor a grade
de 8px do HALO. Consequências práticas:

| Classe | Tailwind padrão | **Neste projeto** |
|---|---|---|
| `p-5` / `gap-5` | 20px | **24px** (gutter) |
| `p-6` | 24px | **32px** (padding de card) |
| `p-7` | 28px | **48px** |
| `p-8` | 32px | **64px** |
| `p-9` / `p-10` | 36 / 40px | **96 / 128px** |
| `rounded` | 4px | **8px** |
| `rounded-lg` | 8px | **16px** |
| `md:` | 768px | **780px** |

Snippets copiados de fora do projeto precisam ser reconvertidos.

**Única exceção à regra "nenhum valor bruto no config":** `@media` não resolve CSS
custom properties — `@media (min-width: var(--bp-md))` é ignorado pelo navegador.
Por isso `screens` usa px literais e fica **fora de `extend`**, substituindo o
conjunto padrão do Tailwind (que traria um `2xl: 1536px` alheio ao sistema).
Os valores espelham `--bp-*` de `tokens.css`; mantenha os dois em sincronia.

### Verificação executada

O `tailwind.config.ts` foi compilado contra os componentes e uma página de prova.
Valores computados no navegador, todos batendo com o design system: corpo em Outfit
e títulos em Fraunces (ambas carregadas), capa `rgb(42,45,47)`, CTA
`linear-gradient(135deg,#006D40,#3D7CBF)`, botão 44px com raio 999px, card com
padding 32px / raio 8px / `0 4px 12px rgba(15,16,17,.08)`, overline verde com
tracking 2.16px (= 0.18em × 12px), ouro `#D4AF37` com texto `#1B1D1E`,
estatística 40px, gutter 24px, seção 80px, quebra em 780px, desabilitado a 45%.

---

## 5. Fontes

`src/styles/fonts.css` usa o `@import` do Google Fonts exatamente com a URL de
`tipografia.md` §1 (`display=swap` incluso). Em Next.js, a alternativa preferível é
`next/font/google` — auto-hospeda os arquivos, elimina o round-trip ao
`fonts.googleapis.com` e evita CLS:

```ts
import { Fraunces, Outfit } from "next/font/google";
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400","600","700"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-outfit", display: "swap" });
```

Nesse caso, redefina `--font-display`/`--font-body`/`--font-brand` para
`var(--font-fraunces)` / `var(--font-outfit)` e remova o `@import`.

---

## 6. Contraste — pares reprovados e correção aplicada

Medições em WCAG 2.1 (razão de contraste sobre o fundo indicado). Três pares
reprovaram durante a construção do site. Em nenhum caso foi criada cor nova: a
correção usa outro degrau da **mesma escala da marca**, e o token original
permanece intacto para uso como fundo, fio ou superfície.

| Par | Onde aparecia | Medido | Exige | Correção mínima aplicada |
|---|---|---|---|---|
| Ouro 500 `#D4AF37` como **texto** sobre branco | rótulo da estatística (`cards-e-blocos.md` §2 e `showcase.html`), rótulos e número-herói dos simuladores | **2,06:1** | 4,5:1 (12px) | Ouro **700** `#8A7122` → **4,68:1** ✅ |
| Ouro 500 como **número grande** sobre card branco | valor de 25 anos no simulador de economia (40px, bold) | **2,06:1** | 3:1 (texto grande) | mesmo ouro 700 → **4,68:1** ✅ |
| Neutro 400 `#8E9396` sobre grafite `#2A2D2F` | barra legal do rodapé (12px) | **4,41:1** | 4,5:1 | Neutro **300** `#B7BBBE` → **7,08:1** ✅ |

Materialização: novo papel `--color-accent-on-light: var(--gold-700)` em
`tokens.css`, exposto no Tailwind como `text-accent-on-light`. **Só para texto** —
`bg-accent`, fios e superfícies continuam no ouro 500, onde a razão não se aplica.

**Reversível:** para voltar exatamente ao que o showcase renderiza, aponte
`--color-accent-on-light` para `var(--gold-500)`. Isso reintroduz a reprovação.

### Pares verificados e aprovados

| Par | Medido | Situação |
|---|---|---|
| Neutro 900 sobre branco | 16,1:1 | ✅ AAA |
| Verde 500 sobre branco (overline, links) | 6,44:1 | ✅ AA |
| Neutro 500 sobre neutro 50 (texto auxiliar em seção `subtle`) | 4,66:1 | ✅ AA |
| Ouro 500 sobre grafite (overline em seção invertida) | 6,60:1 | ✅ AA |
| Neutro 300 sobre grafite (links do rodapé) | 7,08:1 | ✅ AA |
| Danger `#C8372D` sobre branco (erro de formulário) | 5,20:1 | ✅ AA |
| **Azul 500 sobre branco** | **4,35:1** | ⚠️ só texto grande — o próprio design system já restringe o azul a ≥18px (`cores.md` §5). Usado apenas em 40px bold e 24px semibold |

### Não-texto, mantido como está

A seta `→` da linha de processo é ouro 500 sobre branco (2,06:1). É decorativa,
tem `aria-hidden`, e a sequência já é comunicada pela numeração `01 → 02 → 03`.
Não se aplica o critério 1.4.11.

---

## 7. Defeito corrigido no design system

**Botão `outline` sem borda visível.** A classe base do componente trazia
`border-transparent` e a variante `outline` trazia `border-green-500`. Ambas são
utilitárias de `border-color`: quem vence é a que aparece por último na folha
gerada pelo Tailwind, não a que aparece por último na string de classes. Na prática
`border-transparent` ganhava e o contorno ficava invisível — o botão "Contorno"
lia-se como texto solto desde a tarefa 1.

Correção: a base declara só `border-btn` (a espessura de 2px), e **cada variante
declara a própria cor de borda**, inclusive `border-transparent` nas sólidas. A
espessura continua em todas as variantes, para que trocar de variante não desloque
o layout. Verificado no navegador: `border-color: rgb(0, 109, 64)`.

---

## 8. Componentes de interface

### Replicados do design system (tarefa 1)

`Button` · `ButtonLink` · `Card` · `Stat` · `TeamCard` · `FeatureCard` ·
`FeatureIcon` · `DarkBlock` · `ProcessSteps` · `Hero` · `Heading` · `Text` ·
`Overline` · `Rule` · `Container` · `Section` · `Grid` · `SectionHeader` ·
`HaloLogo` · `HaloMark` · `HaloWordmark`.

Dois ajustes de responsividade, em pontos que o design system não especifica
(ele descreve slides 16:9, não telas estreitas):

- `ProcessSteps` empilha em coluna abaixo de 780px, e a seta em ouro — que só faz
  sentido na horizontal — some no empilhamento.
- `Section` passou a usar `--section-py-mobile` / `--section-py-desktop` e deixou
  de trazer fio inferior por padrão: a cadência agora vem da alternância de fundo.

### Criados por extensão (tarefa 2)

Cada um materializa uma lacuna já prevista na tarefa 1:

| Componente | Lacuna que resolve |
|---|---|
| `Input` · `Textarea` · `Select` | Campos de formulário |
| `Field` | Rótulo, dica e mensagem de erro |
| `Slider` | Controle dos simuladores |
| `Tabs` · `TabPanel` | Abas dos simuladores |
| `Accordion` | Dúvidas frequentes |
| `Badge` | Tags de aplicação |
| `MediaCard` | Card de imagem com caixa sobreposta |
| `Reveal` | Revelação no scroll |
| `SkipLink` | Pular para o conteúdo |

---

## 9. Lacunas

O que o design system não cobria e precisou ser estendido. Todas as extensões
usam a mesma escala, a mesma família tipográfica e a mesma lógica de cor do
sistema, e estão em `src/styles/tokens.css` nas seções 12 e 13, marcadas `[EXT]`.

### Resolvidas durante a construção

| Lacuna | O que foi criado | Justificativa |
|---|---|---|
| **Ritmo vertical responsivo** | `--section-py-mobile` 48px · `--section-py-desktop` 80px | O showcase só fixa 80px (desktop). 48px é `--space-7`, o degrau imediatamente abaixo na escala de 8px |
| **Aliases de composição** | `--color-surface-alt` → neutro 50 · `--color-inverted` → neutro 800 · `--color-focus` → azul 400 | Nomes pedidos pela arquitetura do site, apontando para tokens que já existiam. Zero valor novo |
| **Motion de revelação** | `--ease-out` `cubic-bezier(0,0,.2,1)` · `--motion-reveal-duration` 600ms · `--motion-reveal-distance` 16px · `--motion-stagger` 80ms | O design system só define micro-interação (200ms, curva padrão). Entrada no scroll pede curva de saída e distância própria. Espelhados em `src/lib/motion.ts` porque Framer Motion precisa de números, não de CSS vars |
| **Input / textarea / select** | altura 44px (= botão md), raio `sm`, borda neutro 300, foco verde 500, desabilitado neutro 100 | `espacamento-e-layout.md` §3 já destina o raio `sm` a "inputs, tags". A altura casa com o botão md para alinhar formulário e CTA |
| **Erro de formulário** | borda e mensagem em `--color-danger`, fundo do campo em `--color-danger-soft`, mensagem 14px com `role="alert"` | `#C8372D` já era o token `danger`; a mensagem usa o nível "Small" existente |
| **Rótulo de campo** | Outfit 500, 14px, neutro 700 | 500 é o peso de "rótulos de UI" da `tipografia.md` §4 |
| **Slider** | trilha 4px neutro 200, preenchimento em `--gradient-emerald`, polegar 24px branco com borda 2px verde 500 e `shadow-md` | O gradiente esmeralda já é o token de ação principal; o polegar repete a borda de 2px do botão |
| **Abas** | rótulos em overline, indicador de 2px verde 500, inativo neutro 500 | O indicador ecoa o fio de 2px da capa |
| **Accordion** | cabeçalho 18px Outfit 500, divisória 1px neutro 200, ícone `+`/`−` verde 500, altura animada em `grid-template-rows` na duração/curva do sistema | Usa o fio-régua como divisória e a transição única do sistema |
| **Badge** | 24px, raio `full`, 12px Outfit 600, tracking `wide`, pares soft/forte da paleta | Pílula é a forma de marca; fundos nos tons 50 preservam a proporção "ouro é tempero" |
| **Header / navegação** | 80px, fundo branco a 92% após 40px de rolagem, fio inferior neutro 200, link neutro 700 → verde 500 no ativo | 80px é o mesmo respiro vertical de seção do showcase |
| **Header sobre a capa** | no topo o cabeçalho inverte para texto claro | Sobre a capa grafite, o wordmark em verde 700 e os links em neutro 700 eram ilegíveis. Inverter usa a versão do logo que o design system já prevê para fundo escuro |
| **Menu mobile** | painel cheio em neutro 800, links 24px brancos, CTA em ouro | Reusa o bloco escuro, padrão do sistema para superfície invertida |
| **Card de imagem** | imagem reta, scrim vertical 15%→85% de grafite, overline em ouro sobre título branco | Combina "imagem dominante com caixa sobreposta" (§2 do layout) com a capa de `padroes-de-slide.md` §1 |
| **Overlay de imagem** | `rgb(42 45 47 / .7)` e `--overlay-scrim` | Valor literal de `padroes-de-slide.md` §1 ("overlay grafite a ~70%") |
| **Iconografia** | **lucide-react**, outline, traço 2px, 20px padrão (16 e 24 auxiliares) | O design system não indica biblioteca e o showcase usa glifos soltos (`◆ ✦ ●`, seta `→`). Outline de traço uniforme é a única leitura coerente com o anel do logo, que é um traço aberto de espessura constante |
| **Foco em superfície escura** | `--color-focus-inverted` → ouro 300, via classe `.on-inverted` | Ganho de legibilidade, **não** correção de WCAG: a auditoria mediu o azul 400 sobre grafite em **4,26:1**, acima do mínimo de 3:1. O ouro 300 leva a 7,76:1 e destaca melhor sobre a superfície invertida. Mantém 2px + offset 2px |
| **Rodapé** | bloco neutro 800, logo invertido, overlines em ouro, links neutro 300 | É o "Encerramento / Contato" de `padroes-de-slide.md` §9 traduzido para web |
| **Botão flutuante** | `--fab-offset` 24px, aparece após `--fab-reveal-scroll` 600px | Usa o botão sólido do sistema; nada de forma nova |
| **Métricas de componente** | `--btn-height-*`, `--icon-circle-size`, `--avatar-size`, `--text-card-title`, `--text-step-number`, `--hero-title-size`… | Valores que o showcase define e que estavam soltos no código como literais. Nomeá-los cumpre a regra "nenhum valor visual literal em componente" sem mudar um único número |
| **Trilha de temperatura do slider** | `--slider-heat`: `linear-gradient(90deg, var(--blue-500), var(--gold-500))` | O simulador de economia pede uma trilha que esquenta conforme a conta cresce. **A paleta da marca não tem laranja**, e trazer um seria estilo estranho ao sistema. O ouro é a ponta quente do HALO, e o design system já emparelha exatamente azul e ouro em `--gradient-sun` — aqui na ordem inversa. A trilha é contexto: quem identifica o valor é o polegar, a 6,44:1 contra o card |
| **Canais RGB** | `--<cor>-ch: R G B` ao lado de cada hex | Necessário para `bg-primary/60` no Tailwind. Reexpressa valores existentes, não cria nenhum |

### Fechadas na auditoria (tarefa 3)

Ver [`AUDITORIA-DESIGN.md`](AUDITORIA-DESIGN.md) para o achado, a medição e a
correção de cada item.

| Lacuna | O que foi criado | Justificativa |
|---|---|---|
| **Cor do anel sem token** | `--halo-ring-tip` `#4F8FD0` | Está em `assets/halo-logo.svg` como ponta do terceiro arco, mas **não pertence a nenhuma escala** do design system — é a única cor da marca sem token. Registrada como está, sem tentar aproximá-la de um degrau da escala azul, porque alterá-la mudaria o logotipo |
| **Texto auxiliar sobre superfície invertida** | `--color-text-inverse-muted` = branco a 78% | O `rgba(255,255,255,.78)` do showcase estava repetido em oito lugares como valor literal |
| **CTA com contraste AA** | `--gradient-emerald-cta`, terminando no azul 600 | Branco sobre o azul 500 do extremo do gradiente mede 4,34:1 e reprova. O azul 600 leva a 5,95:1 sem sair da escala. `--gradient-emerald` continua intacto para superfície sem texto |
| **Numeração legível** | `--color-step-number` = verde 400 | O verde 200 do showcase mede 1,82:1 sobre branco, contra os 3:1 exigidos para texto grande. O verde 400 é o primeiro degrau da mesma escala que passa (3,67:1) |
| **Halos radiais da capa** | `--hero-halos` | A geometria e as opacidades dos dois gradientes radiais viviam em um `style` inline do componente |
| **Ícone de 28px** | `--icon-size-xl` | O ícone dentro do círculo de 64px pedia um degrau acima de 24px. Mantém o passo de 4px da escala |
| **Dimensões do logotipo na navegação** | `--logo-mark-*` · `--logo-word-*` | Cabeçalho, menu e rodapé usam o símbolo e o wordmark em tamanhos diferentes, antes soltos no JSX. Todos acima do mínimo de 24px do símbolo (§4) |
| **Micro-interação** | `--hover-dim` 0,96 · `--hover-zoom` 1,02 | O brilho vem do CSS de `botoes.md` §4; o zoom do card de imagem era invenção da construção. Agora ambos nomeados |
| **Espelhos em JavaScript** | `src/lib/icons.ts` (junto de `src/lib/motion.ts`) | lucide-react e Framer Motion recebem número e não leem custom property. Cada constante cita o token correspondente; alterar um exige alterar o outro |
| **Pilar numerado** | componente `NumberedItem` | O mesmo bloco estava duplicado entre Engenharia e Eletromobilidade |

Correções de contraste em tokens que já existiam — `--input-border` (neutro 300 →
400), `--slider-track-bg` (neutro 200 → 300) e `--overlay-scrim` (0,85 → 0,92) —
estão detalhadas na seção **Contraste** de `AUDITORIA-DESIGN.md`.

### Ainda em aberto

| Lacuna | Proposta | Situação |
|---|---|---|
| **Modo escuro** | Fundo neutro 950, superfície neutro 900, borda neutro 700, texto neutro 50, auxiliar neutro 400, primária **verde 300** `#34B277`, secundária **azul 300** `#79A8D6`, ouro 500 mantido | **Não implementado** — o site não pede tema escuro. O design system só prevê *blocos* escuros pontuais; um tema completo exige subir na escala, porque os tons 500 não sustentam contraste sobre fundo escuro |
| **Tabela** | Cabeçalho neutro 50 com rótulo em overline, células 12×16px, divisória 1px neutro 200, hover verde 50, cantos retos | **Não implementado** — nenhuma seção do site usa tabela. Tokens já em `tokens.css` §11 |
| **Toast / notificação** | Card raio `md`, `shadow-lg`, faixa de 4px à esquerda no token de estado | **Não implementado** — o formulário resolve o retorno com bloco inline, que é suficiente para uma página só |
| **Skeleton** | Neutro 100 com pulso de 1,5s | **Não implementado** — o site é estático, nada carrega de forma assíncrona |
| **Lockup em SVG** | `public/brand/halo-lockup.svg` traz o wordmark como `<text>` em Outfit | **Limitação conhecida** — usado como `<img>`, o SVG não acessa as fontes da página e o wordmark cai na sans do sistema. Por isso o site monta o lockup com `halo-mark.svg` + o componente `HaloWordmark`, que renderiza na Outfit de verdade. O arquivo `.svg` continua servindo para uso externo (e-mail, assinatura, impressão) onde a Outfit esteja instalada |

---

*Extraído de HALO Design System v1.0 · Fraunces + Outfit · `#006D40` `#3D7CBF` `#D4AF37`*

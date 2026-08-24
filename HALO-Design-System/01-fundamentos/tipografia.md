# Tipografia — HALO Design System

A tipografia mistura **serifa editorial nos títulos** (inspiração na linguagem da Anthropic)
com uma **sans geométrica e limpa no corpo e na marca** (inspiração em Gemini, Claude e Apple).
É o contraste serif/sans que dá o ar **premium e contemporâneo**.

---

## 1. Famílias

| Função | Fonte | Tipo | Alternativa | Onde usar |
|--------|-------|------|-------------|-----------|
| **Display / Títulos** | `Fraunces` | Serifada | Georgia, serif | H1–H4, capas, números grandes |
| **Corpo / Texto** | `Outfit` | Sans | Segoe UI, system-ui | Parágrafos, listas, legendas, UI |
| **Marca / Rótulos** | `Outfit` | Sans | Segoe UI, system-ui | Wordmark **Halo**, overlines, rótulos em caixa alta, botões |

Ambas são gratuitas (Google Fonts) e cobrem bem o português:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Outfit:wght@300..700&display=swap" rel="stylesheet">
```

> A **Fraunces** é variável e tem eixo óptico (`opsz`). Use `font-optical-sizing: auto`
> para que títulos grandes ganhem o corte display (mais contraste e personalidade).

---

## 2. Escala tipográfica

Escala modular (~1.25). Tamanhos em `rem` (base 16px).

| Estilo | Token | Tamanho | Peso | Fonte | Uso |
|--------|-------|---------|------|-------|-----|
| Display | `--text-4xl` | 56px | 700 | Fraunces | Capa, número-herói |
| H1 | `--text-3xl` | 40px | 700 | Fraunces | Título de slide/página |
| H2 | `--text-2xl` | 32px | 600 | Fraunces | Título de seção |
| H3 | `--text-xl` | 24px | 600 | Fraunces | Subtítulo |
| Body L | `--text-lg` | 18px | 400 | Outfit | Texto de abertura |
| Body | `--text-base` | 16px | 400 | Outfit | Texto padrão |
| Small | `--text-sm` | 14px | 400 | Outfit | Legendas, notas |
| Caption | `--text-caption` | 12px | 400 | Outfit | Rodapés, créditos |
| **Overline** | `--text-overline` | 12px | 600 | Outfit | Rótulo **MAIÚSCULO** sobre títulos |

---

## 3. O padrão "Overline + Título"

A marca registrada do template: um rótulo pequeno em maiúsculas espaçadas (ex.: `CREATIVE DESIGN`)
acima de um título forte. Aqui o **overline é em Outfit** (sans) e o **título em Fraunces** (serif) —
o contraste serif/sans é o que cria a tensão visual. O overline usa **verde** ou **ouro**.

```html
<p class="overline">CREATIVE DESIGN</p>
<h2 class="h2">Business template</h2>
```

```css
.overline {
  font-family: var(--font-brand);            /* Outfit (sans) */
  font-size: var(--text-overline);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-overline);  /* 0.18em */
  text-transform: uppercase;
  color: var(--color-primary);               /* verde */
}
.h2 {
  font-family: var(--font-display);          /* Fraunces (serif) */
  font-optical-sizing: auto;
  font-weight: var(--weight-semibold);
}
```

---

## 4. Pesos

| Peso | Valor | Uso |
|------|-------|-----|
| Light | 300 | Detalhes, números "vazados" (opcional) |
| Regular | 400 | Corpo de texto (Outfit) e títulos leves (Fraunces) |
| Medium | 500 | Ênfase leve, rótulos de UI |
| Semibold | 600 | H2, H3, overline, botões, wordmark |
| Bold | 700 | H1, display (Fraunces) |

---

## 5. Entrelinha e espaçamento

| Token | Valor | Uso |
|-------|-------|-----|
| `--leading-tight` | 1.15 | Títulos grandes |
| `--leading-snug` | 1.3 | Subtítulos |
| `--leading-normal` | 1.6 | Corpo de texto |
| `--tracking-tight` | −0.02em | Títulos display (Fraunces) |
| `--tracking-overline` | 0.18em | Rótulos em maiúsculas (Outfit) |

> **Wordmark "Halo":** Outfit, peso 600, tracking neutro/levemente fechado (≈ −0.01em),
> só o **H** maiúsculo. Sem maiúsculas, sem tracking largo — leitura limpa estilo Gemini/Claude/Apple.

---

## 6. Boas práticas

✅ Serifa (Fraunces) **só nos títulos**; corpo sempre em Outfit (sans).
✅ Hierarquia clara: 1 H1 por tela, `font-optical-sizing: auto` nos títulos.
✅ Linhas de corpo com 60–80 caracteres.
✅ Números de destaque (estatísticas) em Fraunces, grandes — ficam elegantes em serifa.

❌ Não use serifa em parágrafos longos (mantém o corpo em sans).
❌ Não misture mais de 2 famílias além da serifa de título.
❌ Evite texto em maiúsculas em parágrafos inteiros — só em overlines/rótulos (Outfit).

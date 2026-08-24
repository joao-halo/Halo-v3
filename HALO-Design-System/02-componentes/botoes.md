# Botões — HALO Design System

Botões HALO são **pílula** (`--radius-full`), como na referência da marca, com tipografia
Outfit semibold e bastante padding horizontal.

---

## 1. Variantes

| Variante | Fundo | Texto | Uso |
|----------|-------|-------|-----|
| **Primário** | gradiente esmeralda (verde→azul) | branco | Ação principal (1 por tela) |
| **Sólido** | verde 500 | branco | Ação principal alternativa |
| **Secundário** | azul 500 | branco | Ação de apoio |
| **Destaque** | ouro 500 | **neutro 900** | Chamada premium/atenção |
| **Contorno** | transparente, borda verde | verde 700 | Ação secundária discreta |
| **Fantasma** | transparente | verde 700 | Ações terciárias, em barras |

> Lembrete de acessibilidade: no botão **Destaque (ouro)** o texto é **escuro**, nunca branco.

---

## 2. Tamanhos

| Tamanho | Altura | Padding | Fonte |
|---------|--------|---------|-------|
| `sm` | 32px | 8×16px | 14px |
| `md` (padrão) | 44px | 12×24px | 16px |
| `lg` | 56px | 16×32px | 18px |

---

## 3. Estados

- **Hover:** escurece um tom (ex.: verde 500 → 600) + leve `--shadow-md`.
- **Active:** sem sombra, desloca 1px para baixo.
- **Focus:** anel de foco `outline: 2px solid var(--blue-400)` com `outline-offset: 2px`.
- **Disabled:** opacidade 45%, `cursor: not-allowed`.

---

## 4. CSS de referência

```css
.btn {
  font-family: var(--font-brand);
  font-weight: var(--weight-semibold);
  font-size: var(--text-base);
  border-radius: var(--radius-full);
  padding: 12px 24px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--duration) var(--ease);
}

.btn--primary   { background: var(--gradient-emerald); color: #fff; }
.btn--solid     { background: var(--color-primary);    color: #fff; }
.btn--secondary { background: var(--color-secondary);  color: #fff; }
.btn--accent    { background: var(--color-accent);     color: var(--neutral-900); }
.btn--outline   { background: transparent; border-color: var(--green-500); color: var(--green-700); }
.btn--ghost     { background: transparent; color: var(--green-700); }

.btn:hover  { box-shadow: var(--shadow-md); filter: brightness(0.96); }
.btn:focus-visible { outline: 2px solid var(--blue-400); outline-offset: 2px; }
.btn:disabled { opacity: 0.45; cursor: not-allowed; filter: none; }
```

```html
<button class="btn btn--primary">Saiba mais</button>
<button class="btn btn--outline">Falar com a equipe</button>
```

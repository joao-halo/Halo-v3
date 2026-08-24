# Cards e Blocos — HALO Design System

Os blocos reutilizáveis derivados diretamente do template corporativo, recoloridos
com a paleta HALO.

---

## 1. Card básico

Fundo branco, raio `md`, sombra `md`, padding `--space-6` (32px).

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}
.card:hover { box-shadow: var(--shadow-lg); }
```

**Anatomia:** [ícone/imagem] → overline (verde) → título (H3) → texto → link/CTA.

---

## 2. Bloco de estatística

O número-herói do template (ex.: `190.729`). Número grande em Fraunces (serif), rótulo em ouro.

```html
<div class="stat">
  <span class="stat__value">190.729</span>
  <span class="stat__label">CLIENTES ATENDIDOS</span>
  <p class="stat__desc">Texto curto de apoio à métrica.</p>
</div>
```

```css
.stat__value { font-family: var(--font-display); font-weight: 700; font-size: var(--text-3xl); color: var(--color-primary); }
.stat__label { font-size: var(--text-overline); letter-spacing: var(--tracking-overline); text-transform: uppercase; color: var(--color-accent); }
```

Use em **trios** (3 colunas). Combine 1 valor verde + 1 azul + 1 ouro para variar.

---

## 3. Card de equipe

Foto (retangular, raio `md`), nome (H3), cargo (overline verde), bio curta.

```html
<div class="card team">
  <img src="foto.jpg" alt="Nome" class="team__photo">
  <h3 class="team__name">Ana Souza</h3>
  <p class="overline">DIRETORA DE OPERAÇÕES</p>
  <p class="team__bio">Uma linha ou duas de descrição.</p>
</div>
```

Disposição em grade de 3 ou 4 colunas. Fotos com tratamento consistente (mesmo enquadramento).

---

## 4. Bloco de feature (ícone)

Ícone em círculo + título + texto. Padrão de "serviços" do template.

```html
<div class="feature">
  <div class="feature__icon"><!-- ícone SVG --></div>
  <h3>Eficiência</h3>
  <p>Descrição curta do benefício.</p>
</div>
```

```css
.feature__icon {
  width: 64px; height: 64px;
  display: grid; place-items: center;
  border-radius: var(--radius-full);
  background: var(--green-50);
  color: var(--color-primary);
}
```

Variação: ícone com fundo `--gradient-emerald` e ícone branco para destaque.

---

## 5. Bloco escuro (grafite)

A "caixa charcoal" do template — cria ritmo e destaca chamadas.

```css
.block--dark {
  background: var(--color-surface-dark);   /* neutro 800 */
  color: var(--color-text-inverse);
  padding: var(--space-7);
  border-radius: var(--radius-lg);
}
.block--dark .overline { color: var(--color-accent); }  /* overline em ouro */
```

Variação premium: `background: var(--gradient-dark);` (grafite → verde escuro).

---

## 6. Linha de processo (etapas)

Sequência numerada com setas — o fluxo do template.

`01 → 02 → 03`. Número em Fraunces 700, fio/seta em ouro, título em verde.
Use em 3–5 etapas no máximo; mantenha o texto de cada etapa curto e paralelo.

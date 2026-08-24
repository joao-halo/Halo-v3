# Cores — HALO Design System

A paleta HALO é composta por **três cores de marca** sobre uma base **neutra grafite**
herdada da linguagem corporativa limpa do template. O verde lidera, o azul apoia e o
ouro destaca.

---

## 1. Cores de marca

| Cor | Nome | HEX | RGB | Papel |
|-----|------|-----|-----|-------|
| 🟢 | Verde Esmeralda / *Deep Emerald Green* | `#006D40` | `0, 109, 64` | **Primária** — identidade, CTAs, títulos de seção |
| 🔵 | Azul Médio / *Medium Blue* | `#3D7CBF` | `61, 124, 191` | **Secundária** — apoio, links, dados, ícones |
| 🟡 | Amarelo Ouro / *Gold Yellow* | `#D4AF37` | `212, 175, 55` | **Destaque** — pontos de atenção, premium, detalhes |

> Proporção recomendada de uso: **60% neutro · 30% verde · ~7% azul · ~3% ouro.**
> O ouro é tempero, não base — use com parcimônia.

---

## 2. Escalas de cor

Cada cor de marca tem 10 tons (50 → 900). O tom **500** é a cor oficial.
Use tons claros (50–200) para fundos suaves e tons escuros (700–900) para texto sobre claro.

### Verde Esmeralda (primária)
`50 #E9F5EF` · `100 #C8E6D6` · `200 #92CDAC` · `300 #34B277` · `400 #08995A` · **`500 #006D40`** · `600 #005C36` · `700 #00472A` · `800 #00331E` · `900 #002415`

### Azul Médio (secundária)
`50 #ECF3FA` · `100 #CFE0F1` · `200 #A4C4E4` · `300 #79A8D6` · `400 #5E92CC` · **`500 #3D7CBF`** · `600 #33669D` · `700 #29507C` · `800 #1F3B5B` · `900 #15273B`

### Amarelo Ouro (destaque)
`50 #FBF6E7` · `100 #F5E9BE` · `200 #EBD485` · `300 #E1BF4D` · `400 #D9B23E` · **`500 #D4AF37`** · `600 #B0902C` · `700 #8A7122` · `800 #635119` · `900 #3D3210`

### Neutros — Grafite
`0 #FFFFFF` · `50 #F6F7F7` · `100 #ECEDEE` · `200 #D7D9DB` · `300 #B7BBBE` · `400 #8E9396` · `500 #6B7073` · `600 #4E5255` · `700 #3A3E40` · **`800 #2A2D2F`** · `900 #1B1D1E` · `950 #0F1011`

> O **neutro 800 (`#2A2D2F`)** é o "charcoal" das caixas escuras do template corporativo —
> use-o em blocos de destaque, capas e seções invertidas.

---

## 3. Gradientes (assinatura HALO)

O anel do logotipo combina as três cores. Reproduzimos isso em gradientes nomeados:

| Token | Composição | Uso |
|-------|------------|-----|
| `--gradient-brand` (Aurora) | ouro → verde → azul, 135° | Logo, capas, elementos de marca |
| `--gradient-emerald` | verde → azul, 135° | **Botão principal / CTA** |
| `--gradient-gold` | ouro → verde, 135° | Destaques premium |
| `--gradient-sun` | ouro → azul, 135° | Cabeçalhos, banners suaves |
| `--gradient-dark` | grafite → verde escuro | Seções escuras |

---

## 4. Papéis semânticos

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | verde 500 | Ação principal, marca |
| `--color-secondary` | azul 500 | Ação/elemento secundário |
| `--color-accent` | ouro 500 | Destaque pontual |
| `--color-text` | neutro 900 | Texto padrão |
| `--color-text-muted` | neutro 500 | Texto auxiliar |
| `--color-bg` | branco | Fundo padrão |
| `--color-surface-dark` | neutro 800 | Blocos escuros |
| `--color-success` | `#1F9159` | Sucesso |
| `--color-info` | azul 500 | Informação |
| `--color-warning` | ouro 500 | Atenção |
| `--color-danger` | `#C8372D` | Erro |

---

## 5. Acessibilidade (contraste)

| Combinação | Contraste | Status |
|------------|-----------|--------|
| Texto neutro 900 sobre branco | 16.1:1 | ✅ AAA |
| Branco sobre verde 500 | 5.9:1 | ✅ AA (texto normal e grande) |
| Branco sobre azul 500 | 4.0:1 | ✅ AA grande / ⚠️ usar ≥18px |
| **Branco sobre ouro 500** | 1.9:1 | ❌ **Nunca** — use texto escuro sobre ouro |
| Neutro 900 sobre ouro 500 | 8.3:1 | ✅ AAA |

**Regra de ouro:** sobre o **Amarelo Ouro** o texto é sempre **escuro** (neutro 900).
Sobre verde e azul, texto **branco**.

---

## 6. Boas práticas

✅ **Faça**
- Use branco/neutros como base e o verde como cor condutora.
- Reserve o ouro para 1 ponto de destaque por tela.
- Use gradientes em superfícies grandes (capas, botões), não em texto pequeno.

❌ **Evite**
- Texto branco sobre ouro.
- Usar as três cores com a mesma força ao mesmo tempo (poluição visual).
- Gradientes em blocos de texto corrido.

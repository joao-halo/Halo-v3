# HALO — Design System

Sistema de design da **HALO**: a sofisticação **corporativa, limpa e profissional** do
template de referência, aplicada à **paleta de marca HALO** (Verde Esmeralda, Azul Médio
e Amarelo Ouro).

> **Princípio condutor:** base neutra e muito respiro · verde como cor condutora · azul de
> apoio · ouro como destaque pontual · gradiente *Aurora* como assinatura.

---

## 🎨 Identidade em 1 minuto

| | |
|---|---|
| **Cores** | 🟢 `#006D40` Verde Esmeralda · 🔵 `#3D7CBF` Azul Médio · 🟡 `#D4AF37` Amarelo Ouro · ⬛ `#2A2D2F` Grafite |
| **Tipografia** | Fraunces serifada (títulos) + Outfit sans (corpo) · wordmark **Halo** em Outfit |
| **Forma** | Imagens/caixas retas (corporativo) + botões pílula (marca) |
| **Assinatura** | Gradiente *Aurora*: ouro → verde → azul |

👉 **Abra o [`showcase.html`](showcase.html)** no navegador para ver tudo aplicado.

---

## 📁 Estrutura

```
HALO-Design-System/
├── README.md                       ← você está aqui
├── showcase.html                   ← demonstração visual (abra no navegador)
│
├── assets/
│   └── halo-logo.svg               ← símbolo do anel HALO (SVG vetorial)
│
├── 01-fundamentos/
│   ├── cores.md                    ← paleta, escalas, gradientes, contraste
│   ├── tipografia.md               ← fontes, escala, pesos
│   ├── espacamento-e-layout.md     ← grade 8px, raios, sombras, slides
│   └── logotipo-e-marca.md         ← uso do logo e tom de voz
│
├── 02-componentes/
│   ├── botoes.md                   ← variantes, tamanhos, estados
│   ├── cards-e-blocos.md           ← cards, estatísticas, equipe, features
│   └── padroes-de-slide.md         ← layouts de apresentação 16:9
│
└── 03-tokens/
    ├── tokens.css                  ← variáveis CSS (fonte de verdade)
    └── tokens.json                 ← tokens em JSON (para ferramentas/código)
```

---

## 🚀 Como usar

**Em web / código**
```html
<link rel="stylesheet" href="03-tokens/tokens.css">
```
```css
.botao-cta { background: var(--gradient-emerald); color: #fff; border-radius: var(--radius-full); }
```

**Em apresentações / documentos**
Configure o tema com as cores e fontes acima e siga `02-componentes/padroes-de-slide.md`.

**Cores rápidas para copiar**
`#006D40` · `#3D7CBF` · `#D4AF37` · `#2A2D2F` · `#F6F7F7` · `#FFFFFF`

---

## 🤖 Como usar com o Claude

Para o Claude gerar materiais já no padrão HALO, comece o pedido com:

> *"Use o design system em `HALO-Design-System/`. Cores: verde `#006D40` (primária),
> azul `#3D7CBF` (secundária), ouro `#D4AF37` (destaque), grafite `#2A2D2F`.
> Fontes Fraunces (títulos, serifada) + Outfit (corpo, sans); wordmark "Halo" em Outfit.
> Botões pílula, imagens retas, muito respiro.
> [seu pedido: ex. 'crie uma landing page de captação de leads' ou 'um deck de 8 slides']."*

Exemplos de pedidos:
- "Crie uma landing page seguindo o HALO Design System."
- "Gere um slide de estatísticas usando os blocos de `cards-e-blocos.md`."
- "Monte um e-mail HTML com os tokens de `03-tokens/tokens.css`."

---

## ✅ Regras de ouro

1. **Texto sobre ouro é sempre escuro** (nunca branco) — contraste.
2. **Um destaque de ouro por tela.** Ouro é tempero.
3. **Múltiplos de 8px** no espaçamento.
4. **Um H1 por tela** e hierarquia tipográfica clara.
5. **Gradiente em superfícies grandes**, nunca em texto pequeno.

---

*HALO Design System · v1.0 · inspirado em layout corporativo + paleta de marca HALO.*
